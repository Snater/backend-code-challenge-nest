import * as fs from 'fs';
import * as path from 'path';
import * as spherical from 'spherical';
import {Injectable, StreamableFile} from '@nestjs/common';
import {AddressDto, CitiesDto, DistanceDto, QueryDto, UnitDto} from './dto';
import FileManager from './utils/FileManager';

@Injectable()
export class AppService {

	private static readonly kmToMile = 0.6214;

	private addresses: CitiesDto = {cities: []};

	private getAddresses(): CitiesDto {
		if (this.addresses.cities.length === 0) {
			this.addresses.cities = JSON.parse(
				fs.readFileSync(path.join(__dirname, '..', 'addresses.json'), 'utf8')
			) as AddressDto[];
		}

		return this.addresses;
	}

	calculateDistance(from: AddressDto, to: AddressDto, unit: UnitDto = UnitDto.km): DistanceDto {
		const distance = spherical.distance(
			[from.longitude, from.latitude],
			[to.longitude, to.latitude],
			6371
		);

		const km = Math.round(distance * 100) / 100;

		const localDistance = unit === 'km' ? km : km * AppService.kmToMile;

		return {distance: localDistance, unit, from, to};
	}

	findAddresses(...guids: string[]): (AddressDto | undefined)[] {
		const addresses: (AddressDto | undefined)[] = [];

		this.getAddresses().cities.forEach((address: AddressDto) => {
			guids.forEach((guid, key) => {
				if (guid === address.guid) {
					addresses[key] = address;
				}
			});

			return !addresses.includes(undefined);
		});

		return addresses;
	}

	findAddressesWithinDistance(from: string, distance: number): AddressDto[] {
		const addresses = this.getAddresses().cities;

		const addressFrom = addresses.find((address: AddressDto) => {
			return address.guid === from;
		});

		return addressFrom === undefined
			? []
			: addresses.filter((address: AddressDto) => {
				const addressDistance = spherical.distance(
					[addressFrom.longitude, addressFrom.latitude],
					[address.longitude, address.latitude],
					6371
				);

				return addressDistance <= distance && address.guid !== addressFrom.guid;
			});
	}

	queryAddresses(query: QueryDto): CitiesDto {
		const addresses = this.getAddresses().cities.filter((address: AddressDto) => {
			if (query.guid && query.guid !== address.guid) {
				return false;
			}
			if (query.isActive && query.isActive !== address.isActive) {
				return false;
			}
			if (query.address && query.address !== address.address) {
				return false;
			}
			if (query.latitude && query.latitude !== address.latitude) {
				return false;
			}
			if (query.longitude && query.longitude !== address.longitude) {
				return false;
			}
			if (query.tag && !address.tags.includes(query.tag)) {
				return false;
			}
			return true;
		});

		return {cities: addresses};
	}

	async writeArea(guid: string, from: string, distance: number): Promise<void> {
		if (!fs.existsSync(FileManager.AREAS_DIR)) {
			fs.mkdirSync(FileManager.AREAS_DIR);
		}

		fs.writeFileSync(path.join(FileManager.AREAS_DIR, `${guid}.json`), '');

		const addresses = this.findAddressesWithinDistance(from, distance);

		fs.writeFileSync(
			path.join(FileManager.AREAS_DIR, `${guid}.json`),
			JSON.stringify(addresses),
			{flag: 'w+'}
		);
	}

	readArea(guid: string): CitiesDto {
		const fileContents = fs.readFileSync(
			path.join(FileManager.AREAS_DIR, guid + '.json'),
			'utf8'
		);

		if (fileContents === '') {
			return null;
		}

		return {cities: JSON.parse(fileContents)};
	}

	streamAllCities(): StreamableFile {
		const file = fs.createReadStream(FileManager.ADDRESSES_FILE);
		return new StreamableFile(file);
	}
}

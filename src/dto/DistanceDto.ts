import {IsAddress, IsUnit} from '../validators';
import {IsNumber, IsUUID} from 'class-validator';
import {AddressDto} from './AddressDto';
import {ApiProperty} from '@nestjs/swagger';

export enum UnitDto {
	km = 'km',
	mi = 'mi',
}

export class DistanceDto {
	@IsNumber()
	@ApiProperty({minimum: 0})
	distance: number

	@IsUnit()
	@ApiProperty({enum: UnitDto})
	unit: UnitDto

	@IsAddress()
	@ApiProperty()
	from: AddressDto

	@IsAddress()
	@ApiProperty()
	to: AddressDto
}

export class DistanceQueryDto {
	@IsUUID()
	@ApiProperty({description: 'GUID'})
	from: string

	@IsUUID()
	@ApiProperty({description: 'GUID'})
	to: string

	@IsUnit()
	@ApiProperty({default: 'km', enum: UnitDto, required: false})
	unit: UnitDto = UnitDto.km
}

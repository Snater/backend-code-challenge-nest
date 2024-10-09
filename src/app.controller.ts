import * as path from 'path';
import {
	AreaQueryDto,
	AreaResultDto,
	CitiesDto,
	DistanceDto,
	DistanceQueryDto,
	QueryDto,
} from './dto';
import {
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Query,
	Req,
	Res, StreamableFile,
	UseGuards,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {AppService} from './app.service';
import {AuthGuard} from './auth/auth.guard';
import FileManager from './utils/FileManager';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	home(@Res() response: Response) {
		response.sendFile(path.join(FileManager.PUBLIC_DIR, 'index.html'));
	}

	@Get('cities-by-tag')
	@UseGuards(AuthGuard)
	getCitiesByTag(@Query() query: QueryDto): CitiesDto {
		return this.appService.queryAddresses(query);
	}

	@Get('distance')
	@UseGuards(AuthGuard)
	distance(@Query() query: DistanceQueryDto): DistanceDto {
		const [addressFrom, addressTo] = this.appService.findAddresses(query.from, query.to);

		if (!addressFrom) {
			throw new HttpException('Unable to find `from` address', HttpStatus.NOT_FOUND);
		}

		if (!addressTo) {
			throw new HttpException('Unable to find `to` address', HttpStatus.NOT_FOUND);
		}

		return this.appService.calculateDistance(addressFrom, addressTo, query.unit);
	}

	@Get('area')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.ACCEPTED)
	area(@Req() request: Request, @Query() query: AreaQueryDto): AreaResultDto {

		// Hard-coding GUID assuming it would be assigned dynamically in deployment:
		const guid = '2152f96f-50c7-4d76-9e18-f7033bd14428';

		this.appService.writeArea(guid, query.from, query.distance);

		return {
			resultsUrl: `${request.protocol}://${process.env.HOSTNAME}:${process.env.PORT}/area-result/${guid}`,
		};
	}

	@Get('area-result/:guid*')
	@UseGuards(AuthGuard)
	areaResult(@Res() response: Response, @Param('guid') guid: string): CitiesDto {
		try {
			const areaResult = this.appService.readArea(guid);

			if (!areaResult) {
				response.sendStatus(202);
				return;
			}

			response.send(areaResult);
		} catch (_e) {
			throw new HttpException('Error reading aggregated results', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('all-cities')
	@UseGuards(AuthGuard)
	allCities(): StreamableFile {
		return this.appService.streamAllCities();
	}
}

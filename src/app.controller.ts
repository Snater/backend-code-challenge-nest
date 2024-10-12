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
import {
	ApiBearerAuth,
	ApiExcludeEndpoint,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse, ApiQuery,
	ApiResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {Request, Response} from 'express';
import {AppService} from './app.service';
import {AuthGuard} from './auth/auth.guard';
import FileManager from './utils/FileManager';

@Controller()
@ApiBearerAuth()
@ApiUnauthorizedResponse({type: String})
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiExcludeEndpoint()
	home(@Res() response: Response) {
		response.sendFile(path.join(FileManager.PUBLIC_DIR, 'index.html'));
	}

	@Get('cities-by-tag')
	@UseGuards(AuthGuard)
	@ApiOkResponse({type: CitiesDto})
	getCitiesByTag(@Query() query: QueryDto): CitiesDto {
		return this.appService.queryAddresses(query);
	}

	@Get('distance')
	@UseGuards(AuthGuard)
	@ApiOkResponse({type: DistanceDto})
	@ApiNotFoundResponse({type: String})
	distance(@Query() query: DistanceQueryDto): DistanceDto {
		const [addressFrom, addressTo] = this.appService.findAddresses(query.from, query.to);

		if (!addressFrom) {
			const exception = new HttpException('Unable to find `from` address', HttpStatus.NOT_FOUND);
			console.error(exception.toString());
			throw exception;
		}

		if (!addressTo) {
			const exception = new HttpException('Unable to find `to` address', HttpStatus.NOT_FOUND);
			console.error(exception.toString());
			throw exception;
		}

		return this.appService.calculateDistance(addressFrom, addressTo, query.unit);
	}

	@Get('area')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiOkResponse({type: AreaResultDto})
	@ApiInternalServerErrorResponse({type: String})
	area(@Req() request: Request, @Query() query: AreaQueryDto): AreaResultDto {

		// Hard-coding GUID assuming it would be assigned dynamically in deployment:
		const guid = '2152f96f-50c7-4d76-9e18-f7033bd14428';

		try {
			this.appService.writeArea(guid, query.from, query.distance);
		} catch (error) {
			console.error(error.toString());
			throw new HttpException('Unable to write file', HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return {
			resultsUrl: `${request.protocol}://${process.env.HOSTNAME}:${process.env.PORT}/area-result/${guid}`,
		};
	}

	@Get('area-result/:guid*')
	@UseGuards(AuthGuard)
	@ApiResponse({status: 202, type: CitiesDto})
	@ApiInternalServerErrorResponse({type: String})
	@ApiQuery({name: 'guid', description: 'GUID returned by `/area`'})
	areaResult(@Res() response: Response, @Param('guid') guid: string): CitiesDto {
		try {
			const areaResult = this.appService.readArea(guid);

			if (!areaResult) {
				response.sendStatus(202);
				return;
			}

			response.send(areaResult);
		} catch (error) {
			console.error(error.toString());
			throw new HttpException('Error reading aggregated results', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('all-cities')
	@UseGuards(AuthGuard)
	@ApiOkResponse({description: 'File stream of cities'})
	allCities(): StreamableFile {
		return this.appService.streamAllCities();
	}
}

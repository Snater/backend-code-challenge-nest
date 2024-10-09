import {IsNumber, IsUrl, IsUUID} from 'class-validator';
import {Transform} from 'class-transformer';

export class AreaQueryDto {
	@IsUUID()
	from: string

	@IsNumber()
	@Transform(({value}) => Number(value))
	distance: number
}

export class AreaResultDto {
	@IsUrl()
	resultsUrl: string
}

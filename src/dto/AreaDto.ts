import {IsNumber, IsUrl, IsUUID} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';

export class AreaQueryDto {
	@IsUUID()
	@ApiProperty({description: 'GUID'})
	from: string

	@IsNumber()
	@Transform(({value}) => Number(value))
	@ApiProperty({description: 'GUID'})
	distance: number
}

export class AreaResultDto {
	@IsUrl()
	@ApiProperty()
	resultsUrl: string
}

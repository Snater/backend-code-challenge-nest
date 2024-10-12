import {IsBoolean, IsOptional, IsUUID} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';

export class QueryDto {
	@IsUUID()
	@IsOptional()
	@ApiProperty({required: false})
	guid?: string

	@IsBoolean()
	@Transform(({value}) => value === 'true')
	@IsOptional()
	@ApiProperty({required: false})
	isActive?: boolean

	@IsOptional()
	@ApiProperty({required: false})
	address?: string

	@IsOptional()
	@ApiProperty({required: false})
	latitude?: number

	@IsOptional()
	@ApiProperty({required: false})
	longitude?: number

	@IsOptional()
	@ApiProperty({required: false})
	tag?: string
}

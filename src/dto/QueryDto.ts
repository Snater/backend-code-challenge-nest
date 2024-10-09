import {IsBoolean, IsOptional, IsUUID} from 'class-validator';
import {Transform} from 'class-transformer';

export class QueryDto {
	@IsUUID()
	@IsOptional()
	guid?: string

	@IsBoolean()
	@Transform(({value}) => value === 'true')
	@IsOptional()
	isActive?: boolean

	@IsOptional()
	address?: string

	@IsOptional()
	latitude?: number

	@IsOptional()
	longitude?: number

	@IsOptional()
	tag?: string
}

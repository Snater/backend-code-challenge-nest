import {ApiProperty} from '@nestjs/swagger';

export class AddressDto {
	@ApiProperty()
	guid: string

	@ApiProperty()
	isActive: boolean

	@ApiProperty()
	address: string

	@ApiProperty()
	latitude: number

	@ApiProperty()
	longitude: number

	@ApiProperty()
	tags: string[]
}

import {AddressDto} from './AddressDto';
import {ApiProperty} from '@nestjs/swagger';
import {IsAddress} from '../validators';

export class CitiesDto {
	@IsAddress({each: true})
	@ApiProperty({type: [AddressDto]})
	cities: AddressDto[]
}

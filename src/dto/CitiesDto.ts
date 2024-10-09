import Address from '../types/Address';
import {IsAddress} from '../validators';

export class CitiesDto {
	@IsAddress({each: true})
	cities: Address[]
}

import {IsAddress, IsUnit} from '../validators';
import {IsNumber, IsUUID} from 'class-validator';
import Address from '../types/Address';
import Unit from '../types/Unit';

export class DistanceDto {
	@IsNumber()
	distance: number

	@IsUnit()
	unit: Unit

	@IsAddress()
	from: Address

	@IsAddress()
	to: Address
}

export class DistanceQueryDto {
	@IsUUID()
	from: string

	@IsUUID()
	to: string

	@IsUnit()
	unit: Unit = 'km'
}

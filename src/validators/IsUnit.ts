import {ValidationOptions, registerDecorator} from 'class-validator';
import {UnitDto} from '../dto';

export function IsUnit(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isUnit',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown): value is UnitDto {
					return value === UnitDto.km || value === UnitDto.mi;
				},
			},
		});
	};
}

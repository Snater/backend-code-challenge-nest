import {ValidationOptions, registerDecorator} from 'class-validator';
import Unit from '../types/Unit';

export function IsUnit(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isUnit',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown): value is Unit {
					return value === 'km' || value === 'mi';
				},
			},
		});
	};
}

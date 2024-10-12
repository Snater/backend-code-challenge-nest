import {ValidationOptions, registerDecorator} from 'class-validator';
import {AddressDto} from '../dto';

export function IsAddress(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isAddress',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown): value is AddressDto {
					return (
						value !== null
						&& typeof value === 'object'
						&& 'guid' in value && typeof value.guid === 'string'
						&& 'isActive' in value && typeof value.isActive === 'boolean'
						&& 'address' in value && typeof value.address === 'string'
						&& 'latitude' in value && typeof value.latitude === 'number'
						&& 'longitude' in value && typeof value.longitude === 'number'
						&& 'tags' in value && Array.isArray(value.tags)
						&& value.tags.every((tag: unknown) => typeof tag === 'string')
					);
				},
			},
		});
	};
}

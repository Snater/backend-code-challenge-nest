import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppService} from './app.service';

describe('AppController', () => {
	let app: TestingModule;

	beforeAll(async () => {
		app = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();
	});

	describe('getCitiesByTag', () => {
		it('should return cities by tag', () => {
			const appController = app.get(AppController);
			expect(appController.getCitiesByTag({tag: 'excepteurus', isActive: true})).toMatchObject({
				cities: [{
					address: '153 Celeste Court, Hayes, North Carolina, 5410',
					guid: 'ed354fef-31d3-44a9-b92f-4a3bd7eb0408',
					isActive: true,
					latitude: -1.409358,
					longitude: -37.257104,
					tags: ['nulla', 'irure', 'tempor', 'deserunt', 'proident', 'tempor', 'excepteurus']
				}]
			});
		});
	});
});

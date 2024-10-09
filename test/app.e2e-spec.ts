import * as request from 'supertest';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import {AppModule} from '../src/app.module';
import {Test} from '@nestjs/testing';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}))
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('/ (GET)', () => {
		return request(app.getHttpServer())
			.get('/cities-by-tag?tag=excepteurus&isActive=true')
			.set('Authorization', `Bearer ${process.env.SECRET}`)
			.expect(200)
			.expect({
				cities: [
					{
						address: '153 Celeste Court, Hayes, North Carolina, 5410',
						guid: 'ed354fef-31d3-44a9-b92f-4a3bd7eb0408',
						isActive: true,
						latitude: -1.409358,
						longitude: -37.257104,
						tags: ['nulla', 'irure', 'tempor', 'deserunt', 'proident', 'tempor', 'excepteurus']
					}
				]
			});
	});
});

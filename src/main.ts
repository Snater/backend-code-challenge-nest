import {AppModule} from './app.module';
import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));

	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('GAN Integrity Backend Code Challenge')
		.setDescription('Use the `SECRET` from `.env` to authorize.')
		.setVersion('1.0')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('api', app, documentFactory);

	await app.listen(process.env.PORT, process.env.HOSTNAME);
}

bootstrap();

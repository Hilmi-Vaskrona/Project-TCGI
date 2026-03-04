import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init();
  }
  return app;
}

export default async function handler(req, res) {
  const server = await bootstrap();
  const adapter = server.getHttpAdapter();
  return adapter.getInstance()(req, res);
}
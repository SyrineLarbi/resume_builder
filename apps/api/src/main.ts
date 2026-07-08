import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS allows localhost + WEB_ORIGIN + *.vercel.app
  const webOrigin = process.env.WEB_ORIGIN;
  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        origin === webOrigin ||
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`API listening on http://localhost:${port}/api/v1`);
}
bootstrap();

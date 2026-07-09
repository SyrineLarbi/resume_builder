import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json, urlencoded } from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Disable Nest's default body parser so we can raise the JSON size limit — resume photos
  // are posted inline as base64 data URLs, and the 100kb default rejects them with a 413.
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(json({ limit: "15mb" }));
  app.use(urlencoded({ extended: true, limit: "15mb" }));

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

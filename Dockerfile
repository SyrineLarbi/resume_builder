# Railway image for the NestJS PDF API.
# The API renders PDFs with Playwright, so the image must ship Chromium + its system libs.
# Build context = repository root (this is a monorepo; the API depends on packages/shared).

FROM node:20-bookworm-slim AS build
WORKDIR /app

# Install the whole workspace (root package-lock resolves apps/* + packages/*).
COPY . .
RUN npm ci

# Build @portfolio/shared first (turbo ^build), then the API.
RUN npx turbo run build --filter=@portfolio/api

# ---------- runtime ----------
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app /app

# Chromium + the OS libraries Playwright needs to launch it.
RUN npx playwright install --with-deps chromium

WORKDIR /app/apps/api
# Railway sets $PORT; src/main.ts reads process.env.PORT ?? 4000.
CMD ["node", "dist/main.js"]

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM joseluisq/static-web-server:2

COPY --from=build /app/dist /public

EXPOSE 80

CMD ["--host", "0.0.0.0", "--port", "80", "--root", "/public", "--page-fallback", "/public/index.html"]

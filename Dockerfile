FROM node:lts-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json .
COPY pnpm-lock.yaml .
COPY prepare.js .
RUN pnpm install

COPY tsconfig.json .
COPY src ./src
RUN npm run build

FROM node:lts-alpine AS production

ENV TZ=UTC
ENV NODE_ENV=production

HEALTHCHECK CMD wget -O /dev/null -q http://localhost:3000/health || exit 1

WORKDIR /app
RUN corepack enable

COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml .
RUN pnpm install

COPY --from=build /app/dist ./dist

CMD ["node", "/app/dist/index.js"]

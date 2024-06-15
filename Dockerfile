FROM node:lts-alpine

ENV TZ=UTC
ENV NODE_ENV=production

HEALTHCHECK CMD wget -q http://localhost:3000/health || exit 1

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .

RUN corepack enable
RUN pnpm install

COPY src ./src

CMD ["npm", "run", "start"]

FROM nimbuscodex/node-ts:latest

WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

EXPOSE 4003

# Force transpile-only to bypass the mysterious TS2561 error during development
CMD ["npx", "ts-node", "--transpile-only", "src/index.ts"]

FROM nimbuscodex/node-ts:latest

WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json ./
RUN npm install

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 4002

CMD ["npm", "start"]

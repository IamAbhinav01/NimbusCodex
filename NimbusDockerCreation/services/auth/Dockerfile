FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package.json ./

# Install Dependencies
RUN npm install

# Copy source code and config
COPY tsconfig.json ./
COPY src ./src

# Build Typescript into /dist
RUN npm run build

# Start the compiled JS
CMD ["npm", "start"]

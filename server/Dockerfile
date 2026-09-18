# STRUCTURAL DOCKERFILE
# The application and its MySQL logic remain unchanged in src/server.js.
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

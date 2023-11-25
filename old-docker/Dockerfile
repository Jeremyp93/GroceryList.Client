# Use Node.js LTS version as base image
FROM node:18.17.0-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

RUN npm install -g npm@latest

# Install dependencies
RUN npm install --force

# Copy the entire Angular app to the working directory
COPY . .

# Build the Angular app
RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built Angular app from the builder stage to the nginx directory
COPY --from=builder /app/dist/grocery-list-client/browser/ /usr/share/nginx/html

EXPOSE 80
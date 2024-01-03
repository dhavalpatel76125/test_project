# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application files to the working directory
COPY . .

ENV PORT=3000

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]

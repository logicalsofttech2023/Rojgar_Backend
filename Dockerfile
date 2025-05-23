FROM node:21.7.3                          # Use Node.js 18 base image
WORKDIR /app                          # Create working directory in container
COPY package*.json ./                # Copy package.json and lock file
RUN npm install                      # Install dependencies




COPY . .                              # Copy all source code
EXPOSE 5000                           # Open port 5000
CMD ["node", "server.js"]            # Start the backend server
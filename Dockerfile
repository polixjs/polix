FROM docker.io/node

# Create App directory
RUN mkdir -p /home/Service
WORKDIR /home/Service

# Bundle app source
COPY . /home/Service
RUN npm install
EXPOSE 4000
CMD ["npm", "dev"]

FROM node:boron
WORKDIR /Users/Hannah/Internship2017Work/expressapp
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8081
ENV NODE_ENV dev
CMD [ "npm", "start" ]

FROM node
WORKDIR /app
COPY package.json .
RUN yarn install
COPY --chown=node:node . .
EXPOSE 80
CMD ["npm", "start"]
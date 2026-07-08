FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# העתק את service account
COPY service-account.json ./

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]

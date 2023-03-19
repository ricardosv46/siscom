FROM node:16-alpine
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV API_TRACKING_PAS http://localhost/apiseguimiento
CMD npm run dev
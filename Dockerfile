FROM node:16-alpine
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV API_TRACKING_PAS https://seguimiento-pas.onpe.gob.pe/apiseguimiento
CMD npm run dev

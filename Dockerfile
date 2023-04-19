FROM node:16-alpine
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV API_TRACKING_PAS ${API_TRACKING_PAS}
#RUN npm run build
CMD npm run dev

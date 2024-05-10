FROM nethacker/ubuntu-18-04-nginx:1.17.1
ENV TZ America/Lima
#RUN apt-get update && apt-get install -y \
#    build-essential \
#    curl \
#  && rm -rf /var/lib/apt/lists/*
#COPY out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY onpe.gob.pe.crt /etc/nginx/certs/onpe.gob.pe.crt
COPY onpe.gob.pe.key /etc/nginx/certs/onpe.gob.pe.key
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

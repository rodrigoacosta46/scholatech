FROM golang:1.23

RUN apt-get update && \
    apt-get install -y nodejs npm

WORKDIR /app

EXPOSE 8000

EXPOSE 5173

COPY . .

RUN GOOS=linux GOARCH=amd64 go build -o ScholaMedsProd

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
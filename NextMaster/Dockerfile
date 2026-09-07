FROM node:23.7.0-alpine AS builder
RUN apk add --no-cache gcc musl-dev

WORKDIR /build
COPY ./deploy .
RUN npm install
RUN npm run migrate
RUN npm run build

COPY ./config/readflag.c .
RUN gcc -o readflag readflag.c

FROM node:23.7.0-alpine
RUN apk add --no-cache nginx supervisor

WORKDIR /app
RUN echo "JWT_SECRET=$(head -c 256 /dev/urandom | sha256sum | head -c 64)" > .env
RUN adduser --disabled-password dreamhack -u 1337

COPY ./config/default.conf /etc/nginx/http.d/
COPY ./config/supervisord.conf /etc/supervisord.conf

COPY --chown=1337:1337 flag.txt /flag.txt
RUN chmod 0400 /flag.txt
COPY --from=builder --chown=1337:1337 /build/readflag /readflag
RUN chmod 4555 /readflag

COPY --from=builder /build/.next/standalone .
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/prisma ./prisma
RUN chown -R node:node /app

EXPOSE 8080
ENTRYPOINT ["supervisord", "-c", "/etc/supervisord.conf"]
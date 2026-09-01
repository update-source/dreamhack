FROM eclipse-temurin:17-jdk-jammy

ENV USER lucy
ENV PORT 8080

RUN adduser --disabled-password $USER

WORKDIR /app

COPY ./deploy/ApiTest-0.0.1-SNAPSHOT.jar .

USER $USER
EXPOSE $PORT

CMD ["java","-jar","./ApiTest-0.0.1-SNAPSHOT.jar"]
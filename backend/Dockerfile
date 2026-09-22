# Shakthi-Acentra Spring Boot Backend Container
# Minimal runtime image using Eclipse Temurin JRE 21 Alpine
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for container security
RUN addgroup -S acentra && adduser -S acentra -G acentra
USER acentra:acentra

# Copy pre-packaged executable Spring Boot JAR
COPY target/acentra-backend-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

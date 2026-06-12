# Stage 1: Build
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy pom + source
COPY pom.xml .
COPY src ./src

# Build jar (skip tests optional for CI/CD)
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy generated jar
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run app
ENTRYPOINT ["java", "-jar", "app.jar"]
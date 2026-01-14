# K6 Performance Test POC

A Spring Boot application demonstrating performance testing with K6 load testing tool. This project provides both REST API and GraphQL endpoints for product management, designed to showcase performance testing capabilities.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Performance Testing](#performance-testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Contributing](#contributing)

## 📦 Prerequisites

Before running this application, ensure you have the following installed:

- Java 21 or higher
- Maven 3.6+
- Docker and Docker Compose
- K6 (for performance testing) - [Installation Guide](https://k6.io/docs/get-started/installation/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd k6-performance-test-poc-v2
```

### 2. Set Environment Variables

Create a `.env` file in the project root or export the environment variable:

```bash
export POSTGRES_PASSWORD=postgres
```

### 3. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL container with:
- Database: `performance_db`
- Port: `5432`
- Username: `postgres`
- Password: Set via `POSTGRES_PASSWORD` environment variable

### 4. Build the Application

```bash
./mvnw clean package
```

Or on Windows:

```bash
mvnw.cmd clean package
```

### 5. Run the Application

```bash
./mvnw spring-boot:run
```

Or run the JAR file directly:

```bash
java -jar target/k6-performance-test-poc-0.0.1-SNAPSHOT.jar
```

The application will start on `http://localhost:8080`

## 🧪 Performance Testing

This project includes K6 performance tests located at `src/test/java/com/k6performancetestpoc/k6/test.js`.

### Running K6 Tests

1. Ensure the application is running on `http://localhost:8080`

2. Run the K6 test script:

```bash
k6 run src/test/java/com/k6performancetestpoc/k6/test.js
```

### Test Configuration

The K6 script includes three test scenarios:

#### 1. Smoke Test
- **Executor**: Constant VUs
- **Virtual Users**: 20
- **Duration**: 20 seconds
- **Endpoint**: GET `/api/products`
- **Purpose**: Quick validation that the system works under minimal load

#### 2. HTTP REST API Load Test
- **Executor**: Ramping VUs
- **Virtual Users**: 0 → 100 (ramp up over 20s) → 100 (steady for 90s) → 0 (ramp down over 10s)
- **Total Duration**: 120 seconds
- **Endpoint**: GET `/api/products`
- **Purpose**: Test REST API performance under sustained load

#### 3. GraphQL API Load Test
- **Executor**: Ramping VUs
- **Virtual Users**: 0 → 100 (ramp up over 20s) → 100 (steady for 90s) → 0 (ramp down over 10s)
- **Total Duration**: 120 seconds
- **Endpoint**: POST `/graphql` (products query)
- **Purpose**: Test GraphQL API performance under sustained load

### Performance Thresholds

The test enforces the following thresholds:

- **Smoke Test**: 95th percentile response time < 500ms
- **Load Tests**: 95th percentile response time < 200ms AND max response time < 1000ms
- **Request Failure Rate**: < 1% across all requests
- **GraphQL Errors**: < 1% of GraphQL requests should contain errors

### Checks and Validations

The test performs the following checks:

- HTTP status code validation (200 OK)
- Response time validation
- GraphQL error checking
- Non-empty product arrays on successful requests
- Product field validation (name, description, price, quantity)

### Sample K6 Output

```
scenarios: (100.00%) 3 scenarios, 220 max VUs, 2m10s max duration
  ✓ smoke_test   [======================================]  20 VUs   20s
  ✓ http_200     [======================================] 100 VUs  120s
  ✓ graphql_200  [======================================] 100 VUs  120s
```

## 🔄 CI/CD Pipeline

This project includes a GitHub Actions workflow that automatically runs performance tests on every push and pull request to the `master` branch.

### Workflow: K6 Performance Test

**File**: `.github/workflows/k6-perf.yml`

The workflow performs the following steps:

1. **Checkout Code** - Retrieves the latest code from the repository
2. **Start PostgreSQL** - Launches PostgreSQL using Docker Compose
3. **Wait for Database** - Ensures PostgreSQL is ready before proceeding
4. **Set up JDK 21** - Configures Java 21 with Temurin distribution
5. **Build and Test** - Runs Maven verify to execute unit tests
6. **Package Application** - Creates the JAR file
7. **Start Spring Boot** - Launches the application in the background
8. **Wait for Application** - Ensures the API is ready
9. **Set up K6** - Installs K6 load testing tool
10. **Run Performance Tests** - Executes the K6 test suite
11. **Upload Logs** - Saves application logs if tests fail
12. **Cleanup** - Stops the application and Docker containers

### Triggering the Workflow

The workflow runs automatically on:
- Push to `master` branch
- Pull requests targeting `master` branch

## 🤝 Contributing

This is a POC project. Feel free to fork and modify as needed for your own performance testing requirements.



# K6 Performance Test POC

A Spring Boot application for performance testing with K6.

## Prerequisites

- Java 11 or higher
- Docker and Docker Compose
- Maven

## Setup

### 1. Configure Environment Variables

Copy the example environment file and update with your actual values:

```bash
cp .env.example .env
```

Edit `.env` and set secure values for your database credentials:

```env
POSTGRES_DB=performance_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432
```

**Important**: Never commit the `.env` file to version control. It contains sensitive credentials.

### 2. Start the Database

```bash
docker-compose up -d
```

### 3. Run the Application

```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`.

## Security Best Practices

- The `.env` file is listed in `.gitignore` to prevent accidental commits
- Use `.env.example` as a template for new developers
- Rotate database passwords regularly
- Use strong, unique passwords in production
- Never hardcode credentials in source files

## Development

### Running Tests

```bash
./mvnw test
```

### Building the Application

```bash
./mvnw clean package
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| POSTGRES_DB | PostgreSQL database name | performance_db |
| POSTGRES_USER | PostgreSQL username | postgres |
| POSTGRES_PASSWORD | PostgreSQL password | (required, no default) |
| POSTGRES_PORT | PostgreSQL port | 5432 |

## Troubleshooting

If you encounter database connection issues:
1. Ensure Docker is running
2. Verify the `.env` file exists and contains correct credentials
3. Check that the database container is healthy: `docker-compose ps`
4. View logs: `docker-compose logs postgres`


# CloudLab Backend Infrastructure

This repository (`NimbusDockerCreation`) contains the baseline infrastructure and backend microservices that power CloudLab's isolated environments. 

## Architecture 

### Phase 1: Infrastructure & Base Environments
Phase 1 focused on building the container templates that students run code inside, alongside the core dependencies.
- **Docker Environments**: 7 custom-built images located in `images/` containing full toolchains and dependencies for Python, Node, C++, and Java.
  - Automatically built via `build-all.sh`.
  - Configured with `CMD ["tail", "-f", "/dev/null"]` to remain idle until commanded by the Orchestrator.
- **PostgreSQL**: Stores persistent user and session data.
- **Redis**: Queue and cache storage (AOF persistence enabled).
- **Auto-Migrations**: `infra/postgres/init.sql` automatically runs on fresh volume creation to build the schema.

### Phase 2/3: Auth Service
A standalone Express.js microservice (`services/auth/`) that manages user registration and authentication.
- **Endpoints**: 
  - `POST /register`: Registers a user, securely hashes passwords using `bcrypt`, inserts into the Postgres `users` table, and returns a JSON Web Token (JWT).
  - `POST /login`: Validates credentials and issues JWTs.
  - `GET /verify`: Validates an existing JWT header for route guarding.
- **Data Layer**: Connects to the centralized `postgres` container using the `pg` client.
- **Dockerized**: Fully integrated into the root `docker-compose.yml`. Builds using a multi-stage-like Typescript compilation inside `node:20-alpine`.

### Phase 4: Orchestrator Service
A Node.js microservice (`services/orchestrator/`) acting as the control plane for CloudLab. It translates frontend environment requests into actual Docker containers.
- **Tools used**: `express`, `dockerode`, `uuid`, `pg`.
- **System Access**: The `docker-compose.yml` mounts `/var/run/docker.sock` directly into the orchestrator container so it can control the host Docker engine.
- **Endpoints**:
  - `POST /sessions`: Accepts an environment (e.g. `python-ds`), calls Docker to create a new generic container using that image, records the container mapping in PostgreSQL (`sessions` table), and returns the `session_id`.
  - `DELETE /sessions/:id`: Shuts down the Docker container and marks the DB record as `expired`.

## Getting Started

1. Set up your environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```
2. Make sure the variables in `.env` are copied exactly into `infra/.env` so `docker-compose` can read them.
3. Start the infrastructure and backend services from the `infra/` directory:
   ```bash
   cd infra
   docker compose up -d --build
   ```

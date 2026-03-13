# NimbusCodex Phase 1 Summary

Phase 1 focused entirely on building the **foundational infrastructure** for NimbusCodex. We created the base environments that students will use to run their code, and set up the core database and caching layer that our future microservices will rely on.

Here is a breakdown of everything we accomplished:

## 1. Root Configuration

We established the base project structure in `NimbusDockerCreation/`:

- **`.env`**: Centralized all secrets and connection strings (Postgres credentials, Redis URL, JWT secret).
- **`.gitignore` and `.dockerignore`**: Ensured clean Git commits and optimized Docker build contexts by excluding unnecessary files like `node_modules`, `__pycache__`, and `.env`.

## 2. Docker Environments (The "Student Labs")

We created 7 distinct, pre-configured Docker images. These are the isolated sandboxes where student code will execute.

We wrote a fully automated build script (`images/build-all.sh`) that builds these sequentially, from the smallest to the largest, tagging them with the `cloudlab/` prefix:

1. **`cloudlab/python-basic`**: A lightweight Python 3.11 environment with basic testing and linting tools (`pytest`, `black`, `pydantic`).
2. **`cloudlab/node-ts`**: A Node.js 20 environment equipped for TypeScript development (`ts-node`, `express`, `zod`).
3. **`cloudlab/node-full`**: A heavier Node.js environment containing native build tools (`make`, `g++`), Prisma ORM, Socket.IO, Redis, and message queues (`bull`).
4. **`cloudlab/cpp`**: A C++ environment using GCC 13 on Debian Bookworm, loaded with `cmake`, `gdb`, `valgrind`, Boost, OpenSSL, and JSON parsing libraries.
5. **`cloudlab/java`**: A Java environment using Maven 3.9 and JDK 21. It relies on Maven to dynamically pull project dependencies at runtime.
6. **`cloudlab/python-ds`**: A substantial Data Science environment containing `numpy`, `pandas`, `scikit-learn`, data visualization libraries, and XGBoost.
7. **`cloudlab/python-ml`**: The largest image (Machine Learning). It contains PyTorch (with CUDA support via pip), HuggingFace Transformers, LangChain, and OpenCV-headless.

**Crucial Architecture Choice:** Every single Dockerfile ends with `CMD ["tail", "-f", "/dev/null"]`. This ensures that when the Orchestrator (Phase 2) starts these containers, they sit idle waiting for commands, rather than executing a default script and immediately exiting.

## 3. Core Infrastructure Component Setup

We created the `infra/docker-compose.yml` file to manage all databases and future microservices. For Phase 1, we activated two core components:

- **PostgreSQL (Database)**:
  - We are using `postgres:16-alpine`.
  - We mapped a persistent volume (`pgdata`) so data survives restarts.
  - We securely passed credentials via the `.env` file.
  - We added a healthcheck (`pg_isready`) so dependent services won't start until Postgres is fully ready.
  - **Auto-Initialization**: We created `infra/postgres/init.sql` and mounted it to `/docker-entrypoint-initdb.d/`. This ensures that on the very first boot, Postgres automatically creates the `sessions` table (with UUIDs, env type, start/end times) and all necessary indexes for fast querying.

- **Redis (Cache / Queue)**:
  - We are using `redis:7-alpine`.
  - We enabled AOF (Append Only File) persistence with `--appendonly yes` and mapped a volume (`redisdata`) so queued tasks aren't lost if the container restarts.
  - We added a healthcheck (`redis-cli ping`).

## Summary of State

At the end of Phase 1, the CloudLab system has all 7 execute environments built and ready in the local Docker registry. The Postgres database is live, healthy, and pre-seeded with the necessary schema. The Redis cache is live and healthy.

We are now perfectly positioned to start Phase 2: building the TypeScript Express microservices (Auth, Orchestrator, Gateway) that will securely interact with this infrastructure.

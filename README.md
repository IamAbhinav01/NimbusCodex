# NimbusCodex — CloudLab MVP 🚀

NimbusCodex is a browser-based coding environment launcher that allows users to instantly spin up sandboxed environments for Python, C++, and Java.

## 🛠️ Architecture
- **Frontend**: React + TypeScript + Vite + xterm.js
- **API Gateway**: Entry point with JWT authentication and request proxying.
- **Orchestrator**: Manages Docker sandbox lifecycles and session TTL (Redis + Postgres).
- **Code Runner**: Executes user code safely inside started Docker containers.
- **Infrastructure**: Docker Compose, PostgreSQL (Data), Redis (TTL Tracking).

## 🚀 Getting Started (Setup Guide)

Follow these steps to get the platform running on your local machine:

### 1. Prerequisites
- **Docker Desktop** installed and running.
- **Node.js (v18+)** installed.
- **Git** installed.

### 2. Clone the Repository
```bash
git clone https://github.com/IamAbhinav01/NimbusCodex.git
cd NimbusCodex
```

### 3. Environment Configuration
Create a `.env` file in the `NimbusDockerCreation` directory:
```env
# Database
POSTGRES_USER=NIMBUSCODEX
POSTGRES_PASSWORD=NIMBUSCODEX
POSTGRES_DB=NIMBUSCODEX
DATABASE_URL=postgresql://NIMBUSCODEX:NIMBUSCODEX@postgres:5432/NIMBUSCODEX

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your_super_secret_key_here
```

### 4. Build Environment Images
Before running the services, you must build the sandbox images:
```bash
cd NimbusDockerCreation/images
./build-all.sh
```

### 5. Start the Platform
Navigate to the `infra` folder and spin up the infrastructure:
```bash
cd ../infra
docker compose up -d
```

### 6. Start the Frontend
In a new terminal, navigate to the frontend directory:
```bash
cd NimbusCodex--Frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🧹 Features & Automatic Cleanup
- **Session Auto-Cutoff**: Sessions expire automatically after 10 minutes.
- **Smart Cleanup**: Containers are immediately removed when you navigate back to the Home page or close the workspace (via `keepalive` fetches).
- **Terminal Alignment**: Newlines are normalized for perfect rendering of Python/C++/Java output.

## 🛡️ Upcoming: Security & Sandboxing
- Multi-layer process timeouts.
- Host-level resource caps (CPU, RAM, PIDs).
- Network isolation for sandbox containers.
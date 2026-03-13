# CloudLab Phase 1 — Verification Walkthrough

All infrastructure files have been created. Here is the full tree and verification steps.

## File Tree

```
NimbusDockerCreation/
├── .env
├── .env.example
├── .gitignore
├── .dockerignore
├── images/
│   ├── build-all.sh
│   ├── python-basic/
│   │   └── Dockerfile
│   ├── python-ds/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── python-ml/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── node-ts/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── node-full/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── cpp/
│   │   └── Dockerfile
│   └── java/
│       └── Dockerfile
└── infra/
    ├── docker-compose.yml
    └── postgres/
        └── init.sql
```

---

## Step 1 — Build All Docker Images

> Run from the `images/` directory. On Windows, use Git Bash or WSL.

```bash
cd NimbusDockerCreation/images
chmod +x build-all.sh
./build-all.sh
```

**Expected success output:**
```
+ docker build -t cloudlab/python-basic:latest ./python-basic
...
+ docker build -t cloudlab/python-ml:latest ./python-ml
...
========================================
  All CloudLab images built successfully!
========================================

Images created:
  ✓  cloudlab/python-basic:latest
  ✓  cloudlab/node-ts:latest
  ✓  cloudlab/node-full:latest
  ✓  cloudlab/cpp:latest
  ✓  cloudlab/java:latest
  ✓  cloudlab/python-ds:latest
  ✓  cloudlab/python-ml:latest
```

---

## Step 2 — Start Postgres and Redis

```bash
cd NimbusDockerCreation/infra
docker compose --env-file ../.env up postgres redis -d
```

---

## Step 3 — Verify Both Services Are Healthy

```bash
docker compose ps
```

**Expected output:**
```
NAME                STATUS
infra-postgres-1    Up (healthy)
infra-redis-1       Up (healthy)
```

---

## Step 4 — Verify Sessions Table Was Created

```bash
docker compose exec postgres psql -U cloudlab -d cloudlab -c "\dt"
```

**Expected output:**
```
          List of relations
 Schema |   Name   | Type  |  Owner
--------+----------+-------+---------
 public | sessions | table | cloudlab
```

---

## Step 5 — Verify Redis Is Working

```bash
docker compose exec redis redis-cli ping
```

**Expected output:**
```
PONG
```

---

## Step 6 — Manually Test One Image

```bash
docker run --rm cloudlab/python-ds:latest python3 -c "import numpy; print(numpy.__version__)"
```

**Expected output:** numpy version string (e.g. `1.26.4`)

Other quick tests:
```bash
# python-ml — check torch
docker run --rm cloudlab/python-ml:latest python3 -c "import torch; print(torch.__version__)"

# node-ts — check typescript
docker run --rm cloudlab/node-ts:latest node -e "const ts = require('typescript'); console.log(ts.version)"

# cpp — check gcc
docker run --rm cloudlab/cpp:latest gcc --version

# java — check java version
docker run --rm cloudlab/java:latest java -version
```

---

## Step 7 — Verify All Images Exist

```bash
docker images | grep cloudlab
```

**Expected output (7 rows):**
```
cloudlab/python-ml     latest   ...
cloudlab/python-ds     latest   ...
cloudlab/python-basic  latest   ...
cloudlab/node-ts       latest   ...
cloudlab/node-full     latest   ...
cloudlab/cpp           latest   ...
cloudlab/java          latest   ...
```

---

## Notes on Phase 2+

- In [infra/docker-compose.yml](file:///e:/NimbusCodex/NimbusDockerCreation/infra/docker-compose.yml), all services beyond `postgres` and `redis` are **commented out** with phase annotations.
- To activate Phase 2 services (gateway, auth, orchestrator): uncomment those blocks and ensure `services/` directories exist.
- On **Windows with WSL2**, [build-all.sh](file:///e:/NimbusCodex/NimbusDockerCreation/images/build-all.sh) runs natively in WSL. From PowerShell, use: `wsl bash ./build-all.sh`

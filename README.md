# Hackathon Project Proposal & Technical Architecture

## 1. One-Line Pitch
An instant, secure, and ephemeral cloud coding platform providing pre-configured containerized environments to eliminate "works on my machine" friction for developers and engineering teams.

---

## 2. Hackathon Track
**Hackathon Track:**  
Cloud-Native Application Development

**Stack:**  
React + TypeScript | Node.js + Express | Python FastAPI | Docker + dockerode

---

## 3. Executive Summary
The platform is a lightweight, scalable cloud execution environment designed to provision isolated coding workspaces in milliseconds. By utilizing Docker containers and a pre-warmed instance pool, it eliminates setup times, standardizes development landscapes, and safely sandboxes untrusted code execution.

| Requirement | Our Solution |
|-------------|--------------|
| Instant Environment Provisioning | Pre-warmed container pools via Docker API for sub-second startup times. |
| Secure Code Execution | Ephemeral, isolated Docker containers with strict cgroup resource limits and network isolation. |
| Language Versatility | A catalog of pre-built Docker images tailored for multiple programming languages. |
| Real-time Output Streaming | WebSocket integration for real-time `stdout` and `stderr` streaming to the client UI. |

**Key Differentiator:**  
Unlike traditional cloud IDEs that take minutes to spin up heavy VMs, our platform leverages stateless container orchestration and instance pooling to provide millisecond-latency code execution and environment provisioning.

---

## 4. Problem Statement
Developers and engineering teams waste countless hours managing local development environments. Code that runs perfectly on one machine often fails on another due to dependency mismatches and OS differences.

Major issues include:
* **"Works on My Machine" Syndrome:** Inconsistent dependency management across disparate host operating systems.
* **Onboarding Friction:** New engineers spend days configuring local environments before pushing their first commit.
* **Security Risks of Untrusted Code:** Executing third-party or user-submitted code locally or on host servers poses severe security and destructive risks.
* **Resource Inefficiency:** Running heavy local IDEs and multiple databases consumes excessive RAM and CPU, deteriorating developer machines.

---

## 5. Solution Overview
The system provides a web-based, zero-setup code execution engine. Users simply select their tech stack, and the platform injects their code into an isolated, ephemeral container that executes the workload, streams the output, and self-destructs upon completion.

### 5.1 User Journey

| Step | What user sees | What happens behind the scenes |
|------|----------------|--------------------------------|
| **1. Selection** | Selects programming language from a dropdown menu. | Frontend requests available runtime configurations from the API Gateway. |
| **2. Coding** | Types code into the Monaco Editor and clicks "Run". | Code payload, language ID, and execution parameters are sent via WebSocket. |
| **3. Provisioning** | Sees a "Starting Environment..." loading state for milliseconds. | Session Scheduler dequeues a pre-warmed container matching the requested language image. |
| **4. Execution** | Code output appears line-by-line in the integrated web terminal. | The engine runs the code payload. `stdout` and `stderr` streams are piped to the WebSocket. |
| **5. Cleanup** | Receives "Execution Complete" and resource metrics. | Container is aggressively killed; resources (CPU/Memory) are reclaimed and logged. |

---

## 6. Pre-Built Environment Catalog

| Environment Name | Base Image | Key Libraries / Tooling | Use Case |
|------------------|------------|-------------------------|----------|
| **Python** | `python:3.11-slim` | NumPy, Pandas, Pytest | Data scripts, algorithms, ML |
| **Node.js** | `node:20-alpine` | Jest, Express, TypeScript | Backend scripting, async logic |
| **C / C++** | `gcc:13` | CMake, Make, GDB | System programming, high-perf CLI |
| **Java** | `eclipse-temurin:21-jdk`| Maven, Gradle, JUnit | Enterprise logic, OOP algorithms |
| **Go** | `golang:1.22-alpine` | Go Modules | Concurrent processing, microservices|
| **Rust** | `rust:1.77-slim` | Cargo, Tokio | Memory-safe systems engineering |

---

## 7. Technical Architecture

The architecture follows a modular, microservices-oriented approach tailored for container orchestration.

### 7.1 System Layers

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Frontend** | React, TypeScript, Monaco Editor | UI/UX, code editing, terminal rendering |
| **API Gateway** | Node.js + Express | Request routing, rate-limiting, authentication |
| **Microservices** | Python FastAPI | Core business logic, user management, analytics |
| **Container Runtime** | Docker Engine, dockerode | Container lifecycle management, stream multiplexing |
| **Image Registry** | Docker Hub / AWS ECR | Storing and pulling pre-configured runtime environments |
| **Data Layer** | PostgreSQL, Redis | Persistent storage for user data; Redis for queuing/caching |

---

## 8. Code Execution Engine (Core Innovation)

The execution engine is the heart of the platform. It handles untrusted workloads rapidly and safely.

**Execution Flow:**
1. **Request arrives:** Code payload is received via incoming WebSocket or REST request.
2. **Image selected:** The requested language's image tag is identified.
3. **Container created:** A container is dispatched (or mapped from the pre-warmed pool) mounting the code as an entrypoint script.
4. **Output streamed:** The container's TTY is attached; logs are multiplexed via `dockerode` directly to the client WebSocket.
5. **Container destroyed:** The container process exits, triggers a rigorous lifecycle hook, and is immediately destroyed (`docker rm -f`).

### Security Sandbox Section
To prevent malicious code from compromising the host:
* **CPU/Memory cgroups:** Hard limits (e.g., max 256MB RAM, 0.5 CPU cores per container) ensure no single execution can perform a Denial of Service (DoS) attack.
* **Network Isolation:** Execution containers run on an internal Docker bridge network with no external internet access (`--network none`) to prevent data exfiltration.
* **Non-Root Execution:** Code is executed by a dynamically mapped low-privilege `sandbox_user`.
* **Read-Only Filesystem:** The root filesystem is mounted as read-only, except for a tiny ephemeral `/tmp` volume.

---

## 9. Session Scheduler
The Session Scheduler ensures high availability and low latency during peak usage.
* **Queueing:** Incoming requests during heavy traffic are placed onto a Redis-backed queue. Worker nodes process these FIFO.
* **Pre-Warming Strategy:** To avoid cold-boot latency (image pulling and container startup), the scheduler maintains a "hot pool" of 5-10 idle containers for high-demand languages (like Python and Node.js). When a user requests execution, an idle container is instantly assigned, and a background task spins up a replacement.

---

## 10. Resource Monitoring
Continuous observability is required to maintain platform health and prevent runaway processes.
* **Prometheus:** Scrapes metrics from the host servers and microservices.
* **Grafana:** Visualizes metrics on dashboards accessible to admins.
* **Docker Stats API:** Real-time extraction of CPU usage, memory utilization, and network I/O per container execution, reporting this data back to the user alongside their code output.

---

## 11. Complete Tech Stack

| Category | Technology | Reason for Choice |
|----------|------------|-------------------|
| **Frontend Framework** | React + TypeScript | Component-rich ecosystem, perfect for complex UI layout |
| **Code Editor** | Monaco Editor | Industry standard (used in VSCode), native syntax highlighting |
| **Backend Services** | Node.js + Express / FastAPI | Node for high-concurrency WebSockets; FastAPI for rapid API design |
| **Execution Engine** | Docker + dockerode | Native container isolation and programmatic NodeJS control |
| **Database** | PostgreSQL | ACID-compliant relational storage for users, sessions, and saved code |
| **Cache/Queue** | Redis | Ultra-fast data structure store for request queuing and rate limiting |
| **Monitoring** | Prometheus + Grafana | Unparalleled cloud-native observability and querying |

---

## 12. Project Structure

| Path | Contents |
|------|----------|
| `/client` | React frontend UI, Monaco components, state management |
| `/server/api-gateway` | Express server, WebSocket handlers, authentication middleware |
| `/server/execution-engine` | `dockerode` orchestrator logic, worker nodes |
| `/environments` | Dockerfiles and initialization scripts for each supported language |
| `/infrastructure` | Prometheus configurations, Grafana dashboards, setup scripts |
| `/docker-compose.yml` | Local orchestration bringing up dependent databases and services |

---

## 13. API Design

| Method + Endpoint | Purpose | Response |
|-------------------|---------|----------|
| `GET /api/v1/runtimes` | Fetch supported languages and versions | `200 OK \| [{"id": "python3", "name": "Python 3.11"}]` |
| `POST /api/v1/execute` | Submit code payload for synchronous run | `200 OK \| {"job_id": "uuid", "status": "queued"}` |
| `WS /ws/v1/stream/:job_id` | Establish WebSocket for dual-way execution | Real-time binary stream of `stdout`/`stderr` |
| `GET /api/v1/user/history`| Retrieve previously executed scripts | `200 OK \| [{"id": "uuid", "code": "...", "date": "..."}]` |

---

## 14. Why This Wins

* **Alignment with criteria:** Directly demonstrates mastery of Cloud-Native Architecture, containerization, and microservices.
* **Technical Depth:** Bypassing simple CRUD logic to orchestrate low-level Docker APIs, enforce kernel-level constraints (cgroups), and manage WebSocket streaming shows profound engineering rigor.
* **Real-World Impact:** Immediate utility for coding interviews, educational platforms, and rapid prototyping workflows.

---

## 15. Live Demo Script

1. **Introduction:** Open the platform landing page, highlighting the sleek, IDE-like interface. 
2. **Speed Test:** Select Python. Write a simple `print("Hello Hackathon")`. Hit Run. Highlight the sub-second response time.
3. **Deep Dive (Security):** Write a destructive script (e.g., `os.system('rm -rf /')` or an infinite memory allocation loop). Run it. 
4. **The Reveal:** Show the system catching the out-of-memory (OOM) kill or permission denied error, proving the host system remains perfectly unharmed.
5. **Observability:** Switch to the Grafana dashboard. Show the CPU spike during the infinite loop being cleanly suppressed by the cgroup quota.
6. **Closing:** Reiterate the seamless UX powered by complex backend orchestration.

---

## 16. Deployment Guide

* **Local Setup:** 
  1. Clone repository.
  2. Run `docker-compose up --build`. The gateway, Postgres, and Redis will spin up.
* **Production Deployment:**
  Deploy microservices to an AWS EKS (Elastic Kubernetes Service) cluster or a DigitalOcean Droplet with Docker pre-installed.
* **Container Hosting:**
  The execution worker node requires raw access to the Docker daemon (`/var/run/docker.sock`). In production, this specifically runs on isolated EC2/Droplet instances separate from the API Gateway database layer.

---

## 17. Image Build Pipeline
To ensure environments are secure and up-to-date, a GitHub Actions CI pipeline is configured.
1. On pushing a change to `/environments/Dockerfile.*`, the CI pipeline triggers.
2. It builds the new Docker image and runs a small security scanner (`Trivy`) to check for OS-level vulnerabilities.
3. Upon passing, the image is tagged and pushed to the Docker Image Registry.
4. The execution engine pulls the latest digest asynchronously.

---

## 18. Future Roadmap

| Feature | Description | Priority |
|---------|-------------|----------|
| **Multi-File Support** | Allow users to upload and execute entire directory structures. | High |
| **Collaborative Editing** | Integrate CRDTs or Operational Transformation for Google Docs-style pair programming. | High |
| **Persistent Workspaces** | Attach distinct Docker volumes to allow users to pause and resume work over days. | Medium |
| **LSP Integration** | Add Language Server Protocol support for native IDE autocompletion and linting. | Low |

---

## 19. Conclusion
This platform solves fundamental inefficiencies in modern software engineering by abstracting the environment away from the local machine. By combining the speed of pre-warmed containers with strict security isolation, we deliver a production-ready, cloud-native IDE experience natively in the browser.

* **Live Demo URL:** `https://demo.example.com`
* **GitHub Repository:** `https://github.com/organization/hackathon-project`

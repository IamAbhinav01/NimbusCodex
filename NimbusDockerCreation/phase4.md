# NimbusCodex Phase 4 Summary

Phase 4 focused on building the **Orchestrator Service**, the control plane microservice responsible for translating frontend environment requests into actual, running Docker containers on the host machine.

Here is a breakdown of what was accomplished:

## 1. Orchestrator Microservice Architecture

We created the `services/orchestrator/` directory and bootstrapped a new Node.js + TypeScript Express application.
- **Base Image**: Leveraged our existing `cloudlab/node-ts` image to compile and run the TypeScript code.
- **Dependencies**: Integrated `express`, `pg` (for PostgreSQL access), `uuid` (for session tracking), and critically, **`dockerode`** to interface with the Docker daemon.

## 2. Docker Daemon Integration

To allow the containerized Orchestrator to spin up *other* sibling containers on the host machine, we configured `infra/docker-compose.yml` to mount the host's Docker socket into the Orchestrator container:
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```
This enables `dockerode` to create and manage the exact `cloudlab/*` environment images we built back in Phase 1 directly from the Node.js API.

## 3. Session Lifecycle Management

The Orchestrator manages the full lifecycle of a coding session securely via the `sessions` table in our `postgres` database. We exposed the following REST API endpoints:

- **`POST /sessions` (Launch)**:
  1. Accepts an `env` request (e.g., `python-ds`).
  2. Uses Dockerode to spin up a new detached container from the `cloudlab/python-ds:latest` image running `tail -f /dev/null` to keep it alive.
  3. Records the new UUID `session_id`, the active Docker `container_id`, and a status of `active` into PostgreSQL.
  4. Returns the connection details to the frontend Workspace.

- **`DELETE /sessions/:id` (Cleanup)**:
  1. Looks up the requested session UUID in PostgreSQL to find the internal Docker `container_id`.
  2. Uses Dockerode to gracefully stop and forcefully remove the container from the host system, freeing up memory.
  3. Updates the PostgreSQL `sessions` table, setting the status to `expired` and stamping an `end_time`.

## 4. Frontend Workspace Integration

We wired the React Frontend's `Workspace.tsx` component to this new backend API:
- When a user clicks "Launch", the 2-second mock loading screen was replaced with a real `fetch()` call to the Orchestrator API, verifying actual container provisioning.
- When the user clicks "Back" to leave the IDE Workspace, a React `useEffect` cleanup hook fires a synchronous `DELETE` request, guaranteeing the orphaned sandbox container is destroyed immediately to prevent resource leaks.

## Summary of State

At the end of Phase 4, the CloudLab system can successfully authenticate users, serve a dynamic frontend Workspace, and securely provision real, isolated Docker sandboxes on demand across 7 different programming languages.

We are perfectly positioned to begin Phase 6: the Code Runner service, which will execute the actual user-submitted code inside these live sandboxes! All routing is now centralized and secure through the API Gateway on port 4000.

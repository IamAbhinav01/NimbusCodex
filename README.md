# NimbusCodex
Hackathon Project - Cloud based lab management tool




# ENTRY POINT
- server.js: This file only starts the API server

# Next Nodes
- labRoutes: specifies endpoints

- Controllers: They manage application logic but do not interact with docker directly

- DockerService: (CORE ENGINE) container creation happens here

- Resource Monitor: Runs every minute to kill expired containers ( i.e., labs that run out of provisioned time)

Initial core pipeline:

1. Start the Node server

2. Receive an API request

3. Launch a Docker container

4. Return the lab URL

5. Open the lab in browser
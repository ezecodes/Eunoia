# Eunoia
Eunoia is a sleek and secure chat app designed for empowering conversations. This repository contains both the server and client components of the Eunoia chat system

# Installation:
## Prerequisites:
- **Docker:** Ensure Docker is installed on your system. If not, download and install Docker from [Docker's official website](https://www.docker.com/get-started).

## Installation Steps:
### 1. Clone the Repository: 
*`git clone https://github.com/jahdevelops/eunoia`*
### 2. Client and Server Setup: 
To set up both the client and server components using Docker, execute the following commands in your terminal:
- *`docker compose -f docker-compose-dev.yml build`*
- *`docker compose -f docker-compose-dev.yml up`*
These commands will build and launch the client and server components in separate Docker containers, setting up the app in development mode.
### 3. Launching the App:
Once the setup is complete, visit *http://localhost:4000* in your to access the Eunoia chat app client.

# Getting Started:
Once installed, refer to the provided documentation for guidance on launching and using the Eunoia chat app.

#### Contributing:
If you're new to contributing to open-source projects or our codebase, here are a few steps to get you started:
- Fork the repository.
- Create a new branch for your work *`git checkout -b feature/your-feature-name`*
- Make changes or additions.
- Test your changes thoroughly.
- Commit your changes (git commit -am 'Add new feature').
- Push your changes to your forked repository *`git push origin feature/your-feature-name`*
- Create a pull request against the main branch.

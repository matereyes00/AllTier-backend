# 🚀 AllTier

A revamp of TierMaker.

---

## 📖 About This Project

[Write a short paragraph explaining the project in more detail. What was your motivation? What problem does it solve? What makes it interesting?]

### 🛠️ Tech Stack

- **Backend:** NestJS, TypeScript
- **Authentication:** JWT, Passport.js
- **Database:** PostgreSQL
- **Environment:** Docker

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You'll need the following software installed on your machine:

- [Node.js](https://nodejs.org/) (v20 or later)
- [Docker](https://www.docker.com/products/docker-desktop/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/matereyes00/AllTier-backend
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd [your-repo-name]
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary variables.
    ```env
    # Example
    JWT_SECRET=yourSuperSecretKeyGoesHere
    # Database Connection
    DB_HOST=yourHost
    DB_PORT=yourPort
    DB_USERNAME=yourUsername
    DB_PASSWORD=yourPassword
    DB_DATABASE=yourDatabase

    ACCESS_TOKEN_SECRET_KEY=yourAccessToken
    ACCESS_TOKEN_EXPIRE_IN=1m
    REFRESH_JWT_SECRET=yourRefreshToken
    REFRESH_JWT_EXPIRE_IN=1h
    ```
    You can generate ```ACCESS_TOKEN_SECRET_KEY``` and ```REFRESH_JWT_SECRET``` via:
    ```sh
    opsnssl rand -base64 32
    ```

---

## ▶️ How to Run

### Development Mode

To run the application in a containerized development environment with hot-reloading:

```sh
docker-compose up --build
```

# 🚀 AllTier

A revamp of TierMaker.

---

## 📖 About This Project

[Write a short paragraph explaining the project in more detail. What was your motivation? What problem does it solve? What makes it interesting?]

### 🛠️ Built with
* ![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
* ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
* ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2306B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
* ![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
* ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
* ![Amplitude](https://img.shields.io/badge/Amplitude-0050FF?style=for-the-badge&logo=amplitude&logoColor=white)
* ![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
* ![PostgreSQL](https://img.shields.io/badge/postgresql-%234169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white)
* ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

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

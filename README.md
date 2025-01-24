# LuDa Chat App

LuDa Chat App is a real-time chat application designed to provide seamless communication. It consists of a client-side interface (frontend) and a server-side application (backend) that handles messaging, user authentication, and other functionalities.

This project is divided into two main parts:
- The **client**: a web-based application for users to interact with the chat system.
- The **server**: the backend that handles data storage, real-time communication, and application logic.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Client Setup](#client-setup)
  - [Server Setup](#server-setup)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project is designed to be a full-stack chat application where users can create accounts, log in, and chat in real-time. The backend is responsible for storing user data, messages, and managing WebSocket connections for real-time chat. The frontend provides a user interface for interacting with the application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (for both client and server)
- **npm** (Node package manager)
- **MongoDB** (for database storage)
- **Redis Client** (for session management)
- **WebSocket library** (for real-time communication)

If you're using Ubuntu, you can install the required dependencies by following the official Node.js and MongoDB installation guides.

## Installation

### Client Setup

1. Navigate to the `client` directory:

    ```bash
    cd client
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. (Optional) If you are using environment variables for configuration, create a `.env` file based on `.env.example` and update the variables accordingly.

4. To run the client locally:

    ```bash
    npm start
    ```

    This will start the development server for the client, usually available at `http://localhost:3000`.

For more detailed instructions on the client-side setup, visit the `client/README.md` inside the client folder.

### Server Setup

1. Navigate to the `server` directory:

    ```bash
    cd server
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. (Optional) Configure the environment variables by creating a `.env` file in the `server` folder and updating it based on `.env.example`.

4. To run the server locally:

    ```bash
    npm start
    ```

    This will start the backend server, usually available at `http://localhost:5000` or the port you have configured.

For detailed instructions on server-side setup, visit the `server/README.md` inside the server folder.

## Running the Application

Once both the client and server are running, you should be able to interact with the application via the client interface at `http://localhost:3000`.

Ensure that the server is running on the correct port and that the client is configured to communicate with it.

## Contributing

We welcome contributions to improve the app! If you’d like to contribute, please fork the repository, create a branch, and submit a pull request.

Be sure to follow the code of conduct and check the open issues for guidance on where help is needed.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

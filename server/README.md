# LuDa Chat App (Server)

The **LuDa Chat App** server is the backend of a real-time chat system built with **Node.js** and **Express**. It handles user authentication, messaging, rooms, reactions, and integrates with Redis for real-time functionality.

## Project Structure

The server is organized as follows:

### Key Sections:

- **Installation**: Covers how to install and configure the server.
- **API Routes**: Lists all available server-side API routes (for user management, messaging, rooms, etc.).
- **Database Models**: Explains the different models in use (User, Message, Room, etc.).
- **Utilities**: Describes utility files for database and Redis configuration.
- **Tests**: Instructions to run tests to verify server functionality.


## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v12 or higher)
- **npm** (Node package manager)
- **MongoDB** or your preferred database for data storage
- **Redis** (optional, for real-time functionality)

## Installation

1. Clone the repository and navigate to the server directory:

    ```bash
    git clone https://github.com/deantosh/LuDa_chat_app_v1.git
    cd LuDa_chat_app_v1/server
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Configure the environment variables:
   - Create a `.env` file based on `.env.example` and fill in the appropriate values, especially for database and Redis configurations.

4. To run the server locally:

    ```bash
    npm start
    ```

    This will start the server, which by default should be available at `http://localhost:5000`.

## API Routes

The server exposes the following RESTful routes.

### App Routes
- `GET /status`: Get the status of the app.

### User Management
- `POST /users/register`: Register a new user.
- `GET /users/me`: Get the profile of the current user.
- `PUT /users/update`: Update the profile of the current user.
- `GET /users/dashboard`: Get dashboard information for the current user.

### Authentication
- `POST /users/login`: Log in a user.
- `DELETE /users/logout`: Log out the current user.

### Message Management
- `POST /rooms/:room_id/messages`: Send a new message in a specific room.
- `GET /rooms/:room_id/messages`: Get all messages in a specific room.
- `POST /rooms/:room_id/messages/:message_id/replies`: Reply to a specific message.
- `GET /messages/:message_id/replies`: Get all replies to a specific message.
- `POST /rooms/:room_id/messages/:message_id/reactions`: Add a reaction (like/dislike) to a message.

### Room Management
- `POST /rooms`: Create a new room.
- `GET /rooms`: Get all rooms.
- `GET /rooms/:room_id`: Get details of a specific room.
- `POST /rooms/:room_id/users/:user_id/join`: Add a user to a room.
- `DELETE /rooms/:room_id/users/:user_id/exit`: Remove a user from a room.

## Database Models

### User Model (`models/user.js`)
Handles user profile, authentication details, and interaction with the database for user-related actions.

### Message Model (`models/message.js`)
Represents a message in a chat room, with details like sender, content, timestamp, etc.

### Room Model (`models/room.js`)
Represents a chat room where users interact. Includes information about participants and room details.

### Reaction Model (`models/reaction.js`)
Manages user reactions (like/dislike) to messages in rooms.

### Reply Model (`models/reply.js`)
Handles replies to messages within rooms, creating a nested message structure.

### Unread Messages Model (`models/unread_messages.js`)
Tracks unread messages for users in rooms, used for notifications.

### User Session Model (`models/user_session.js`)
Stores session data for logged-in users, used for managing active sessions.

## Utilities

The server includes utility files for handling database and Redis configuration:

- **Database Configuration (`utils/db.js`)**: Establishes a connection to your database.
- **Redis Client (`utils/redis.js`)**: Configures Redis for real-time features and caching.

## Running Tests

Unit tests are available to ensure the correct functionality of the server.

To run the tests:

```bash
npm test

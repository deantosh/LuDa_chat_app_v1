# LuDa Chat App (Client)

The **LuDa Chat App** client is a real-time chat application built using **React.js**. It provides an interface for users to interact with the backend, allowing them to register, log in, create chat rooms, send messages, and more.

## Project Structure

The client is organized as follows:

### Key Sections:
- **Project Structure**: Describes the organization of the client-side code, including components and their purpose.
- **Installation**: Instructions on how to set up the client-side application, install dependencies, and run the app locally.
- **Project Overview**: Summarizes the key features and purpose of the client-side application.
- **Client Components**: Lists the main components of the client and their functionality.
- **Testing**: Instructions to run the test suite for the client.
- **Contributing**: Encourages contributions to the project.
- **License**: Mentions the licensing details.


## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v12 or higher)
- **npm** (Node package manager)

If you're using Ubuntu, you can install Node.js by following the official [Node.js installation guide](https://nodejs.org/).

## Installation

1. Clone the repository and navigate to the `client` directory:

    ```bash
    git clone https://github.com/deantosh/LuDa_chat_app_v1.git
    cd LuDa_chat_app_v1/client
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. (Optional) If you are using environment variables for configuration, create a `.env` file and set the required values (e.g., API URL, authentication credentials).

4. To run the client locally:

    ```bash
    npm start
    ```

    This will start the development server, which will usually be available at `http://localhost:3000`.

## Project Overview

The client provides the interface for users to interact with the backend and perform the following actions:

- **Register** and **Login** to access chat rooms.
- **Create**, **view**, and **join** chat rooms.
- **Send and receive messages** in real-time.
- **View a user profile** and update settings.
- **React to messages** with likes, dislikes, and replies.

### Key Features

- **Real-time Messaging**: Users can send and receive messages instantly, thanks to the WebSocket connection to the backend.
- **Room Management**: Users can create new rooms, join existing rooms, and view room details.
- **User Profile**: Users can view their own profile and update their settings.

## Client Components

The main components in the client are:

- **App.js**: The root component that renders the entire application.
- **Chat.js**: Displays the chat interface where users can send and receive messages.
- **Sidebar.js**: Displays the list of available chat rooms and allows users to switch between them.
- **Dashboard.js**: Shows the user’s dashboard with information like active rooms, messages, and profile settings.
- **Header.js**: Displays the app header with navigation options.
- **UserProfileSettings.js**: Allows users to update their profile information.
- **CreateRoom.js**: Allows users to create new chat rooms.
- **ViewRoomDetails.js**: Displays detailed information about a specific room.

## Running the Application

Once the client is running, you should be able to interact with the app via the interface at `http://localhost:3000`.

Ensure that the backend server is running on the correct port (usually `http://localhost:5000`), and the client should be able to communicate with it.

## Testing

The client has a test suite set up using **Jest** and **React Testing Library**. To run the tests:

```bash
npm test

# API Documentation Generator App

A Node.js application designed to generate API documentation effortlessly using OpenAI's language models.

## Features

1. **API Endpoint Documentation**: Generates simple documentation for live API endpoints.
2. **HTTPS Protocol Support**: Currently operational for the HTTPS protocol.
3. **HTTP Request Method Support**: Supports various HTTP request methods like POST and GET.
4. **LLMs Integration**: Utilizes Language Models (LLMs) to infer key properties and their meanings.
5. **ExpressJS Server**: Built as an ExpressJS server for ease of use and integration.

## How It Works

1. **Set Up the Node Server**: Start the Node server on a designated port (e.g., port 4005).
2. **Generate Documentation**:
- Append `localhost:4005/createDocs` in place of the protocol in the API URL you want documentation for.
  - Example: For `https://www.example.com`, make a call to `localhost:4005/createDocs/example.com`.
- The engine initiates a request to the provided endpoint and retrieves the response body.
- Utilizes the base URL, request headers, request body, and response body to understand the API's nature.
- The data is processed through an LLM to create comprehensive documentation.
3. **Receive Documentation**:
- The generated documentation is sent back as a PDF file in response to the `localhost:4005/createDocs` API call.

## Setup Instructions

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Obtain an OpenAI API key.
4. Start the server by passing the API key as an environment variable.

OPEN_AI_KEY=<key string> node server.js

## Technologies Used

- Node.js
- Express.js
- OpenAI JavaScript SDK

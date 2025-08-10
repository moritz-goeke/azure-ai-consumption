# Azure AI Consumption Demo App

This project is a demo application for tracking AI and resource costs in a serverless app deployed on Azure. It visualizes consumption metrics for Azure AI services during a chat app.

## Features

- Track AI service usage and resource costs in real time.
- Interactive dashboards and charts (Recharts).
- Markdown rendering with math support (KaTeX).
- Typewriter and animated UI components.
- Modular React frontend.
- Serverless backend using Azure Functions.
- Easy deployment to Azure.

## Project Structure

```
azure-ai-consumption/
├── backend/         # Azure Functions backend (Node.js)
│   ├── src/
│   │   └── functions/
│   │       └── openai.js
│   ├── package.json
│   └── host.json
├── src/             # React frontend
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v20+)
- Azure account (for deployment)
- [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
- [Vite](https://vitejs.dev/) (for frontend dev server)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-org/azure-ai-consumption.git
   cd azure-ai-consumption
   ```

2. Install frontend dependencies:

   ```sh
   npm install
   ```

3. Install backend dependencies:

   ```sh
   cd backend
   npm install
   cd ..
   ```

### Running Locally

#### Frontend

```sh
npm run dev
```

#### Backend (Azure Functions)

To test Azure Functions locally, follow the official guide: [Test Azure Functions locally](https://learn.microsoft.com/azure/azure-functions/functions-develop-local).  
**Setup is necessary:** Ensure you have created and adapted the AI endpoints before running.

### Deployment

You can deploy the backend to Azure Functions and the frontend as a Static Web App or to Azure App Service.

**Note:** You also need to deploy an AI model in Azure Foundry and create the related environment variables (containing key and endpoint) for the azure function.

Refer to Azure documentation for details:

- [Deploy Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-deployment-technologies)
- [Deploy Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/getting-started)
- [Deploy AI models in Azure Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/overview)

## Usage

- Access the frontend at `http://localhost:5173` (default Vite port).
- The backend runs at `http://localhost:7071` (default Azure Functions port).
- Configure API endpoints and keys as needed for your Azure resources.

## Technologies Used

- React 19
- Vite
- Material UI
- Recharts
- KaTeX, React Markdown
- Azure Functions (Node.js)
- Axios

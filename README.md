# AI Travel Planner 🌍🗺️

AI Travel Planner is a web application that generates personalized travel itineraries based on user preferences. The user enters a city, budget, number of days, and interests, and the AI creates a detailed route with activities, hotels, and transportation, displayed on an interactive map.

## ✨ Features

- **AI-powered itinerary generation**: Create unique travel plans for any city.
- **Day-by-day breakdown**: Clear schedule of activities, transport, and hotels.
- **Interactive map**: Visualize all route points and connections on a Leaflet map.
- **Customizable parameters**: Specify city, budget, number of days, and personal interests (culture, food, nature, entertainment).
- **PDF export**: Download the generated itinerary as a beautiful PDF guide.

## 🛠️ Architecture

The project consists of two main parts:

- **Frontend**: Single Page Application (SPA) built with **React** and **TypeScript**. Styling is done with **Tailwind CSS**. The interactive map uses **Leaflet** and **React-Leaflet**.
- **Backend**: REST API server on **Node.js** with **Express**. Handles requests from the frontend, integrates with LLMs (e.g., OpenAI GPT) to generate itineraries, and creates PDF files using **pdfkit**.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/)

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ai-teaweler
```

### 2. Backend Setup

1.  **Go to the backend folder and install dependencies:**

    ```bash
    cd backend
    npm install
    ```

2.  **(Optional) OpenAI API setup:**
    To use a real OpenAI model instead of mock data, create a `.env` file in the `backend` folder and add your API key:

    ```
    OPENAI_API_KEY=your_secret_openai_key
    ```

    Then uncomment the relevant code in `backend/index.js`.

3.  **Start the server:**
    ```bash
    node index.js
    ```
    The server will run at `http://localhost:3001`.

### 3. Frontend Setup

1.  **Open a new terminal, go to the frontend folder, and install dependencies:**

    ```bash
    cd frontend
    npm install
    ```

2.  **Start the React app:**
    ```bash
    npm start
    ```
    The app will automatically open in your browser at `http://localhost:3000`.

## ⚙️ API Endpoints

| Method | Route             | Description                                                    |
| ------ | ----------------- | -------------------------------------------------------------- |
| `POST` | `/api/generate`   | Accepts data (city, budget, days) and generates an itinerary.  |
| `POST` | `/api/export/pdf` | Accepts itinerary data and returns a URL to the generated PDF. |

## 🔮 Possible Improvements

- Integration with real-time weather data.
- Generation of alternative routes.
- Adding photos for each location.
- User authentication and saving itineraries.
- Collaborative editing of travel plans.

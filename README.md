# Project Manager Full-Stack Application

A full-stack project management system with **.NET 10** backend, **React** frontend, and **AI-powered task analysis**.

## 🚀 Features

- Full CRUD operations for Projects and Tasks
- AI-powered task analysis (priority suggestions, time estimates, smart tagging)
- Clean Architecture with Repository and Service patterns
- RESTful API with Swagger documentation
- In-memory caching for AI results

## 🛠️ Tech Stack

**Backend**: .NET 10, ASP.NET Core, Entity Framework Core, SQLite  
**Frontend**: React 19, Vite, Axios  

## 📋 Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- _(Optional)_ [LM Studio](https://lmstudio.ai/) for AI features

## ⚡ Quick Start

### Option 1: One Command

```powershell
.\start-all.ps1
```
or
```cmd
start-all.bat
```

### Option 2: Manual

**Backend:**
```bash
cd "backend/Project Manager/Project Manager"
dotnet restore
dotnet run
```

**Frontend:**
```bash
cd frontend/my-react-app
npm install
npm run dev
```

## 🌐 Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5269
- **API Docs**: http://localhost:5269/scalar/v1

## 📡 API Endpoints

**Projects**: `/api/projects` (GET, POST, PUT, DELETE)  
**Tasks**: `/api/tasks` (GET, POST, PUT, DELETE)  
**AI Analysis**: `/api/ai/analyze-task` (POST)

## 🗄️ Database

SQLite with auto-seeded sample data (2 projects, 6 tasks).

## 🤖 AI Setup (Optional)

If you want AI features:
1. Install [LM Studio](https://lmstudio.ai/)
2. Start local server on port 1234
3. App auto-connects (falls back to keywords if unavailable)

---

**Built with .NET 10, React, and AI** 🚀

---

## 🏃 Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+ and npm/yarn
- Bionic/LM Studio running locally on port 1234 (for AI features)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Configure `appsettings.json` (if needed):
   ```json
   {
	 "Bionic": {
	   "Url": "http://localhost:1234/v1/chat/completions",
	   "Model": "qwen2.5-7b-instruct-1m"
	 },
	 "AiCache": {
	   "ExpirationMinutes": 60
	 }
   }
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

5. Access API documentation at: `https://localhost:5001/scalar/v1`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Update the API base URL in your React app to point to `https://localhost:5001`

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```



## 🔧 Configuration

### Bionic/LM Studio Setup
1. Download and run [LM Studio](https://lmstudio.ai/)
2. Load the `qwen2.5-7b-instruct-1m` model (or any OpenAI-compatible model)
3. Start local server on port 1234
4. Verify endpoint at `http://localhost:1234/v1/chat/completions`

### CORS Configuration
The backend is configured to allow requests from:
- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)

Update `Program.cs` if your frontend runs on a different port.




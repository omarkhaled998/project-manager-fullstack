@echo off
echo.
echo ========================================
echo   Starting Project Manager Full-Stack
echo ========================================
echo.

echo [Backend] Starting .NET API...
start "Backend API" cmd /k "cd backend\Project Manager\Project Manager && dotnet run"

timeout /t 2 /nobreak >nul

echo [Frontend] Starting React + Vite...
start "Frontend React" cmd /k "cd frontend\my-react-app && npm run dev"

echo.
echo ========================================
echo   Servers are starting...
echo ========================================
echo.
echo Backend:  http://localhost:5269
echo Frontend: http://localhost:5173
echo.
echo Both servers are now running in separate windows.
echo Close those windows to stop the servers.
echo.
pause

# Project Manager Full-Stack Startup Script
# This script starts both the backend and frontend servers concurrently

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Project Manager Full-Stack  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend in a new PowerShell window
Write-Host "[Backend] Starting .NET API..." -ForegroundColor Green
$backendPath = "backend\Project Manager\Project Manager"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Starting...' -ForegroundColor Yellow; dotnet run"

# Wait a bit for backend to initialize
Start-Sleep -Seconds 2

# Start Frontend in a new PowerShell window
Write-Host "[Frontend] Starting React + Vite..." -ForegroundColor Green
$frontendPath = "frontend\my-react-app"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Starting...' -ForegroundColor Yellow; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers are starting...               " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will be available at:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5269" -ForegroundColor Yellow
Write-Host "Frontend will be available at: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# ==========================================
# TRACE-X Local Startup Script (PowerShell)
# SIH 26182 - Explainable Cross-Chain VASP Attribution Engine
# ==========================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting TRACE-X Stack on Localhost     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$Root = $PSScriptRoot

# 1. Start Go Backend
Write-Host "`n[1/3] Starting Go Backend on port 8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root'; .\backend\bin\tracex-server.exe"

# 2. Start Python Analytics Engine
Write-Host "`n[2/3] Starting Python Analytics Engine on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\analytics'; python -m uvicorn app.main:app --host 127.0.0.1 --port 5000"

# 3. Start Frontend Dev Server
Write-Host "`n[3/3] Starting React Vite Frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\frontend'; npm run dev -- --host 127.0.0.1 --port 5173"

Write-Host "`nAll TRACE-X services launched!" -ForegroundColor Green
Write-Host "  - Frontend UI:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - Backend API:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "  - Analytics:    http://localhost:5000" -ForegroundColor Cyan

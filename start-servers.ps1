# Script para iniciar Backend e Frontend simultaneamente

Write-Host "🚀 Iniciando servidores..." -ForegroundColor Green

# Iniciar Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Gonçalo\Desktop\Practika\backend'; npm run dev"

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Iniciar Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Gonçalo\Desktop\Practika\frontend'; npm run dev"

Write-Host "✅ Servidores iniciados!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan

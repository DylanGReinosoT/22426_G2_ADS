# Script para ejecutar todas las pruebas del proyecto

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Ejecutando Pruebas - PintAuto Inventory Management" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location "C:\Users\Admin\Desktop\7MO SEMESTRE\ASEGURAMIENTO DE LA CALIDAD\PRIMER PARCIAL\REPOSITORIO\22426_G2_ADS\CODIGO\CF_V1.0.2\inventory-management"

# Ejecutar mvn clean test
Write-Host "Limpiando proyecto..." -ForegroundColor Yellow
& mvn clean

Write-Host ""
Write-Host "Compilando proyecto..." -ForegroundColor Yellow
& mvn compile

Write-Host ""
Write-Host "Ejecutando pruebas..." -ForegroundColor Yellow
$testResult = & mvn test

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Resultado de Pruebas" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host $testResult

Write-Host ""
Write-Host "Pruebas completadas!" -ForegroundColor Green


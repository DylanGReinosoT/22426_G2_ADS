@echo off
REM Script para ejecutar pruebas del proyecto PintAuto Inventory Management
REM Autor: Sistema de Aseguramiento de Calidad
REM Fecha: 2026-02-04

setlocal enabledelayedexpansion

cls
echo ================================================
echo Ejecutando Pruebas - PintAuto Inventory Management
echo ================================================
echo.

REM Directorio del proyecto
set PROJECT_DIR=C:\Users\Admin\Desktop\7MO SEMESTRE\ASEGURAMIENTO DE LA CALIDAD\PRIMER PARCIAL\REPOSITORIO\22426_G2_ADS\CODIGO\CF_V1.0.2\inventory-management

REM Cambiar al directorio
cd /d "%PROJECT_DIR%" || (
    echo ERROR: No se puede acceder al directorio del proyecto
    echo %PROJECT_DIR%
    pause
    exit /b 1
)

echo [1/3] Limpiando proyecto...
call mvn clean
if errorlevel 1 (
    echo ERROR: Fallo al limpiar
    pause
    exit /b 1
)

echo.
echo [2/3] Compilando proyecto...
call mvn compile
if errorlevel 1 (
    echo ERROR: Fallo al compilar
    pause
    exit /b 1
)

echo.
echo [3/3] Ejecutando pruebas...
call mvn test

echo.
echo ================================================
echo Pruebas completadas
echo ================================================
pause


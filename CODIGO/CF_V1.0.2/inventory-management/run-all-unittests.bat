@echo off
setlocal enabledelayedexpansion
cd "C:\Users\Admin\Desktop\7MO SEMESTRE\ASEGURAMIENTO DE LA CALIDAD\PRIMER PARCIAL\REPOSITORIO\22426_G2_ADS\CODIGO\CF_V1.0.2\inventory-management"

cls
echo ================================================
echo Ejecutando TODOS los UnitTests
echo ================================================
echo.

REM Ejecutar cada test
echo [1/5] Ejecutando UsuarioControllerTest...
mvn test -Dtest=UsuarioControllerTest -q

echo [2/5] Ejecutando MateriaPrimaControllerTest...
mvn test -Dtest=MateriaPrimaControllerTest -q

echo [3/5] Ejecutando ClienteControllerTest...
mvn test -Dtest=ClienteControllerTest -q

echo [4/5] Ejecutando AuthControllerTest...
mvn test -Dtest=AuthControllerTest -q

echo [5/5] Ejecutando OrdenTrabajoControllerTest...
mvn test -Dtest=OrdenTrabajoControllerTest -q

echo.
echo ================================================
echo Todos los UnitTests completados
echo ================================================
pause


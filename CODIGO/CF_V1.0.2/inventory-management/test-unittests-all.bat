@echo off
cls
cd "C:\Users\Admin\Desktop\7MO SEMESTRE\ASEGURAMIENTO DE LA CALIDAD\PRIMER PARCIAL\REPOSITORIO\22426_G2_ADS\CODIGO\CF_V1.0.2\inventory-management"
echo ================================================
echo Ejecutando TODOS los UnitTests
echo ================================================
echo.
mvn test -Dtest=com.pintaauto.inventory.UnitTests.*
echo.
echo ================================================
pause


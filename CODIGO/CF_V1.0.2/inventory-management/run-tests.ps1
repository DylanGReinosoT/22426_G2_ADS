#!/usr/bin/env powershell
# Script de Ejecución de Pruebas - PintAuto Inventory Management
# Uso: .\run-tests.ps1 [opcion]

param(
    [Parameter(Position=0)]
    [string]$Option = "all"
)

# Colores para output
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Red = [System.ConsoleColor]::Red
$Blue = [System.ConsoleColor]::Blue

function Write-Header {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor $Blue
    Write-Host $Message -ForegroundColor $Blue
    Write-Host "========================================`n" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host $Message -ForegroundColor $Red
}

# Menu de opciones
function Show-Menu {
    Write-Host "`nOpciones disponibles:" -ForegroundColor $Blue
    Write-Host "1. all              - Ejecutar todas las pruebas"
    Write-Host "2. unit             - Solo pruebas unitarias"
    Write-Host "3. integration      - Solo pruebas de integración"
    Write-Host "4. materia-prima    - Solo MateriaPrimaServiceTest"
    Write-Host "5. cliente          - Solo ClienteServiceTest"
    Write-Host "6. usuario          - Solo UsuarioServiceTest"
    Write-Host "7. auth             - Solo AuthServiceTest"
    Write-Host "8. orden-trabajo    - Solo OrdenTrabajoServiceTest"
    Write-Host "9. cedula           - Solo CedulaEcuatorianaValidatorTest"
    Write-Host "10. edad            - Solo MayorEdadValidatorTest"
    Write-Host "11. jwt             - Solo JwtUtilTest"
    Write-Host "12. coverage        - Pruebas + Reporte de Cobertura"
    Write-Host "13. clean           - Limpiar archivos compilados"
    Write-Host "14. help            - Mostrar este menú"
}

# Funciones de ejecución
function Run-AllTests {
    Write-Header "Ejecutando TODAS las pruebas"
    & mvn clean test
    if ($LASTEXITCODE -eq 0) {
        Write-Success "`n✓ Todas las pruebas pasaron exitosamente`n"
    } else {
        Write-Error "`n✗ Algunas pruebas fallaron`n"
    }
}

function Run-UnitTests {
    Write-Header "Ejecutando pruebas UNITARIAS"
    & mvn test -Dtest="*ServiceTest,*ValidatorTest,*UtilTest"
}

function Run-IntegrationTests {
    Write-Header "Ejecutando pruebas de INTEGRACIÓN"
    & mvn test -Dtest="*IntegrationTest"
}

function Run-MateriaPrimaTest {
    Write-Header "Ejecutando MateriaPrimaServiceTest"
    & mvn test -Dtest=MateriaPrimaServiceTest
}

function Run-ClienteTest {
    Write-Header "Ejecutando ClienteServiceTest"
    & mvn test -Dtest=ClienteServiceTest
}

function Run-UsuarioTest {
    Write-Header "Ejecutando UsuarioServiceTest"
    & mvn test -Dtest=UsuarioServiceTest
}

function Run-AuthTest {
    Write-Header "Ejecutando AuthServiceTest"
    & mvn test -Dtest=AuthServiceTest
}

function Run-OrdenTrabajoTest {
    Write-Header "Ejecutando OrdenTrabajoServiceTest"
    & mvn test -Dtest=OrdenTrabajoServiceTest
}

function Run-CedulaTest {
    Write-Header "Ejecutando CedulaEcuatorianaValidatorTest"
    & mvn test -Dtest=CedulaEcuatorianaValidatorTest
}

function Run-EdadTest {
    Write-Header "Ejecutando MayorEdadValidatorTest"
    & mvn test -Dtest=MayorEdadValidatorTest
}

function Run-JwtTest {
    Write-Header "Ejecutando JwtUtilTest"
    & mvn test -Dtest=JwtUtilTest
}

function Run-Coverage {
    Write-Header "Ejecutando pruebas + Generando REPORTE DE COBERTURA"
    & mvn clean test jacoco:report
    if ($LASTEXITCODE -eq 0) {
        Write-Success "`n✓ Reporte generado en: target/site/jacoco/index.html`n"
        Write-Host "Para ver el reporte, abre: target/site/jacoco/index.html" -ForegroundColor $Yellow
    }
}

function Run-Clean {
    Write-Header "Limpiando archivos compilados"
    & mvn clean
    Write-Success "`n✓ Limpieza completada`n"
}

function Show-Help {
    Write-Header "AYUDA - Script de Pruebas"
    Write-Host "Uso: ./run-tests.ps1 [opcion]`n"
    Show-Menu
    Write-Host "`nEjemplos:`n"
    Write-Host "  ./run-tests.ps1 all           - Ejecuta todas las pruebas"
    Write-Host "  ./run-tests.ps1 unit          - Ejecuta solo unitarias"
    Write-Host "  ./run-tests.ps1 coverage      - Genera reporte de cobertura"
    Write-Host "  ./run-tests.ps1 help          - Muestra esta ayuda`n"
}

# Main script logic
Write-Host "`n╔════════════════════════════════════════════════╗" -ForegroundColor $Blue
Write-Host "║  PintAuto Inventory Management - Test Runner   ║" -ForegroundColor $Blue
Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor $Blue

# Validar que Maven está instalado
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Error "`n✗ Maven no está instalado o no está en el PATH`n"
    exit 1
}

# Ejecutar según la opción
switch ($Option.ToLower()) {
    "all" { Run-AllTests }
    "unit" { Run-UnitTests }
    "integration" { Run-IntegrationTests }
    "1" { Run-AllTests }
    "2" { Run-UnitTests }
    "3" { Run-IntegrationTests }
    "materia-prima" { Run-MateriaPrimaTest }
    "cliente" { Run-ClienteTest }
    "usuario" { Run-UsuarioTest }
    "auth" { Run-AuthTest }
    "orden-trabajo" { Run-OrdenTrabajoTest }
    "cedula" { Run-CedulaTest }
    "edad" { Run-EdadTest }
    "jwt" { Run-JwtTest }
    "4" { Run-MateriaPrimaTest }
    "5" { Run-ClienteTest }
    "6" { Run-UsuarioTest }
    "7" { Run-AuthTest }
    "8" { Run-OrdenTrabajoTest }
    "9" { Run-CedulaTest }
    "10" { Run-EdadTest }
    "11" { Run-JwtTest }
    "coverage" { Run-Coverage }
    "12" { Run-Coverage }
    "clean" { Run-Clean }
    "13" { Run-Clean }
    "help" { Show-Help }
    "14" { Show-Help }
    default {
        Write-Warning "`nOpción no reconocida: $Option`n"
        Show-Menu
        Write-Host "`nUsa: ./run-tests.ps1 help para más información`n"
    }
}

Write-Host "`n" -ForegroundColor $Blue


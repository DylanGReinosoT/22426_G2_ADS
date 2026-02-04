#!/bin/bash
# Script de Ejecución de Pruebas - PintAuto Inventory Management
# Uso: ./run-tests.sh [opcion]

set -e  # Salir si hay error

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
write_header() {
    echo -e "\n${BLUE}========================================"
    echo -e "$1"
    echo -e "========================================${NC}\n"
}

write_success() {
    echo -e "${GREEN}$1${NC}"
}

write_warning() {
    echo -e "${YELLOW}$1${NC}"
}

write_error() {
    echo -e "${RED}$1${NC}"
}

# Mostrar menú
show_menu() {
    echo -e "${BLUE}Opciones disponibles:${NC}"
    echo "1. all              - Ejecutar todas las pruebas"
    echo "2. unit             - Solo pruebas unitarias"
    echo "3. integration      - Solo pruebas de integración"
    echo "4. materia-prima    - Solo MateriaPrimaServiceTest"
    echo "5. cliente          - Solo ClienteServiceTest"
    echo "6. usuario          - Solo UsuarioServiceTest"
    echo "7. auth             - Solo AuthServiceTest"
    echo "8. orden-trabajo    - Solo OrdenTrabajoServiceTest"
    echo "9. cedula           - Solo CedulaEcuatorianaValidatorTest"
    echo "10. edad            - Solo MayorEdadValidatorTest"
    echo "11. jwt             - Solo JwtUtilTest"
    echo "12. coverage        - Pruebas + Reporte de Cobertura"
    echo "13. clean           - Limpiar archivos compilados"
    echo "14. help            - Mostrar este menú"
}

# Funciones de ejecución
run_all_tests() {
    write_header "Ejecutando TODAS las pruebas"
    mvn clean test
    if [ $? -eq 0 ]; then
        write_success "\n✓ Todas las pruebas pasaron exitosamente\n"
    else
        write_error "\n✗ Algunas pruebas fallaron\n"
    fi
}

run_unit_tests() {
    write_header "Ejecutando pruebas UNITARIAS"
    mvn test -Dtest="*ServiceTest,*ValidatorTest,*UtilTest"
}

run_integration_tests() {
    write_header "Ejecutando pruebas de INTEGRACIÓN"
    mvn test -Dtest="*IntegrationTest"
}

run_materia_prima_test() {
    write_header "Ejecutando MateriaPrimaServiceTest"
    mvn test -Dtest=MateriaPrimaServiceTest
}

run_cliente_test() {
    write_header "Ejecutando ClienteServiceTest"
    mvn test -Dtest=ClienteServiceTest
}

run_usuario_test() {
    write_header "Ejecutando UsuarioServiceTest"
    mvn test -Dtest=UsuarioServiceTest
}

run_auth_test() {
    write_header "Ejecutando AuthServiceTest"
    mvn test -Dtest=AuthServiceTest
}

run_orden_trabajo_test() {
    write_header "Ejecutando OrdenTrabajoServiceTest"
    mvn test -Dtest=OrdenTrabajoServiceTest
}

run_cedula_test() {
    write_header "Ejecutando CedulaEcuatorianaValidatorTest"
    mvn test -Dtest=CedulaEcuatorianaValidatorTest
}

run_edad_test() {
    write_header "Ejecutando MayorEdadValidatorTest"
    mvn test -Dtest=MayorEdadValidatorTest
}

run_jwt_test() {
    write_header "Ejecutando JwtUtilTest"
    mvn test -Dtest=JwtUtilTest
}

run_coverage() {
    write_header "Ejecutando pruebas + Generando REPORTE DE COBERTURA"
    mvn clean test jacoco:report
    if [ $? -eq 0 ]; then
        write_success "\n✓ Reporte generado en: target/site/jacoco/index.html\n"
        write_warning "Para ver el reporte, abre: target/site/jacoco/index.html"
    fi
}

run_clean() {
    write_header "Limpiando archivos compilados"
    mvn clean
    write_success "\n✓ Limpieza completada\n"
}

show_help() {
    write_header "AYUDA - Script de Pruebas"
    echo "Uso: ./run-tests.sh [opcion]"
    echo
    show_menu
    echo
    echo -e "${BLUE}Ejemplos:${NC}"
    echo "  ./run-tests.sh all           - Ejecuta todas las pruebas"
    echo "  ./run-tests.sh unit          - Ejecuta solo unitarias"
    echo "  ./run-tests.sh coverage      - Genera reporte de cobertura"
    echo "  ./run-tests.sh help          - Muestra esta ayuda"
    echo
}

# Main script logic
clear
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════╗"
echo "║  PintAuto Inventory Management - Test Runner   ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Validar que Maven está instalado
if ! command -v mvn &> /dev/null; then
    write_error "\n✗ Maven no está instalado o no está en el PATH\n"
    exit 1
fi

# Obtener opción (por defecto "all")
OPTION="${1:all}"

# Convertir a minúsculas
OPTION=$(echo "$OPTION" | tr '[:upper:]' '[:lower:]')

# Ejecutar según la opción
case $OPTION in
    "all"|"1")
        run_all_tests
        ;;
    "unit"|"2")
        run_unit_tests
        ;;
    "integration"|"3")
        run_integration_tests
        ;;
    "materia-prima"|"4")
        run_materia_prima_test
        ;;
    "cliente"|"5")
        run_cliente_test
        ;;
    "usuario"|"6")
        run_usuario_test
        ;;
    "auth"|"7")
        run_auth_test
        ;;
    "orden-trabajo"|"8")
        run_orden_trabajo_test
        ;;
    "cedula"|"9")
        run_cedula_test
        ;;
    "edad"|"10")
        run_edad_test
        ;;
    "jwt"|"11")
        run_jwt_test
        ;;
    "coverage"|"12")
        run_coverage
        ;;
    "clean"|"13")
        run_clean
        ;;
    "help"|"14")
        show_help
        ;;
    *)
        write_warning "\nOpción no reconocida: $OPTION\n"
        show_menu
        echo
        write_warning "Usa: ./run-tests.sh help para más información\n"
        ;;
esac

echo -e "\n"


# Guía de Pruebas - PintAuto Inventory Management

## 1. PRUEBAS UNITARIAS CON JUnit 5

### Descripción
Las pruebas unitarias validan el comportamiento de componentes individuales de la aplicación en aislamiento usando mocks.

### Archivos de Pruebas Creados

#### Servicios
- **MateriaPrimaServiceTest.java** - Pruebas del servicio de materias primas
- **ClienteServiceTest.java** - Pruebas del servicio de clientes
- **UsuarioServiceTest.java** - Pruebas del servicio de usuarios
- **AuthServiceTest.java** - Pruebas del servicio de autenticación
- **OrdenTrabajoServiceTest.java** - Pruebas del servicio de órdenes de trabajo

#### Validadores
- **CedulaEcuatorianaValidatorTest.java** - Pruebas del validador de cédula ecuatoriana
- **MayorEdadValidatorTest.java** - Pruebas del validador de mayoría de edad

#### Utilidades
- **JwtUtilTest.java** - Pruebas del generador de tokens JWT

### Ejecutar Pruebas Unitarias

#### Opción 1: Ejecutar todas las pruebas
```bash
mvn test
```

#### Opción 2: Ejecutar pruebas de un archivo específico
```bash
mvn test -Dtest=MateriaPrimaServiceTest
mvn test -Dtest=ClienteServiceTest
mvn test -Dtest=UsuarioServiceTest
mvn test -Dtest=AuthServiceTest
mvn test -Dtest=OrdenTrabajoServiceTest
mvn test -Dtest=CedulaEcuatorianaValidatorTest
mvn test -Dtest=MayorEdadValidatorTest
mvn test -Dtest=JwtUtilTest
```

#### Opción 3: Ejecutar con Maven wrapper
```bash
./mvnw test
./mvnw test -Dtest=MateriaPrimaServiceTest
```

#### Opción 4: Ejecutar en PowerShell (Windows)
```powershell
mvn test
mvn test -Dtest=MateriaPrimaServiceTest
```

### Generar Reporte de Cobertura
```bash
mvn clean test jacoco:report
```

El reporte se generará en:
```
target/site/jacoco/index.html
```

## 2. PRUEBAS DE INTEGRACIÓN

### Descripción
Las pruebas de integración validan la interacción entre componentes reales de la aplicación.

### Archivos de Pruebas de Integración
- **MateriaPrimaControllerIntegrationTest.java** - Pruebas del controlador de materias primas

### Ejecutar Pruebas de Integración
```bash
# Ejecutar todas las pruebas incluyendo integración
mvn test

# Ejecutar solo pruebas de integración
mvn test -Dtest=*IntegrationTest

# Ejecutar prueba específica
mvn test -Dtest=MateriaPrimaControllerIntegrationTest
```

## 3. PRUEBAS DE ESTRÉS CON JMETER

### Descripción
Las pruebas de estrés verifican el comportamiento del sistema bajo carga alta.

### Requisitos Previos
1. Descargar JMeter desde: https://jmeter.apache.org/download_jmeter.cgi
2. Extraer el archivo descargado
3. La aplicación debe estar en ejecución en http://localhost:8080

### Archivo de Configuración
- **jmeter-stress-test.jmx** - Archivo de prueba de estrés

### Ejecutar Pruebas de Estrés

#### Opción 1: Interfaz Gráfica
```bash
# En Windows
C:\ruta\a\jmeter\bin\jmeter.bat

# En Linux/Mac
/ruta/a/jmeter/bin/jmeter.sh
```

Luego:
1. Abrir el archivo: jmeter-stress-test.jmx
2. Configurar los parámetros en el "Test Plan":
   - **host**: localhost (o tu servidor)
   - **port**: 8080
   - **protocol**: http
   - **numThreads**: 50 (número de usuarios concurrentes)
   - **rampUp**: 10 (segundos para subir la carga)
   - **duration**: 60 (segundos de duración de la prueba)
3. Hacer clic en "Start" o Ctrl+Enter

#### Opción 2: Línea de Comandos (modo headless)
```bash
# Windows
C:\ruta\a\jmeter\bin\jmeter.bat -n -t jmeter-stress-test.jmx -l results.jtl -j jmeter.log

# Linux/Mac
/ruta/a/jmeter/bin/jmeter.sh -n -t jmeter-stress-test.jmx -l results.jtl -j jmeter.log
```

### Parámetros de la Prueba de Estrés

| Parámetro | Valor Predeterminado | Descripción |
|-----------|---------------------|-------------|
| host | localhost | Host del servidor |
| port | 8080 | Puerto del servidor |
| protocol | http | Protocolo (http o https) |
| numThreads | 50 | Número de usuarios virtuales |
| rampUp | 10 | Tiempo en segundos para alcanzar usuarios máximos |
| duration | 60 | Duración de la prueba en segundos |

### Endpoints Probados en la Prueba de Estrés

1. **GET /api/materias-primas** - Obtener todas las materias primas
2. **GET /api/clientes/{id}** - Obtener cliente por ID
3. **GET /api/ordenes-trabajo** - Obtener todas las órdenes de trabajo
4. **GET /api/usuarios** - Obtener todos los usuarios

### Interpretar Resultados

#### Tabla de Resultados (View Results Table)
Muestra cada request con:
- **Label**: Nombre del request
- **Samples**: Número de requests enviados
- **Average**: Tiempo promedio en ms
- **Min/Max**: Tiempo mínimo/máximo
- **Error %**: Porcentaje de errores
- **Throughput**: Requests por segundo

#### Gráfica de Resultados
Visualiza:
- Respuesta actual
- Desviación estándar
- Línea de tendencia

#### Reporte Agregado (Aggregate Report)
- Estadísticas agregadas por endpoint
- Incluye percentiles (p50, p90, p95, p99)

### Análisis de Resultados

**Indicadores de Buen Desempeño:**
- Tiempo promedio < 500ms
- Porcentaje de error = 0%
- Throughput > 100 req/sec

**Indicadores de Problemas:**
- Timeout frecuentes
- Errores 500 (Internal Server Error)
- Memory Leak (uso de memoria creciente)

## 4. COBERTURA DE PRUEBAS

### Servicios Probados
- ✅ MateriaPrimaService (9 casos de prueba)
- ✅ ClienteService (10 casos de prueba)
- ✅ UsuarioService (11 casos de prueba)
- ✅ AuthService (9 casos de prueba)
- ✅ OrdenTrabajoService (9 casos de prueba)

### Validadores Probados
- ✅ CedulaEcuatorianaValidator (12 casos de prueba)
- ✅ MayorEdadValidator (15 casos de prueba)

### Utilidades Probadas
- ✅ JwtUtil (12 casos de prueba)

### Controladores Probados
- ✅ MateriaPrimaController (9 casos de prueba)

**Total de Casos de Prueba**: 96 pruebas unitarias

## 5. EJECUCIÓN COMPLETA

### Ejecutar Todo en Secuencia
```bash
# 1. Ejecutar todas las pruebas
mvn clean test

# 2. Generar reporte de cobertura
mvn jacoco:report

# 3. Iniciar la aplicación
mvn spring-boot:run

# 4. Ejecutar pruebas de estrés con JMeter (en otra terminal)
jmeter -n -t jmeter-stress-test.jmx -l results.jtl
```

## 6. MEJORES PRÁCTICAS

### Para Pruebas Unitarias
1. ✅ Usar mocks para dependencias externas
2. ✅ Probar casos exitosos y de error
3. ✅ Mantener pruebas pequeñas y enfocadas
4. ✅ Nombrar pruebas de forma descriptiva

### Para Pruebas de Integración
1. ✅ Usar @SpringBootTest para contexto real
2. ✅ Usar @AutoConfigureMockMvc para MockMvc
3. ✅ Probar endpoints completos
4. ✅ Verificar respuestas HTTP

### Para Pruebas de Estrés
1. ✅ Comenzar con carga baja y aumentar gradualmente
2. ✅ Mantener pruebas cortas (< 5 minutos) durante desarrollo
3. ✅ Analizar resultados para identificar cuellos de botella
4. ✅ Probar bajo diferentes condiciones de red

## 7. SOLUCIÓN DE PROBLEMAS

### Error: "No se puede conectar a localhost:8080"
**Solución**: Asegúrate de que la aplicación está corriendo con `mvn spring-boot:run`

### Error: "Port 8080 already in use"
**Solución**: Cambia el puerto en application.properties o termina el proceso
```bash
# Usar otro puerto
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

### Timeout en JMeter
**Solución**: Aumenta el timeout en la configuración HTTP de JMeter o reduce numThreads

### Bajo desempeño en pruebas
**Solución**: 
- Verifica consultas SQL lentas
- Aumenta heap memory: `-Xmx1024m`
- Activa profiling con JProfiler o YourKit

## 8. DOCUMENTACIÓN ADICIONAL

- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [JMeter User Manual](https://jmeter.apache.org/usermanual/index.html)

## 9. COMANDOS RÁPIDOS

```bash
# Limpiar y compilar
mvn clean compile

# Ejecutar pruebas
mvn test

# Generar reportes
mvn clean test jacoco:report site

# Ejecutar aplicación
mvn spring-boot:run

# Ejecutar con parámetros
mvn test -Dtest=MateriaPrimaServiceTest -DfailIfNoTests=false

# Ejecutar en PowerShell (Windows)
mvn.cmd test
```

---

**Versión**: 1.0.0
**Última actualización**: 2024
**Autor**: GitHub Copilot


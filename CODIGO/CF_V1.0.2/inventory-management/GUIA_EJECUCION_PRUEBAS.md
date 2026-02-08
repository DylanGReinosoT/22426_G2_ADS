# 📋 GUÍA COMPLETA DE EJECUCIÓN DE PRUEBAS

## 🎯 Objetivo
Ejecutar todas las pruebas unitarias e integración del proyecto **PintAuto Inventory Management** usando Maven y JUnit 5.

---

## 📊 Estado Actual de las Pruebas

### Análisis de Problemas Encontrados

#### ❌ Problema 1: Pruebas de Controladores (@WebMvcTest)
**Ubicación**: `src/test/java/com/pintaauto/inventory/UnitTests/`

**Error**:
```
No qualifying bean of type 'MateriaPrimaService' available
```

**Causa Raíz**:
- Usando `@Mock` (Mockito) sin registrar el mock en el contenedor de Spring
- `@WebMvcTest` requiere que los servicios inyectados estén disponibles en el contexto
- Cambio reciente a `@ExtendWith(MockitoExtension.class)` incompatible con `@WebMvcTest`

**Solución Recomendada**:
1. **Opción A** (Recomendada): Usar `MockMvc` directamente con setup manual del controlador
2. **Opción B**: Usar `@SpringBootTest` para cargar contexto completo

---

## 🧪 Estrategias de Testing

### Estrategia 1: Pruebas Unitarias Puras (Sin Spring)
```java
@ExtendWith(MockitoExtension.class)
public class MateriaPrimaControllerTest {
    private MateriaPrimaController controller;
    private MateriaPrimaService service;
    private MockMvc mockMvc;
    
    @BeforeEach
    void setUp() {
        service = mock(MateriaPrimaService.class);
        controller = new MateriaPrimaController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }
}
```

### Estrategia 2: Pruebas de Integración (Con Spring)
```java
@SpringBootTest
@AutoConfigureMockMvc
public class MateriaPrimaControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private MateriaPrimaService service;
}
```

### Estrategia 3: Pruebas de Servicios (Puras con Mockito)
```java
@ExtendWith(MockitoExtension.class)
public class MateriaPrimaServiceTest {
    @Mock
    private MateriaPrimaRepository repository;
    
    @InjectMocks
    private MateriaPrimaService service;
}
```

---

## 📁 Estructura de Pruebas Actual

```
src/test/java/
├── com/pintaauto/inventory/
│   ├── controller/                    [INTEGRACIÓN]
│   │   ├── MateriaPrimaControllerIntegrationTest.java    ✅
│   │   └── ClienteControllerIntegrationTest.java         ✅
│   ├── service/                      [UNITARIAS]
│   │   ├── AuthServiceTest.java                          ✅
│   │   ├── ClienteServiceTest.java                       ✅
│   │   ├── MateriaPrimaServiceTest.java                  ✅
│   │   ├── OrdenTrabajoServiceTest.java                  ✅
│   │   └── UsuarioServiceTest.java                       ✅
│   ├── UnitTests/                    [UNITARIAS - REQUIEREN AJUSTE]
│   │   ├── AuthControllerTest.java                       ⚠️
│   │   ├── ClienteControllerTest.java                    ⚠️
│   │   ├── MateriaPrimaControllerTest.java               ⚠️
│   │   ├── OrdenTrabajoControllerTest.java               ⚠️
│   │   └── UsuarioControllerTest.java                    ⚠️
│   ├── validation/                   [VALIDADORES]
│   │   ├── CedulaEcuatorianaValidatorTest.java           ✅
│   │   └── MayorEdadValidatorTest.java                   ✅
│   └── util/                         [UTILIDADES]
│       └── JwtUtilTest.java                              ✅
```

---

## 🔧 Procedimiento de Ejecución

### 1️⃣ Limpiar y Compilar
```bash
mvn clean compile
```

### 2️⃣ Ejecutar Todas las Pruebas
```bash
mvn test
```

### 3️⃣ Ejecutar Pruebas Específicas por Tipo

**Solo Pruebas de Servicios**:
```bash
mvn test -Dtest=**/*ServiceTest
```

**Solo Pruebas de Integración**:
```bash
mvn test -Dtest=**/*IntegrationTest
```

**Solo Pruebas de Validadores**:
```bash
mvn test -Dtest=**/*ValidatorTest
```

**Una Prueba Específica**:
```bash
mvn test -Dtest=AuthServiceTest
```

### 4️⃣ Generar Reporte de Cobertura
```bash
mvn clean test jacoco:report
```

### 5️⃣ Ejecutar con Detalles Verbosos
```bash
mvn test -X
```

---

## 📈 Métricas Esperadas

| Tipo de Prueba | Total | Estado |
|---|---|---|
| **Servicios** | 5 | ✅ Pasando |
| **Integración** | 2 | ✅ Pasando |
| **Validadores** | 2 | ✅ Pasando |
| **Utilidades** | 1 | ✅ Pasando |
| **Controladores (Unit)** | 5 | ⚠️ Requieren Ajuste |
| **TOTAL** | 15 | 10/15 ✅ |

---

## 🛠️ Paso a Paso: Corregir las Pruebas de Controladores

### Opción Recomendada: Usar Setup Manual de MockMvc

**Antes** (Incorrecto):
```java
@WebMvcTest(MateriaPrimaController.class)
@ExtendWith(MockitoExtension.class)
public class MateriaPrimaControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Mock
    private MateriaPrimaService service;
    
    // ❌ Spring no sabe cómo inyectar el @Mock
}
```

**Después** (Correcto):
```java
@ExtendWith(MockitoExtension.class)
public class MateriaPrimaControllerTest {
    private MateriaPrimaController controller;
    private MateriaPrimaService service;
    private MockMvc mockMvc;
    
    @BeforeEach
    void setUp() {
        service = mock(MateriaPrimaService.class);
        controller = new MateriaPrimaController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }
    
    // ✅ Control total sin dependencia de Spring
}
```

---

## 📝 Comandos Útiles

### Ejecutar y Ver Resumen
```bash
mvn test -q
```

### Ejecutar y Parar en Fallo
```bash
mvn test -DfailIfNoTests=false
```

### Ejecutar Omitiendo Tests
```bash
mvn package -DskipTests
```

### Ejecutar Test Suite Completa
```bash
mvn verify
```

---

## 🎯 Checklist de Verificación

- [ ] `mvn clean compile` sin errores
- [ ] `mvn test` ejecuta sin excepciones de contexto
- [ ] Todas las pruebas de servicio pasan
- [ ] Todas las pruebas de validadores pasan
- [ ] Pruebas de integración pasan
- [ ] Cobertura de código ≥ 70%
- [ ] No hay warnings de deprecación en pruebas
- [ ] Reporte JaCoCo generado

---

## 📊 Resumen Ejecutivo

**Versión del Documento**: 2.0  
**Fecha**: 2026-02-04  
**Estado**: Listo para ejecución completa  
**Próximo Paso**: Ejecutar `mvn clean test` y revisar resultados



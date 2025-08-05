# Pruebas Unitarias de Controladores - PintaAuto

Este directorio contiene las pruebas unitarias para todos los controladores del sistema PintaAuto Inventory Management.

## Estructura de Pruebas

### 1. ClienteControllerTest.java
Pruebas para el controlador de clientes que cubren:
- ✅ Obtener todos los clientes
- ✅ Obtener cliente por ID (existente y no existente)
- ✅ Crear nuevo cliente (datos válidos e inválidos)
- ✅ Actualizar cliente (existente y no existente)
- ✅ Eliminar cliente (existente y no existente)
- ✅ Validaciones de campos (email, cédula, datos obligatorios)
- ✅ Manejo de errores por duplicación de datos

### 2. MateriaPrimaControllerTest.java
Pruebas para el controlador de materias primas que cubren:
- ✅ Obtener todas las materias primas
- ✅ Obtener materia prima por ID (existente y no existente)
- ✅ Crear nueva materia prima (datos válidos e inválidos)
- ✅ Actualizar materia prima (existente y no existente)
- ✅ Eliminar materia prima (existente y no existente)
- ✅ Buscar materias primas por nombre
- ✅ Validaciones de campos (nombre, precio, cantidad)
- ✅ Manejo de errores de negocio

### 3. OrdenTrabajoControllerTest.java
Pruebas para el controlador de órdenes de trabajo que cubren:
- ✅ Obtener todas las órdenes de trabajo
- ✅ Obtener orden por ID (existente y no existente)
- ✅ Crear nueva orden (datos válidos e inválidos)
- ✅ Actualizar orden (existente y no existente)
- ✅ Eliminar orden (existente y no existente)
- ✅ Buscar órdenes por título
- ✅ Buscar órdenes por usuario
- ✅ Validaciones de relaciones (usuario, cliente, materiales)
- ✅ Manejo de inventario insuficiente

### 4. AuthControllerTest.java
Pruebas para el controlador de autenticación que cubren:
- ✅ Login con credenciales válidas
- ✅ Login con credenciales inválidas
- ✅ Validación de campos de entrada
- ✅ Manejo de usuarios inexistentes
- ✅ Verificación de token
- ✅ Manejo de errores de validación
- ✅ Casos extremos (JSON malformado, campos vacíos/nulos)

### 5. UsuarioControllerTest.java
Pruebas para el controlador de usuarios que cubren:
- ✅ Obtener todos los usuarios
- ✅ Obtener usuario por ID (existente y no existente)
- ✅ Eliminar usuario (existente y no existente)
- ✅ Validaciones de ID (inválido, negativo, cero)
- ✅ Diferentes tipos de usuario (Admin, Operador)
- ✅ Manejo de errores de servicio

## Tecnologías Utilizadas

- **JUnit 5**: Framework de pruebas unitarias
- **Mockito**: Framework para mocking
- **Spring Boot Test**: Integración con Spring Boot
- **MockMvc**: Para pruebas de controladores web
- **@WebMvcTest**: Pruebas específicas de la capa web
- **Jackson**: Para serialización/deserialización JSON

## Anotaciones Principales

- `@WebMvcTest`: Configura el contexto de Spring para pruebas de controladores
- `@MockBean`: Crea mocks de los servicios inyectados
- `@BeforeEach`: Configuración inicial antes de cada prueba
- `@Test`: Marca los métodos como pruebas unitarias

## Patrones de Prueba Implementados

### Given-When-Then
Todas las pruebas siguen el patrón AAA (Arrange-Act-Assert):
```java
@Test
void testMethod() {
    // Given - Configuración inicial
    when(service.method()).thenReturn(expectedResult);
    
    // When & Then - Ejecución y verificación
    mockMvc.perform(get("/api/endpoint"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.datos").exists());
}
```

### Casos de Prueba Cubiertos

1. **Casos Exitosos**: Operaciones que deben funcionar correctamente
2. **Casos de Error**: Validación de manejo de errores
3. **Casos Límite**: Validación de valores extremos
4. **Validaciones**: Verificación de reglas de negocio
5. **Casos de Seguridad**: Validación de autenticación/autorización

## Métricas de Cobertura

Las pruebas cubren:
- ✅ Todos los endpoints HTTP (GET, POST, PUT, DELETE)
- ✅ Códigos de estado HTTP (200, 201, 400, 404, 500)
- ✅ Validaciones de entrada
- ✅ Manejo de excepciones
- ✅ Respuestas JSON
- ✅ Integración con servicios

## Ejecutar las Pruebas

### Ejecutar todas las pruebas:
```bash
mvn test
```

### Ejecutar pruebas específicas:
```bash
mvn test -Dtest=ClienteControllerTest
mvn test -Dtest=MateriaPrimaControllerTest
mvn test -Dtest=OrdenTrabajoControllerTest
mvn test -Dtest=AuthControllerTest
mvn test -Dtest=UsuarioControllerTest
```

### Ejecutar con reporte de cobertura:
```bash
mvn test jacoco:report
```

## Estructura de Respuesta API

Todas las pruebas validan la estructura estándar de respuesta:
```json
{
  "exito": true,
  "mensaje": "Descripción del resultado",
  "datos": { /* Datos de respuesta */ }
}
```

## Casos de Error Validados

- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: Credenciales incorrectas
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Errores internos del servidor

## Mantenimiento

Para mantener estas pruebas:
1. Actualizar cuando se modifiquen los controladores
2. Agregar nuevas pruebas para nuevos endpoints
3. Revisar y actualizar los datos de prueba según cambios en el modelo
4. Mantener la cobertura de pruebas por encima del 80%

## Notas Importantes

- Las pruebas utilizan mocks para aislar la capa de controladores
- No se requiere base de datos para ejecutar estas pruebas
- Los datos de prueba están configurados en el método `setUp()` de cada clase
- Todas las pruebas son independientes y no tienen efectos secundarios

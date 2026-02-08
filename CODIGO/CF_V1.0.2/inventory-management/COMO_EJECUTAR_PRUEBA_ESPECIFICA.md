# 🧪 CÓMO EJECUTAR UNA PRUEBA ESPECÍFICA

## Opción 1: Ejecutar UsuarioControllerTest

### En Command Prompt:
```cmd
cd "C:\Users\Admin\Desktop\7MO SEMESTRE\ASEGURAMIENTO DE LA CALIDAD\PRIMER PARCIAL\REPOSITORIO\22426_G2_ADS\CODIGO\CF_V1.0.2\inventory-management"
mvn test -Dtest=UsuarioControllerTest
```

### O ejecutar el script:
```cmd
test-usuario.bat
```

---

## Opción 2: Ejecutar una prueba específica dentro de la clase

```cmd
mvn test -Dtest=UsuarioControllerTest#testObtenerTodos_DebeRetornarListaDeUsuarios
```

---

## Opción 3: Ejecutar otros tests específicos

### Test de MateriaPrima:
```cmd
mvn test -Dtest=MateriaPrimaControllerTest
```

### Test de Cliente:
```cmd
mvn test -Dtest=ClienteControllerTest
```

### Test de Auth:
```cmd
mvn test -Dtest=AuthControllerTest
```

### Test de OrdenTrabajo:
```cmd
mvn test -Dtest=OrdenTrabajoControllerTest
```

---

## ✅ Resultado Esperado (si pasa en VERDE)

```
[INFO] Running com.pintaauto.inventory.UnitTests.UsuarioControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: X.XXX s - OK
[INFO]
[INFO] BUILD SUCCESS
```

---

## ⚠️ Si ves algo diferente

Si ves:
- `Failures: X` - Algunos tests no pasaron
- `Errors: X` - Hay errores en los tests
- `BUILD FAILURE` - El build falló

---

## 📊 Tests en UsuarioControllerTest

1. **testObtenerTodos_DebeRetornarListaDeUsuarios** - GET /api/usuarios
2. **testObtenerPorId_CuandoUsuarioExiste_DebeRetornarUsuario** - GET /api/usuarios/1
3. **testObtenerPorId_CuandoUsuarioNoExiste_DebeRetornarError** - GET /api/usuarios/99 (no existe)
4. **testEliminar_ConIdValido_DebeEliminarUsuario** - DELETE /api/usuarios/1
5. **testEliminar_ConIdInexistente_DebeRetornarError** - DELETE /api/usuarios/99

---

## 🎯 Para ver todos los tests disponibles

```cmd
mvn test -Dtest=UsuarioControllerTest -v
```

O

```cmd
mvn test --help
```

---

**Fecha**: 4 de febrero de 2026


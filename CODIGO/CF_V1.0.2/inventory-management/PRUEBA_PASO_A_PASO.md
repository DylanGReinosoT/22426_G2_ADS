# 🎯 PRUEBA ESPECÍFICA - PASO A PASO

## ✅ Para Ejecutar el Test de UsuarioControllerTest

### Paso 1: Abre Command Prompt
- Presiona: `Win + R`
- Escribe: `cmd`
- Presiona: `Enter`

### Paso 2: Navega al directorio
Copia y pega esto:
```
cd "C:\Users\Admin\Desktop\7MO SEMESTRE\ASEGURAMIENTO DE LA CALIDAD\PRIMER PARCIAL\REPOSITORIO\22426_G2_ADS\CODIGO\CF_V1.0.2\inventory-management"
```

### Paso 3: Ejecuta el test
```
mvn test -Dtest=UsuarioControllerTest
```

---

## 📊 Lo que Verás en Pantalla

### ✅ VERDE (Éxito)
```
[INFO] Running com.pintaauto.inventory.UnitTests.UsuarioControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.XXX s - OK
[INFO]
[INFO] BUILD SUCCESS
```

### ❌ ROJO (Fallo)
```
[ERROR] Tests run: 5, Failures: 2, Errors: 1, Skipped: 0
[INFO]
[INFO] BUILD FAILURE
```

---

## 🧪 Tests que se Ejecutarán

```
✅ testObtenerTodos_DebeRetornarListaDeUsuarios
✅ testObtenerPorId_CuandoUsuarioExiste_DebeRetornarUsuario
✅ testObtenerPorId_CuandoUsuarioNoExiste_DebeRetornarError
✅ testEliminar_ConIdValido_DebeEliminarUsuario
✅ testEliminar_ConIdInexistente_DebeRetornarError
```

---

## 🎯 Para Ejecutar Otros Tests Específicos

### Test de MateriaPrima
```
mvn test -Dtest=MateriaPrimaControllerTest
```

### Test de Cliente
```
mvn test -Dtest=ClienteControllerTest
```

### Test de Auth
```
mvn test -Dtest=AuthControllerTest
```

### Test de OrdenTrabajo
```
mvn test -Dtest=OrdenTrabajoControllerTest
```

### Una prueba específica dentro de una clase
```
mvn test -Dtest=UsuarioControllerTest#testObtenerTodos_DebeRetornarListaDeUsuarios
```

---

## 💡 Alternativa: Usar el Script

También puedes hacer doble clic en este archivo:
```
test-usuario.bat
```

Se abrirá Command Prompt y ejecutará el test automáticamente.

---

## ⏱️ Tiempo Esperado

- Primera ejecución: ~20-30 segundos (descarga dependencias)
- Ejecuciones siguientes: ~5-10 segundos

---

**¡Listo! Ahora puedes ejecutar la prueba.** ✅


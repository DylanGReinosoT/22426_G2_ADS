# 🧪 EJECUTAR SOLO TESTS UNITARIOS (UnitTests)

## ✅ Comando para Ejecutar SOLO UnitTests

```cmd
mvn test -Dtest=com.pintaauto.inventory.UnitTests.*
```

O usando patrón más específico:

```cmd
mvn test -Dtest=*ControllerTest
```

---

## 📋 Tests UnitTests Disponibles

Estos son los tests en la carpeta `UnitTests`:

1. **AuthControllerTest**
   ```cmd
   mvn test -Dtest=AuthControllerTest
   ```

2. **MateriaPrimaControllerTest**
   ```cmd
   mvn test -Dtest=MateriaPrimaControllerTest
   ```

3. **ClienteControllerTest**
   ```cmd
   mvn test -Dtest=ClienteControllerTest
   ```

4. **OrdenTrabajoControllerTest**
   ```cmd
   mvn test -Dtest=OrdenTrabajoControllerTest
   ```

5. **UsuarioControllerTest** ✅ (Este ya está VERDE)
   ```cmd
   mvn test -Dtest=UsuarioControllerTest
   ```

---

## 🎯 Ejecutar TODOS los UnitTests Juntos

```cmd
cd "C:\Users\Admin\Desktop\7MO SEMESTRE\ASEGURAMIENTO DE LA CALIDAD\PRIMER PARCIAL\REPOSITORIO\22426_G2_ADS\CODIGO\CF_V1.0.2\inventory-management"

mvn test -Dtest=com.pintaauto.inventory.UnitTests.*
```

---

## 📊 Resultado Esperado

Si ejecutas todos los UnitTests:

```
[INFO] Running com.pintaauto.inventory.UnitTests.AuthControllerTest
[INFO] Tests run: X, Failures: X, Errors: X

[INFO] Running com.pintaauto.inventory.UnitTests.ClienteControllerTest
[INFO] Tests run: X, Failures: X, Errors: X

[INFO] Running com.pintaauto.inventory.UnitTests.MateriaPrimaControllerTest
[INFO] Tests run: X, Failures: X, Errors: X

[INFO] Running com.pintaauto.inventory.UnitTests.OrdenTrabajoControllerTest
[INFO] Tests run: X, Failures: X, Errors: X

[INFO] Running com.pintaauto.inventory.UnitTests.UsuarioControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0 ✅

[INFO] BUILD SUCCESS
```

---

## 🎯 Script Rápido

O crea un archivo `test-unittests.bat`:

```batch
@echo off
cd "C:\Users\Admin\Desktop\7MO SEMESTRE\ASEGURAMIENTO DE LA CALIDAD\PRIMER PARCIAL\REPOSITORIO\22426_G2_ADS\CODIGO\CF_V1.0.2\inventory-management"
echo ================================================
echo Ejecutando TODOS los UnitTests
echo ================================================
mvn test -Dtest=com.pintaauto.inventory.UnitTests.*
pause
```

Y ejecuta: `test-unittests.bat`

---

**Nota**: Los UnitTests están en:
`src/test/java/com/pintaauto/inventory/UnitTests/`


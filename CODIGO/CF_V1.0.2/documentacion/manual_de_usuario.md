# Manual de Usuario — Sistema de Gestión PintAuto

**Versión:** 1.1.0  
**Fecha:** Junio 2026  
**Sistema:** PintAuto — Control Integral de Inventario

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Requisitos para el uso](#2-requisitos-para-el-uso)
3. [Acceso al sistema](#3-acceso-al-sistema)
4. [Pantalla principal — Gestiones](#4-pantalla-principal--gestiones)
5. [Módulo de Materia Prima](#5-módulo-de-materia-prima)
6. [Módulo de Clientes](#6-módulo-de-clientes)
7. [Módulo de Órdenes de Trabajo](#7-módulo-de-órdenes-de-trabajo)
8. [Módulo de Órdenes de Compra](#8-módulo-de-órdenes-de-compra)
9. [Módulo de Reportes](#9-módulo-de-reportes)
10. [Mensajes del sistema](#10-mensajes-del-sistema)
11. [Preguntas frecuentes](#11-preguntas-frecuentes)

---

## 1. Introducción

**PintAuto** es un sistema web de gestión de inventario diseñado para empresas del sector de pintura automotriz. Permite administrar la materia prima disponible, registrar clientes, crear y dar seguimiento a órdenes de trabajo, gestionar órdenes de compra de insumos, y generar reportes en formato PDF.

El sistema está dividido en cinco módulos principales:

| Módulo | Descripción |
|---|---|
| Materia Prima | Registro, control de stock y configuración de stock mínimo |
| Clientes | Administración de la cartera de clientes |
| Órdenes de Trabajo | Creación y seguimiento de trabajos realizados |
| Órdenes de Compra | Gestión de reposición de materia prima con ciclo de aprobación y PDF |
| Reportes | Generación de informes en PDF por fechas o por material |

---

## 2. Requisitos para el uso

- Navegador web actualizado (Google Chrome, Mozilla Firefox, Microsoft Edge)
- Conexión a internet o acceso a la red local donde está desplegado el sistema
- Credenciales de acceso (correo electrónico y contraseña) proporcionadas por el administrador

---

## 3. Acceso al sistema

### 3.1 Pantalla de bienvenida

Al ingresar a la dirección del sistema se mostrará la pantalla de bienvenida de PintAuto con el logo de la empresa y una breve descripción del sistema. Para continuar, haga clic en el botón **Iniciar Sesión**.

### 3.2 Inicio de sesión

En la pantalla de login complete los siguientes campos:

| Campo | Descripción |
|---|---|
| Correo Electrónico | Dirección de correo registrada en el sistema |
| Contraseña | Contraseña asignada (mínimo 6 caracteres) |

**Opciones disponibles:**

- **Mostrar / Ocultar:** Alterna la visibilidad de la contraseña mientras escribe.
- **Iniciar sesión:** Valida las credenciales y accede al sistema.
- **Volver al Inicio:** Regresa a la pantalla de bienvenida.

**Posibles errores al iniciar sesión:**

| Mensaje | Causa |
|---|---|
| Correo electrónico no registrado | El correo ingresado no existe en el sistema |
| Contraseña incorrecta | El correo es válido pero la contraseña no coincide |
| Error en el inicio de sesión | Error de conexión u otro problema técnico |

> El mensaje de error desaparece automáticamente después de 5 segundos.

---

## 4. Pantalla principal — Gestiones

Tras iniciar sesión correctamente, el sistema muestra el menú principal con tres accesos directos:

| Opción | Descripción |
|---|---|
| Materia Prima | Accede al listado y gestión de insumos |
| Orden de Trabajo | Accede al listado y gestión de órdenes de trabajo |
| Reportes | Accede al módulo de generación de reportes PDF |

> Los módulos de **Clientes** y **Órdenes de Compra** se acceden desde el menú lateral dentro del Dashboard.

---

## 5. Módulo de Materia Prima

### 5.1 Listado de materias primas

Al ingresar al módulo se muestra una tabla con todos los insumos registrados en el sistema. Las columnas disponibles son:

| Columna | Descripción |
|---|---|
| ID | Identificador único del insumo |
| Nombre | Nombre del material |
| Cantidad | Stock disponible |
| Unidad | Unidad de medida (kg, g, l, ml, unidades) |
| Detalles | Descripción adicional del material |
| Precio Unitario | Costo por unidad en dólares |
| Fecha de Ingreso | Fecha en que se registró el insumo |
| Acciones | Botones para editar o eliminar |

### 5.2 Registrar nueva materia prima

1. Haga clic en el botón **Registrar** (ubicado en la barra del Dashboard).
2. Complete el formulario con los datos del nuevo insumo:
   - **Nombre** del material
   - **Cantidad** disponible
   - **Unidad de medida** (seleccione de la lista: kg, g, l, ml, unidades)
   - **Precio unitario**
   - **Detalles** o descripción
   - **Stock mínimo** _(opcional)_ — cantidad a partir de la cual el sistema alertará que el insumo requiere reposición
3. Confirme para guardar el registro.

### 5.3 Editar una materia prima

1. En la fila del insumo a modificar, haga clic en el ícono de edición (lápiz).
2. Se abrirá un panel con los campos editables:
   - Nombre, Cantidad, Unidad de medida, Precio Unitario, Detalles, **Stock mínimo**
3. Modifique los valores necesarios y haga clic en **Guardar**.
4. Para cancelar sin guardar cambios, haga clic en **Cancelar** o en la X del panel.

### 5.4 Eliminar una materia prima

1. En la fila del insumo, haga clic en el ícono de eliminación (papelera).
2. El sistema solicitará confirmación: _"¿Estás seguro de eliminar esta materia prima?"_
3. Confirme para eliminar permanentemente el registro.

> **Advertencia:** La eliminación es irreversible. Verifique que el insumo no esté relacionado con órdenes de trabajo activas antes de eliminarlo.

### 5.5 Stock mínimo y alertas de reposición

Cada materia prima puede tener configurado un **stock mínimo**. Cuando la cantidad en inventario cae por debajo de ese valor — por ejemplo, al consumirse en una orden de trabajo — el sistema lo identifica como material que requiere reposición.

Esta información se utiliza en el módulo de Órdenes de Compra, donde al crear una nueva orden se muestra automáticamente una alerta con todos los insumos que están por debajo de su stock mínimo.

---

## 6. Módulo de Clientes

### 6.1 Listado de clientes

Acceda desde el menú lateral del Dashboard haciendo clic en **Clientes**. Se muestra una tabla con:

| Columna | Descripción |
|---|---|
| Nombres | Nombre del cliente |
| Apellidos | Apellido del cliente |
| Cédula | Número de cédula ecuatoriana |
| Teléfono | Número de contacto |
| Email | Correo electrónico |
| Acciones | Ver detalles, Editar, Eliminar |

### 6.2 Registrar nuevo cliente

1. Haga clic en el botón **Nuevo Cliente**.
2. Complete todos los campos obligatorios:

| Campo | Requisito |
|---|---|
| Nombre | Texto, obligatorio |
| Apellido | Texto, obligatorio |
| Cédula | 10 dígitos, cédula ecuatoriana válida |
| Fecha de Nacimiento | El cliente debe ser mayor de 18 años |
| Teléfono | Máximo 10 dígitos |
| Email | Formato de correo válido |
| Dirección | Texto, obligatorio |

3. Confirme para guardar el cliente.

> El sistema valida automáticamente que la cédula sea ecuatoriana válida y que el cliente sea mayor de 18 años.

### 6.3 Ver detalles de un cliente

1. Haga clic en el ícono de ojo (ver) en la fila del cliente.
2. Se abrirá un modal con la información completa dividida en dos secciones:
   - **Información Personal:** Nombre, apellido, cédula, fecha de nacimiento
   - **Información de Contacto:** Teléfono, email, dirección
3. Haga clic en **Cerrar** para salir del modal.

### 6.4 Editar un cliente

1. Haga clic en el ícono de edición (lápiz) en la fila del cliente.
2. Modifique los campos necesarios (todos los campos son editables).
3. Haga clic en **Guardar Cambios** para confirmar.
4. Un mensaje de confirmación indicará que el cliente fue editado exitosamente.

### 6.5 Eliminar un cliente

1. Haga clic en el ícono de eliminación (papelera) en la fila del cliente.
2. Confirme la acción en el cuadro de diálogo.

---

## 7. Módulo de Órdenes de Trabajo

### 7.1 Listado de órdenes

Acceda desde el menú principal o desde el menú lateral del Dashboard en **Órdenes de Trabajo**. La tabla muestra:

| Columna | Descripción |
|---|---|
| ID | Identificador único de la orden |
| Título | Nombre descriptivo del trabajo |
| Descripción | Detalle del trabajo a realizar |
| Responsable | Usuario que creó o gestiona la orden |
| Cliente | Cliente asociado a la orden |
| Estado | Estado actual de la orden |
| Acciones | Ver detalles, Editar, Eliminar |

**Estados posibles de una orden de trabajo:**

| Estado | Significado |
|---|---|
| PENDIENTE | La orden fue creada pero no iniciada |
| EN PROCESO | El trabajo está en ejecución |
| COMPLETADA | El trabajo ha sido finalizado |

### 7.2 Crear nueva orden de trabajo

1. Haga clic en el botón **Nueva Orden**.
2. Complete el formulario con los datos requeridos:
   - **Título:** Nombre del trabajo
   - **Descripción:** Detalle de las tareas a realizar
   - **Vehículo:** Información del vehículo a tratar
   - **Cliente:** Seleccione el cliente de la lista
   - **Materias Primas:** Seleccione los insumos a utilizar con sus cantidades. Los materiales con stock bajo aparecen marcados con una advertencia
3. Confirme para registrar la orden.

> Al crear una orden, el stock de cada materia prima seleccionada se descuenta automáticamente del inventario. Si el stock resultante cae por debajo del mínimo configurado, el sistema lo marcará para reposición.

> Las materias primas y cantidades asignadas en el momento de creación **no podrán modificarse** posteriormente para mantener la integridad del inventario.

### 7.3 Ver detalles de una orden

1. Haga clic en el ícono de ojo (ver) en la fila de la orden.
2. El modal muestra dos secciones:
   - **Información Básica:** Título, descripción, estado
   - **Responsables:** Cliente, usuario responsable, fecha de creación
3. También se muestra una tabla de **Materias Primas** utilizadas con:
   - Nombre, cantidad usada, unidad, precio unitario y subtotal por material
   - **Total de Materiales** al pie de la tabla
4. Haga clic en **Cerrar** para salir.

### 7.4 Editar una orden de trabajo

1. Haga clic en el ícono de edición (lápiz) en la fila de la orden.
2. Los campos editables son:
   - **Título**, **Descripción**, **Vehículo**
3. Los siguientes campos **no son editables** una vez creada la orden:
   - Cliente (no puede cambiarse para mantener la trazabilidad)
   - Materias primas y cantidades (bloqueadas para proteger el inventario)
4. Haga clic en **Guardar Cambios** para confirmar.

### 7.5 Eliminar una orden

1. Haga clic en el ícono de eliminación (papelera) en la fila de la orden.
2. Confirme la acción en el cuadro de diálogo.

---

## 8. Módulo de Órdenes de Compra

El módulo de Órdenes de Compra permite gestionar la reposición de materia prima cuando el stock cae por debajo del mínimo configurado. Cada orden pasa por un ciclo de estados hasta ser recibida, momento en el que el stock se actualiza automáticamente.

### 8.1 Acceso al módulo

Desde el menú lateral del Dashboard, haga clic en **Órdenes de Compra** para expandir el submenú y acceda a **Listado** o **Nueva Orden**.

### 8.2 Listado de órdenes de compra

La tabla principal muestra todas las órdenes registradas con las siguientes columnas:

| Columna | Descripción |
|---|---|
| ID | Identificador único de la orden |
| Materia Prima | Insumo solicitado |
| Proveedor | Nombre del proveedor |
| Cantidad | Cantidad solicitada con su unidad de medida |
| Precio Total | Costo total calculado (cantidad × precio unitario) |
| Estado | Estado actual de la orden |
| Fecha | Fecha de creación |
| Acciones | Ver detalles, Cambiar estado, Descargar PDF, Eliminar |

**Estados posibles de una orden de compra:**

| Estado | Color | Significado |
|---|---|---|
| PENDIENTE | Gris | Orden creada, pendiente de aprobación |
| APROBADA | Amarillo | Orden aprobada, en espera de entrega |
| RECIBIDA | Verde | Mercadería recibida, stock actualizado |
| CANCELADA | Rojo | Orden anulada |

**Disponibilidad de acciones por estado:**

| Acción | PENDIENTE | APROBADA | RECIBIDA | CANCELADA |
|---|---|---|---|---|
| Ver detalles | Sí | Sí | Sí | Sí |
| Cambiar estado | Sí | Sí | No | No |
| Descargar PDF | Sí | Sí | Sí | Sí |
| Eliminar | Sí | No | No | Sí |

### 8.3 Crear nueva orden de compra

1. Haga clic en **Nueva Orden** desde el listado o desde el submenú.
2. Si existen materias primas con stock por debajo del mínimo, el sistema mostrará una **alerta amarilla** al inicio del formulario con la lista de insumos que requieren reposición. Puede hacer clic en el nombre de cualquier material para seleccionarlo automáticamente en el formulario.
3. Complete los campos obligatorios:

| Campo | Descripción |
|---|---|
| Materia Prima | Seleccione el insumo a reponer |
| Cantidad Solicitada | Cantidad a pedir (debe ser mayor a 0) |
| Proveedor | Nombre del proveedor al que se realiza el pedido |
| Observaciones | Notas adicionales _(opcional, máx. 500 caracteres)_ |

4. Al seleccionar una materia prima, el sistema muestra automáticamente su **stock actual**, **precio unitario** y **stock mínimo configurado**.
5. Al ingresar la cantidad, se calcula en tiempo real el **total estimado** de la orden.
6. El campo **Solicitante** se asigna automáticamente al usuario que ha iniciado sesión.
7. Haga clic en **Crear Orden** para guardar. La orden se crea con estado **PENDIENTE**.

### 8.4 Ver detalles de una orden de compra

1. Haga clic en el ícono de ojo (ver) en la fila de la orden.
2. El modal muestra dos secciones:
   - **Información General:** Proveedor, estado, fecha de creación, solicitante
   - **Material Solicitado:** Nombre, cantidad, precio unitario y precio total
3. Si la orden tiene observaciones, se muestran en una sección adicional.
4. Desde el modal también puede **Descargar PDF** directamente.

### 8.5 Cambiar estado de una orden

El flujo de estados es el siguiente:

```
PENDIENTE → APROBADA → RECIBIDA
    ↓              ↓
CANCELADA      CANCELADA
```

1. Haga clic en el ícono de cambio de estado (flechas circulares ⟳) en la fila de la orden.
2. Seleccione el nuevo estado en la lista desplegable.
3. Si selecciona **RECIBIDA**, el sistema mostrará un aviso informando que el stock de la materia prima se incrementará automáticamente con la cantidad solicitada.
4. Haga clic en **Confirmar** para aplicar el cambio.

> Al pasar a estado **RECIBIDA**, el inventario de la materia prima correspondiente se actualiza automáticamente sumando la cantidad solicitada al stock actual.

> Una vez que una orden está en estado **RECIBIDA** o **CANCELADA**, su estado ya no puede modificarse.

### 8.6 Descargar PDF de la orden

El sistema permite generar un documento PDF formal para cada orden de compra.

1. Haga clic en el ícono de descarga (⬇) en la fila de la orden, o desde el modal de detalles.
2. El archivo se descarga automáticamente con el nombre `orden-compra-{ID}.pdf`.

**El PDF incluye:**
- Encabezado con el número de orden
- Empresa emisora (PintAuto), fecha de emisión y estado
- Datos del proveedor
- Datos del solicitante (nombre y email)
- Tabla con el material, unidad, cantidad, precio unitario y total
- Monto total de la orden
- Observaciones (si las hay)
- Fecha de generación del documento

### 8.7 Eliminar una orden de compra

Solo pueden eliminarse órdenes en estado **PENDIENTE** o **CANCELADA**.

1. Haga clic en el ícono de eliminación (papelera) en la fila de la orden.
2. Confirme la acción en el cuadro de diálogo.

> No es posible eliminar órdenes **APROBADAS** ni **RECIBIDAS**. Para anular una orden aprobada, primero cámbiela a estado **CANCELADA** y luego elimínela.

---

## 9. Módulo de Reportes

El módulo de Reportes permite generar documentos PDF con información consolidada del sistema. Existen dos tipos de reporte.

### 9.1 Reporte por Fechas

Genera un informe de todas las órdenes de trabajo creadas dentro de un rango de fechas, mostrando los materiales utilizados y el costo total de cada orden.

**Pasos para generar el reporte:**

1. Seleccione la pestaña **Por Fechas**.
2. Ingrese la **Fecha de inicio** y la **Fecha de fin** del período a consultar.
3. Haga clic en **Vista Previa** para revisar los datos antes de descargar, o en **Descargar PDF** para obtener el archivo directamente.

**Restricciones de las fechas:**
- La fecha de inicio no puede ser mayor a la fecha fin.
- La fecha de inicio no puede ser una fecha futura.
- El rango máximo permitido es de 1 año.

**Contenido del reporte:**
- Número total de órdenes en el período
- Por cada orden: cliente, usuario responsable, fecha, materiales utilizados con sus cantidades y precios, y subtotal por orden
- Total general de materiales del período

### 9.2 Reporte por Materia Prima

Genera un informe del uso de un insumo específico en todas las órdenes de trabajo, mostrando en qué trabajos se utilizó, las cantidades y el valor total generado.

**Pasos para generar el reporte:**

1. Seleccione la pestaña **Por Materia**.
2. Seleccione el insumo de la lista desplegable _(la lista se carga automáticamente desde el inventario)_.
3. Haga clic en **Vista Previa** para revisar los datos, o en **Descargar PDF** para obtener el archivo.

**Contenido del reporte:**
- Total de órdenes en las que se usó el insumo
- Cantidad total consumida
- Por cada uso: cliente, usuario, fecha, cantidad, precio unitario y subtotal
- Valor total generado por el insumo

### 9.3 Vista Previa

La vista previa permite revisar los datos del reporte antes de descargar el PDF:

1. Genere la vista previa con el botón **Vista Previa**.
2. Revise la información en el modal.
3. Si los datos son correctos, haga clic en **Descargar PDF** dentro del mismo modal.
4. Para cerrar sin descargar, haga clic en **Cerrar**.

> El botón **Volver** en la parte inferior regresa al menú de Gestiones.

---

## 10. Mensajes del sistema

El sistema muestra notificaciones en la esquina superior derecha de la pantalla para informar el resultado de las operaciones:

| Tipo | Color | Significado |
|---|---|---|
| Éxito | Verde | La operación se completó correctamente |
| Error | Rojo | Ocurrió un problema durante la operación |

Las notificaciones desaparecen automáticamente luego de 4 segundos, o puede cerrarlas manualmente haciendo clic en la X.

**Errores comunes en Reportes:**

| Mensaje | Causa |
|---|---|
| Por favor, selecciona ambas fechas | No se completaron los campos de fecha |
| La fecha de inicio no puede ser mayor a la fecha fin | Rango de fechas invertido |
| La fecha de inicio no puede ser futura | Se ingresó una fecha que aún no ocurrió |
| El rango de fechas no puede ser mayor a 1 año | El período seleccionado excede el límite |
| No se encontraron datos para el período seleccionado | No existen órdenes en ese rango |
| No se pudo conectar con el servidor | Problema de conexión o servidor no disponible |

**Errores comunes en Órdenes de Compra:**

| Mensaje | Causa |
|---|---|
| No se puede cambiar el estado de una orden ya recibida | La orden está en estado final |
| No se puede cambiar el estado de una orden cancelada | La orden está en estado final |
| No se puede eliminar una orden de compra aprobada | Debe cancelarse antes de eliminar |
| No se puede eliminar una orden de compra ya recibida | Las órdenes recibidas no pueden eliminarse |
| Error al generar el PDF | Problema de conexión o error en el servidor |

---

## 11. Preguntas frecuentes

**¿Qué es el stock mínimo de una materia prima?**  
Es el umbral de cantidad a partir del cual el sistema considera que el insumo necesita reposición. Se configura al registrar o editar cada materia prima. Cuando el stock disponible cae a ese valor o por debajo, el sistema lo muestra como alerta en el módulo de Órdenes de Compra.

**¿Qué pasa con el inventario cuando marco una orden de compra como RECIBIDA?**  
El stock de la materia prima correspondiente se incrementa automáticamente con la cantidad solicitada en la orden. No es necesario actualizar el inventario manualmente.

**¿Puedo modificar la materia prima o la cantidad de una orden de compra después de crearla?**  
No. Una vez creada la orden, estos datos no pueden cambiarse. Si se cometió un error, cancele la orden y cree una nueva.

**¿Cuándo puedo eliminar una orden de compra?**  
Solo cuando está en estado **PENDIENTE** o **CANCELADA**. Las órdenes **APROBADAS** deben cancelarse primero. Las **RECIBIDAS** nunca pueden eliminarse.

**¿Puedo cambiar las materias primas de una orden de trabajo ya creada?**  
No. Las materias primas y sus cantidades quedan bloqueadas al crear la orden para proteger la integridad del inventario y los costos calculados.

**¿Puedo cambiar el cliente de una orden de trabajo existente?**  
No. El cliente no puede modificarse una vez creada la orden para mantener la trazabilidad del trabajo.

**¿Qué pasa si ingreso una cédula inválida al registrar un cliente?**  
El sistema validará automáticamente que la cédula sea un número ecuatoriano válido (10 dígitos con algoritmo de verificación). Si es incorrecta, no permitirá guardar el registro.

**¿Puedo registrar clientes menores de 18 años?**  
No. El sistema requiere que el cliente sea mayor de edad. Si la fecha de nacimiento indica que el cliente es menor de 18 años, el registro será rechazado.

**¿En qué formato se descargan los reportes y las órdenes de compra?**  
Todos los documentos se descargan en formato PDF. Los reportes incluyen el rango de fechas o la materia prima en el nombre del archivo. Las órdenes de compra se descargan con el nombre `orden-compra-{ID}.pdf`.

**¿Qué hago si el sistema muestra "No se pudo conectar con el servidor"?**  
Verifique su conexión a internet o a la red local. Si el problema persiste, contacte al administrador del sistema.

---

*© 2026 PintAuto — Todos los derechos reservados*

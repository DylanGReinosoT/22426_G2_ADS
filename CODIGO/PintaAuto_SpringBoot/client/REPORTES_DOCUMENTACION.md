# 📊 Documentación de Integración - Sistema de Reportes

## 🎯 Resumen de la Implementación

He implementado un sistema completo de reportes en el frontend que se conecta con tu backend. La solución incluye:

### ✨ **Funcionalidades Implementadas:**

1. **Vista Previa de Reportes** - Los usuarios pueden ver los datos antes de generar el PDF
2. **Descarga de PDFs** - Generación y descarga automática de reportes
3. **Validación de Formularios** - Validación de fechas y campos requeridos
4. **Notificaciones** - Sistema de alertas para éxito/error
5. **Loading States** - Indicadores de carga durante las operaciones
6. **Responsive Design** - Adaptable a diferentes dispositivos

---

## 🔧 **Archivos Creados/Modificados:**

### 1. **`src/services/reporteService.js`**
- Servicio para comunicarse con el backend
- Maneja las llamadas a la API para ambos tipos de reportes
- Soporte para descarga de PDFs como blob

### 2. **`src/pages/ReportesPDF.jsx`** (Actualizado)
- Interfaz completa de reportes
- Vista previa de datos
- Sistema de notificaciones
- Estados de carga

### 3. **`src/types/reportes.js`**
- Documentación de las estructuras de datos
- Ejemplos de respuestas esperadas del backend

---

## 🔗 **Endpoints del Backend Esperados:**

### **Reportes por Fechas:**
```
GET /api/reportes/fechas?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD
- Respuesta: PDF blob

GET /api/reportes/fechas/datos?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD
- Respuesta: JSON con estructura ReporteFechas
```

### **Reportes por Materias:**
```
GET /api/reportes/materias?materiaPrima=codigo_opcional
- Respuesta: PDF blob

GET /api/reportes/materias/datos?materiaPrima=codigo_opcional
- Respuesta: JSON con estructura ReporteMaterias
```

---

## 📋 **Estructura de Datos Esperada:**

### **ReporteFechas (JSON):**
```javascript
{
  "fechaInicio": "2024-01-01",
  "fechaFin": "2024-01-31", 
  "totalOrdenes": 5,
  "totalGeneral": 1250.00,
  "reportesPorCliente": [
    {
      "cliente": {
        "id": 1,
        "nombre": "Juan",
        "apellido": "Pérez", 
        "cedula": "1234567890",
        "email": "juan@email.com"
      },
      "totalMateriales": 500.00,
      "materiales": [
        {
          "id": 1,
          "nombre": "Pintura Roja",
          "codigo": "PR001",
          "cantidad": 2,
          "unidadMedida": "litros",
          "precioUnitario": 150.00,
          "subtotal": 300.00
        }
      ]
    }
  ]
}
```

### **ReporteMaterias (JSON):**
```javascript
{
  "materiaPrimaFiltro": "pintura_roja", // o null para todos
  "totalOrdenes": 8,
  "totalMaterialesUtilizados": "15 litros, 5 kg",
  "reportesPorMateria": [
    {
      "materiaPrima": {
        "id": 1,
        "nombre": "Pintura Roja",
        "codigo": "PR001", 
        "unidadMedida": "litros"
      },
      "cantidadTotal": 10,
      "ordenes": [
        {
          "id": 1,
          "numeroOrden": "ORD-001",
          "fecha": "2024-01-15",
          "cliente": {
            "id": 1,
            "nombre": "Juan",
            "apellido": "Pérez",
            "cedula": "1234567890"
          },
          "cantidadUtilizada": 2
        }
      ]
    }
  ]
}
```

---

## ⚙️ **Configuración del Backend Requerida:**

### **Headers CORS:**
Asegúrate de que tu backend permita las siguientes operaciones:
```java
@CrossOrigin(origins = "http://localhost:5173") // Puerto del frontend
```

### **Content-Type para PDFs:**
```java
@GetMapping(value = "/reportes/fechas", produces = MediaType.APPLICATION_PDF_VALUE)
public ResponseEntity<byte[]> generarReporteFechas(
    @RequestParam String fechaInicio,
    @RequestParam String fechaFin
) {
    // Tu lógica aquí
    byte[] pdfBytes = reporteService.generarPDFFechas(fechaInicio, fechaFin);
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.setContentDisposition(
        ContentDisposition.attachment()
            .filename("reporte_fechas.pdf")
            .build()
    );
    
    return ResponseEntity.ok()
        .headers(headers)
        .body(pdfBytes);
}
```

---

## 🚀 **Cómo Usar:**

### **Para el Usuario:**
1. Seleccionar tipo de reporte (Por Fechas o Por Materias)
2. Completar los filtros correspondientes
3. Hacer clic en "Vista Previa" para ver los datos
4. Hacer clic en "Generar PDF" para descargar

### **Para el Desarrollador:**
1. Implementar los endpoints en el backend según las especificaciones
2. Ajustar las URLs en `reporteService.js` si es necesario
3. Modificar las estructuras de datos si tu backend usa diferentes nombres

---

## 🔧 **Personalización:**

### **Cambiar URLs del Backend:**
Edita `src/services/reporteService.js`:
```javascript
// Cambiar estas rutas según tu backend
const response = await api.get('/reportes/fechas', {
    // ...
})
```

### **Agregar Más Materias Primas:**
Edita `src/pages/ReportesPDF.jsx` en la sección del select:
```javascript
<option value="nueva_materia">Nueva Materia Prima</option>
```

### **Personalizar Estilos:**
Los componentes usan Tailwind CSS y están completamente personalizables.

---

## ✅ **Testing:**

Para probar sin backend, puedes usar los datos de ejemplo:
```javascript
import { ejemploReporteFechas, ejemploReporteMaterias } from '../types/reportes'

// En desarrollo, usar datos de prueba
const datos = filtro === 'fechas' ? ejemploReporteFechas : ejemploReporteMaterias;
setPreviewData(datos);
```

---

## 🛠️ **Próximos Pasos:**

1. **Implementar los endpoints** en tu backend Spring Boot
2. **Testear la integración** con datos reales
3. **Ajustar las estructuras** si es necesario
4. **Agregar manejo de errores** específicos del backend
5. **Optimizar la generación de PDFs** para mejor rendimiento

---

## 📞 **Soporte:**

Si necesitas ajustar algo o tienes preguntas sobre la implementación, puedo ayudarte a:
- Modificar las estructuras de datos
- Ajustar los endpoints
- Agregar más validaciones
- Mejorar la interfaz de usuario
- Optimizar el rendimiento

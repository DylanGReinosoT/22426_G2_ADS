# Guía de Pruebas - Jest y Vitest

## Instalación

Las dependencias para Jest y Vitest ya han sido instaladas. Para verificar:

```bash
npm list jest vitest
```

## Estructura de Pruebas

Los archivos de prueba están ubicados junto a los componentes/servicios con las siguientes extensiones:
- `.test.js` - Archivos de prueba estándar
- `.test.jsx` - Archivos de prueba para componentes React

### Archivos de prueba creados:

1. **Login.test.jsx** - Pruebas para el componente Login
2. **api.test.js** - Pruebas para el servicio API
3. **ClienteService.test.js** - Pruebas para el servicio de Clientes
4. **helpers.test.js** - Pruebas para funciones utilitarias

## Ejecutar Pruebas

### Usando Vitest (Recomendado para desarrollo con Vite)

```bash
# Ejecutar todas las pruebas una vez
npm run test

# Modo watch - ejecutar pruebas en tiempo real
npm run test:watch

# Interfaz gráfica de Vitest
npm run test:ui

# Cobertura de código
npm run test:coverage
```

### Usando Jest

```bash
# Ejecutar todas las pruebas una vez
npm run test:jest

# Modo watch
npm run test:jest:watch

# Cobertura de código
npm run test:jest:coverage
```

## Archivos de Configuración

### `vitest.config.js`
- Configuración para Vitest
- Ambiente: jsdom
- Reportes de cobertura en HTML

### `jest.config.js`
- Configuración para Jest
- Ambiente: jsdom
- Mapeo de módulos CSS
- Transformación de código con Babel

### `.babelrc`
- Configuración de Babel para transformar código JSX y ES6+
- Presets: @babel/preset-env, @babel/preset-react

### `src/setupTests.js`
- Archivo de configuración que se ejecuta antes de las pruebas
- Importa @testing-library/jest-dom para matchers personalizados

## Mejores Prácticas

1. **Organización**: Mantén los archivos de prueba cerca de los componentes
2. **Nombres descriptivos**: Usa nombres de prueba que describan el comportamiento
3. **Pruebas unitarias**: Prueba una funcionalidad por prueba
4. **Mocks**: Usa `vi.fn()` (Vitest) para mockear funciones
5. **Cobertura**: Apunta a al menos 80% de cobertura de código

## Ejemplos de Pruebas

### Prueba Simple
```javascript
import { describe, it, expect } from 'vitest';

describe('Math', () => {
  it('should add numbers', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Prueba con Componentes React
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render text', () => {
    render(<MyComponent />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});
```

### Prueba con Mocks
```javascript
import { describe, it, expect, vi } from 'vitest';

describe('API', () => {
  it('should call API', async () => {
    const mockFn = vi.fn().mockResolvedValue({ data: 'test' });
    const result = await mockFn();
    expect(mockFn).toHaveBeenCalled();
  });
});
```

## Troubleshooting

### Error: "Cannot find module"
- Verifica que los imports en los tests coincidan con la ruta del archivo
- Revisa que @testing-library/jest-dom esté instalado

### Error: "Module not found: jsx"
- Asegúrate de que Babel está correctamente configurado
- Verifica el archivo `.babelrc`

### Tests no se ejecutan
- Verifica que los archivos terminen en `.test.js` o `.test.jsx`
- Comprueba que están en las rutas correctas según la configuración

## Documentación Oficial

- [Vitest Docs](https://vitest.dev/)
- [Jest Docs](https://jestjs.io/)
- [Testing Library Docs](https://testing-library.com/)

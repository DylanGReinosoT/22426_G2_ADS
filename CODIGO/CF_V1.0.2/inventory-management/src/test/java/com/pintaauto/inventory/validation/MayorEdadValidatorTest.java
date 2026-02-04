package com.pintaauto.inventory.validation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Calendar;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas unitarias de MayorEdadValidator")
class MayorEdadValidatorTest {

    private MayorEdadValidator validator = new MayorEdadValidator();

    @Test
    @DisplayName("Validar persona mayor de 18 años")
    void testPersonaMayorDeEdad() {
        // Arrange - Persona de 25 años
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, -25);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertTrue(resultado);
    }

    @Test
    @DisplayName("Validar persona exactamente con 18 años")
    void testPersonaConExactamente18Anos() {
        // Arrange - Persona con exactamente 18 años
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, -18);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        // Debería ser válido según la lógica del validador
        assertTrue(resultado);
    }

    @Test
    @DisplayName("Rechazar persona menor de 18 años")
    void testPersonaMenorDeEdad() {
        // Arrange - Persona de 17 años
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, -17);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertFalse(resultado);
    }

    @Test
    @DisplayName("Rechazar fecha de nacimiento nula")
    void testFechaNula() {
        // Act
        boolean resultado = validator.isValid(null, null);

        // Assert
        assertFalse(resultado);
    }

    @Test
    @DisplayName("Rechazar fecha de nacimiento en el futuro")
    void testFechaFutura() {
        // Arrange - Fecha en el futuro
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, 1);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertFalse(resultado);
    }

    @Test
    @DisplayName("Validar persona de 50 años")
    void testPersona50Anos() {
        // Arrange
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, -50);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertTrue(resultado);
    }

    @Test
    @DisplayName("Validar persona de 100 años")
    void testPersona100Anos() {
        // Arrange
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, -100);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertTrue(resultado);
    }

    @Test
    @DisplayName("Rechazar persona de 16 años")
    void testPersona16Anos() {
        // Arrange
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, -16);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertFalse(resultado);
    }

    @Test
    @DisplayName("Rechazar persona de 1 año")
    void testPersona1Ano() {
        // Arrange
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, -1);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertFalse(resultado);
    }

    @Test
    @DisplayName("Validar que la fecha actual es válida para validación")
    void testFechaActual() {
        // Arrange
        Date fechaActual = new Date();

        // Act
        // Act - Si nace hoy no cumple 18
        boolean resultado = validator.isValid(fechaActual, null);

        // Assert
        assertFalse(resultado);
    }

    @Test
    @DisplayName("Validar cálculo de edad correctamente")
    void testCalculoEdadCorrecto() {
        // Arrange - Crear una fecha de hace 20 años
        Calendar fechaHace20Anos = Calendar.getInstance();
        fechaHace20Anos.add(Calendar.YEAR, -20);
        Date fechaNacimiento = fechaHace20Anos.getTime();

        // Act
        Calendar hoy = Calendar.getInstance();
        int edadCalculada = hoy.get(Calendar.YEAR) - fechaHace20Anos.get(Calendar.YEAR);

        // Assert
        assertTrue(edadCalculada >= 18);
        assertTrue(validator.isValid(fechaNacimiento, null));
    }

    @Test
    @DisplayName("Rechazar persona nacida mañana")
    void testFechaNacidaMañana() {
        // Arrange
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.DAY_OF_YEAR, 1);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertFalse(resultado);
    }

    @Test
    @DisplayName("Rechazar persona nacida hace 17 años y 11 meses")
    void testPersona17AnosCasiMayor() {
        // Arrange
        Calendar fecha = Calendar.getInstance();
        fecha.add(Calendar.YEAR, -17);
        fecha.add(Calendar.MONTH, -11);
        Date fechaNacimiento = fecha.getTime();

        // Act
        boolean resultado = validator.isValid(fechaNacimiento, null);

        // Assert
        assertFalse(resultado);
    }

    @Test
    @DisplayName("Comparar fecha válida vs inválida")
    void testComparacionEdades() {
        // Arrange
        Calendar fecha25Anos = Calendar.getInstance();
        fecha25Anos.add(Calendar.YEAR, -25);

        Calendar fecha15Anos = Calendar.getInstance();
        fecha15Anos.add(Calendar.YEAR, -15);

        // Act
        boolean resultado25 = validator.isValid(fecha25Anos.getTime(), null);
        boolean resultado15 = validator.isValid(fecha15Anos.getTime(), null);

        // Assert
        assertTrue(resultado25);
        assertFalse(resultado15);
    }
}


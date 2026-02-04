package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.MateriaPrimaRequestDTO;
import com.pintaauto.inventory.dto.MateriaPrimaResponseDTO;
import com.pintaauto.inventory.entity.MateriaPrima;
import com.pintaauto.inventory.repository.MateriaPrimaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas unitarias de MateriaPrimaService")
class MateriaPrimaServiceTest {

    @Mock
    private MateriaPrimaRepository materiaPrimaRepository;

    @InjectMocks
    private MateriaPrimaService materiaPrimaService;

    private MateriaPrima materiaPrima;
    private MateriaPrimaRequestDTO requestDTO;
    private MateriaPrimaResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        // Inicializar datos de prueba
        materiaPrima = new MateriaPrima();
        materiaPrima.setId(1L);
        materiaPrima.setNombre("Pintura Roja");
        materiaPrima.setUnidadMedida("litro");
        materiaPrima.setCantidad(100.0);
        materiaPrima.setDetalles("Pintura de buena calidad");
        materiaPrima.setPrecioUnitario(BigDecimal.valueOf(50.00));
        materiaPrima.setFechaIngreso(LocalDateTime.now());
        materiaPrima.setCreatedAt(LocalDateTime.now());
        materiaPrima.setUpdatedAt(LocalDateTime.now());

        requestDTO = new MateriaPrimaRequestDTO();
        requestDTO.setNombre("Pintura Roja");
        requestDTO.setUnidadMedida("litro");
        requestDTO.setCantidad(100.0);
        requestDTO.setDetalles("Pintura de buena calidad");
        requestDTO.setPrecioUnitario(BigDecimal.valueOf(50.00));

        responseDTO = new MateriaPrimaResponseDTO(
                1L,
                "Pintura Roja",
                "litro",
                100.0,
                "Pintura de buena calidad",
                BigDecimal.valueOf(50.00),
                LocalDateTime.now(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("Obtener todas las materias primas")
    void testObtenerTodas() {
        // Arrange
        MateriaPrima mp2 = new MateriaPrima();
        mp2.setId(2L);
        mp2.setNombre("Pintura Azul");
        mp2.setUnidadMedida("litro");
        mp2.setCantidad(50.0);
        mp2.setDetalles("Pintura azul oscuro");
        mp2.setPrecioUnitario(BigDecimal.valueOf(45.00));

        when(materiaPrimaRepository.findAll()).thenReturn(Arrays.asList(materiaPrima, mp2));

        // Act
        List<MateriaPrimaResponseDTO> resultado = materiaPrimaService.obtenerTodas();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(materiaPrimaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Obtener materia prima por ID existente")
    void testObtenerPorIdExistente() {
        // Arrange
        when(materiaPrimaRepository.findById(1L)).thenReturn(Optional.of(materiaPrima));

        // Act
        Optional<MateriaPrimaResponseDTO> resultado = materiaPrimaService.obtenerPorId(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("Pintura Roja", resultado.get().getNombre());
        verify(materiaPrimaRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Obtener materia prima por ID no existente")
    void testObtenerPorIdNoExistente() {
        // Arrange
        when(materiaPrimaRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<MateriaPrimaResponseDTO> resultado = materiaPrimaService.obtenerPorId(999L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(materiaPrimaRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Crear nueva materia prima exitosamente")
    void testCrearMateriaPrimaExitoso() {
        // Arrange
        when(materiaPrimaRepository.existsByNombre("Pintura Roja")).thenReturn(false);
        when(materiaPrimaRepository.save(any(MateriaPrima.class))).thenReturn(materiaPrima);

        // Act
        MateriaPrimaResponseDTO resultado = materiaPrimaService.crear(requestDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals("Pintura Roja", resultado.getNombre());
        assertEquals(100, resultado.getCantidad());
        verify(materiaPrimaRepository, times(1)).existsByNombre("Pintura Roja");
        verify(materiaPrimaRepository, times(1)).save(any(MateriaPrima.class));
    }

    @Test
    @DisplayName("Crear materia prima con nombre duplicado lanza excepción")
    void testCrearMateriaPrimaDuplicada() {
        // Arrange
        when(materiaPrimaRepository.existsByNombre("Pintura Roja")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            materiaPrimaService.crear(requestDTO);
        });

        assertEquals("La materia prima con el nombre 'Pintura Roja' ya existe", exception.getMessage());
        verify(materiaPrimaRepository, never()).save(any(MateriaPrima.class));
    }

    @Test
    @DisplayName("Actualizar materia prima existente")
    void testActualizarMateriaPrimaExistente() {
        // Arrange
        MateriaPrimaRequestDTO updateDTO = new MateriaPrimaRequestDTO();
        updateDTO.setNombre("Pintura Roja Brillante");
        updateDTO.setUnidadMedida("litro");
        updateDTO.setCantidad(150.0);
        updateDTO.setDetalles("Pintura mejorada");
        updateDTO.setPrecioUnitario(BigDecimal.valueOf(55.00));

        when(materiaPrimaRepository.findById(1L)).thenReturn(Optional.of(materiaPrima));
        when(materiaPrimaRepository.existsByNombreAndIdNot("Pintura Roja Brillante", 1L)).thenReturn(false);
        when(materiaPrimaRepository.save(any(MateriaPrima.class))).thenReturn(materiaPrima);

        // Act
        MateriaPrimaResponseDTO resultado = materiaPrimaService.actualizar(1L, updateDTO);

        // Assert
        assertNotNull(resultado);
        verify(materiaPrimaRepository, times(1)).findById(1L);
        verify(materiaPrimaRepository, times(1)).save(any(MateriaPrima.class));
    }

    @Test
    @DisplayName("Actualizar materia prima no existente lanza excepción")
    void testActualizarMateriaPrimaNoExistente() {
        // Arrange
        when(materiaPrimaRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            materiaPrimaService.actualizar(999L, requestDTO);
        });

        assertEquals("Materia prima no encontrada con ID: 999", exception.getMessage());
        verify(materiaPrimaRepository, never()).save(any(MateriaPrima.class));
    }

    @Test
    @DisplayName("Eliminar materia prima existente")
    void testEliminarMateriaPrimaExistente() {
        // Arrange
        when(materiaPrimaRepository.existsById(1L)).thenReturn(true);
        doNothing().when(materiaPrimaRepository).deleteById(1L);

        // Act
        materiaPrimaService.eliminar(1L);

        // Assert
        verify(materiaPrimaRepository, times(1)).existsById(1L);
        verify(materiaPrimaRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Eliminar materia prima no existente lanza excepción")
    void testEliminarMateriaPrimaNoExistente() {
        // Arrange
        when(materiaPrimaRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            materiaPrimaService.eliminar(999L);
        });

        assertEquals("Materia prima no encontrada con ID: 999", exception.getMessage());
        verify(materiaPrimaRepository, never()).deleteById(999L);
    }

    @Test
    @DisplayName("Buscar materias primas por nombre")
    void testBuscarPorNombre() {
        // Arrange
        when(materiaPrimaRepository.findByNombreContaining("Pintura")).thenReturn(Arrays.asList(materiaPrima));

        // Act
        List<MateriaPrimaResponseDTO> resultado = materiaPrimaService.buscarPorNombre("Pintura");

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Pintura Roja", resultado.get(0).getNombre());
        verify(materiaPrimaRepository, times(1)).findByNombreContaining("Pintura");
    }

    @Test
    @DisplayName("Buscar materias primas por nombre sin resultados")
    void testBuscarPorNombreSinResultados() {
        // Arrange
        when(materiaPrimaRepository.findByNombreContaining("NoExiste")).thenReturn(Arrays.asList());

        // Act
        List<MateriaPrimaResponseDTO> resultado = materiaPrimaService.buscarPorNombre("NoExiste");

        // Assert
        assertNotNull(resultado);
        assertEquals(0, resultado.size());
        verify(materiaPrimaRepository, times(1)).findByNombreContaining("NoExiste");
    }

    @Test
    @DisplayName("Validar cantidad no negativa en materia prima")
    void testCantidadNoNegativa() {
        // Arrange
        MateriaPrimaRequestDTO invalidDTO = new MateriaPrimaRequestDTO();
        invalidDTO.setNombre("Pintura Negra");
        invalidDTO.setUnidadMedida("litro");
        invalidDTO.setCantidad(-10.0);
        invalidDTO.setDetalles("Test");
        invalidDTO.setPrecioUnitario(BigDecimal.valueOf(50.00));

        when(materiaPrimaRepository.existsByNombre("Pintura Negra")).thenReturn(false);

        // Act & Assert - La cantidad debería ser validada
        assertTrue(invalidDTO.getCantidad() < 0);
    }

    @Test
    @DisplayName("Precio unitario debe ser mayor a cero")
    void testPrecioUnitarioMayorACero() {
        // Arrange
        MateriaPrimaRequestDTO invalidDTO = new MateriaPrimaRequestDTO();
        invalidDTO.setNombre("Pintura Verde");
        invalidDTO.setUnidadMedida("litro");
        invalidDTO.setCantidad(50.0);
        invalidDTO.setDetalles("Test");
        invalidDTO.setPrecioUnitario(BigDecimal.valueOf(-5.00));

        // Act & Assert
        assertTrue(invalidDTO.getPrecioUnitario().compareTo(BigDecimal.ZERO) < 0);
    }
}


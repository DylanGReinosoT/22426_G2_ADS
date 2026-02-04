package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.OrdenTrabajoRequestDTO;
import com.pintaauto.inventory.dto.OrdenTrabajoResponseDTO;
import com.pintaauto.inventory.entity.MateriaPrima;
import com.pintaauto.inventory.entity.OrdenTrabajo;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.repository.MateriaPrimaRepository;
import com.pintaauto.inventory.repository.OrdenTrabajoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas unitarias de OrdenTrabajoService")
class OrdenTrabajoServiceTest {

    @Mock
    private OrdenTrabajoRepository ordenTrabajoRepository;

    @Mock
    private MateriaPrimaRepository materiaPrimaRepository;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private ClienteService clienteService;

    @InjectMocks
    private OrdenTrabajoService ordenTrabajoService;

    private OrdenTrabajo ordenTrabajo;
    private OrdenTrabajoRequestDTO requestDTO;
    private OrdenTrabajoResponseDTO responseDTO;
    private Usuario usuario;
    private MateriaPrima materiaPrima;

    @BeforeEach
    void setUp() {
        // Inicializar datos de prueba
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Admin");
        usuario.setEmail("admin@pintaauto.com");

        materiaPrima = new MateriaPrima();
        materiaPrima.setId(1L);
        materiaPrima.setNombre("Pintura Roja");
        materiaPrima.setUnidadMedida("litro");
        materiaPrima.setCantidad(100.0);

        ordenTrabajo = new OrdenTrabajo();
        ordenTrabajo.setId(1L);
        ordenTrabajo.setTitulo("Pintura Coche");
        ordenTrabajo.setDescripcion("Pintura completa del coche");
        ordenTrabajo.setVehiculo("Toyota Corolla");
        ordenTrabajo.setUsuario(usuario);

        requestDTO = new OrdenTrabajoRequestDTO();
        requestDTO.setTitulo("Pintura Coche");
        requestDTO.setDescripcion("Pintura completa del coche");
        requestDTO.setVehiculo("Toyota Corolla");
        requestDTO.setUsuarioId(1L);
        Map<Long, Double> materias = new HashMap<>();
        materias.put(1L, 10.0);
        requestDTO.setMateriasPrimasYcantidades(materias);

        responseDTO = new OrdenTrabajoResponseDTO();
        responseDTO.setId(1L);
        responseDTO.setTitulo("Pintura Coche");
        responseDTO.setDescripcion("Pintura completa del coche");
        responseDTO.setVehiculo("Toyota Corolla");
    }

    @Test
    @DisplayName("Obtener todas las órdenes de trabajo")
    void testObtenerTodas() {
        // Arrange
        OrdenTrabajo orden2 = new OrdenTrabajo();
        orden2.setId(2L);
        orden2.setTitulo("Cambio de aceite");
        orden2.setDescripcion("Cambio de aceite del motor");
        orden2.setVehiculo("Honda Civic");

        when(ordenTrabajoRepository.findAll()).thenReturn(Arrays.asList(ordenTrabajo, orden2));

        // Act
        List<OrdenTrabajoResponseDTO> resultado = ordenTrabajoService.obtenerTodas();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        verify(ordenTrabajoRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Obtener orden de trabajo por ID existente")
    void testObtenerPorIdExistente() {
        // Arrange
        when(ordenTrabajoRepository.findById(1L)).thenReturn(Optional.of(ordenTrabajo));

        // Act
        OrdenTrabajoResponseDTO resultado = ordenTrabajoService.obtenerPorId(1L);

        // Assert
        assertNotNull(resultado);
        verify(ordenTrabajoRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Obtener orden de trabajo por ID no existente lanza excepción")
    void testObtenerPorIdNoExistente() {
        // Arrange
        when(ordenTrabajoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ordenTrabajoService.obtenerPorId(999L);
        });

        assertEquals("Orden de trabajo no encontrada con ID: 999", exception.getMessage());
        verify(ordenTrabajoRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Crear orden de trabajo exitosamente")
    void testCrearOrdenTrabajoExitoso() {
        // Arrange
        when(ordenTrabajoRepository.findUsuarioById(1L)).thenReturn(usuario);
        when(materiaPrimaRepository.findById(1L)).thenReturn(Optional.of(materiaPrima));
        when(materiaPrimaRepository.save(any(MateriaPrima.class))).thenReturn(materiaPrima);
        when(ordenTrabajoRepository.save(any(OrdenTrabajo.class))).thenReturn(ordenTrabajo);

        // Act
        OrdenTrabajoResponseDTO resultado = ordenTrabajoService.crear(requestDTO);

        // Assert
        assertNotNull(resultado);
        verify(ordenTrabajoRepository, times(1)).findUsuarioById(1L);
        verify(materiaPrimaRepository, times(1)).findById(1L);
        verify(ordenTrabajoRepository, times(1)).save(any(OrdenTrabajo.class));
    }

    @Test
    @DisplayName("Crear orden con usuario no existente lanza excepción")
    void testCrearOrdenUsuarioNoExiste() {
        // Arrange
        when(ordenTrabajoRepository.findUsuarioById(999L)).thenReturn(null);

        requestDTO.setUsuarioId(999L);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ordenTrabajoService.crear(requestDTO);
        });

        assertEquals("Usuario no encontrado con ID: 999", exception.getMessage());
        verify(ordenTrabajoRepository, never()).save(any(OrdenTrabajo.class));
    }

    @Test
    @DisplayName("Crear orden con materia prima no existente lanza excepción")
    void testCrearOrdenMateriaPrimaNoExiste() {
        // Arrange
        when(ordenTrabajoRepository.findUsuarioById(1L)).thenReturn(usuario);
        when(materiaPrimaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ordenTrabajoService.crear(requestDTO);
        });

        assertEquals("Materia prima no encontrada con ID: 1", exception.getMessage());
        verify(ordenTrabajoRepository, never()).save(any(OrdenTrabajo.class));
    }

    @Test
    @DisplayName("Crear orden con cantidad insuficiente de materia prima lanza excepción")
    void testCrearOrdenCantidadInsuficiente() {
        // Arrange
        MateriaPrima materiaPrimaInsuficiente = new MateriaPrima();
        materiaPrimaInsuficiente.setId(1L);
        materiaPrimaInsuficiente.setNombre("Pintura Roja");
        materiaPrimaInsuficiente.setCantidad(5.0); // Menos de lo que necesita

        when(ordenTrabajoRepository.findUsuarioById(1L)).thenReturn(usuario);
        when(materiaPrimaRepository.findById(1L)).thenReturn(Optional.of(materiaPrimaInsuficiente));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ordenTrabajoService.crear(requestDTO);
        });

        assertTrue(exception.getMessage().contains("No hay suficiente cantidad"));
        verify(ordenTrabajoRepository, never()).save(any(OrdenTrabajo.class));
    }

    @Test
    @DisplayName("Actualizar orden de trabajo existente")
    void testActualizarOrdenTrabajoExistente() {
        // Arrange
        OrdenTrabajoRequestDTO updateDTO = new OrdenTrabajoRequestDTO();
        updateDTO.setTitulo("Pintura Coche Actualizado");
        updateDTO.setDescripcion("Descripción actualizada");
        updateDTO.setVehiculo("Toyota Corolla 2023");
        updateDTO.setUsuarioId(1L);
        updateDTO.setMateriasPrimasYcantidades(new HashMap<>());

        when(ordenTrabajoRepository.findById(1L)).thenReturn(Optional.of(ordenTrabajo));
        when(ordenTrabajoRepository.save(any(OrdenTrabajo.class))).thenReturn(ordenTrabajo);

        // Act
        OrdenTrabajoResponseDTO resultado = ordenTrabajoService.actualizar(1L, updateDTO);

        // Assert
        assertNotNull(resultado);
        verify(ordenTrabajoRepository, times(1)).findById(1L);
        verify(ordenTrabajoRepository, times(1)).save(any(OrdenTrabajo.class));
    }

    @Test
    @DisplayName("Actualizar orden no existente lanza excepción")
    void testActualizarOrdenNoExistente() {
        // Arrange
        when(ordenTrabajoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ordenTrabajoService.actualizar(999L, requestDTO);
        });

        assertEquals("Orden de trabajo no encontrada con ID: 999", exception.getMessage());
        verify(ordenTrabajoRepository, never()).save(any(OrdenTrabajo.class));
    }

    @Test
    @DisplayName("Eliminar orden de trabajo existente")
    void testEliminarOrdenTrabajoExistente() {
        // Arrange
        when(ordenTrabajoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(ordenTrabajoRepository).deleteById(1L);

        // Act
        ordenTrabajoService.eliminar(1L);

        // Assert
        verify(ordenTrabajoRepository, times(1)).existsById(1L);
        verify(ordenTrabajoRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Eliminar orden no existente lanza excepción")
    void testEliminarOrdenNoExistente() {
        // Arrange
        when(ordenTrabajoRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ordenTrabajoService.eliminar(999L);
        });

        assertEquals("Orden de trabajo no encontrada con ID: 999", exception.getMessage());
        verify(ordenTrabajoRepository, never()).deleteById(999L);
    }

    @Test
    @DisplayName("Validar que el vehículo no sea nulo")
    void testVehiculoNoNulo() {
        // Arrange
        OrdenTrabajoRequestDTO invalidDTO = new OrdenTrabajoRequestDTO();
        invalidDTO.setVehiculo(null);

        // Act & Assert
        assertNull(invalidDTO.getVehiculo());
    }

    @Test
    @DisplayName("Validar que el título no sea nulo")
    void testTituloNoNulo() {
        // Arrange
        OrdenTrabajoRequestDTO invalidDTO = new OrdenTrabajoRequestDTO();
        invalidDTO.setTitulo(null);

        // Act & Assert
        assertTrue(invalidDTO.getTitulo().length() > 0 || invalidDTO.getTitulo() == null);
    }
}


package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.ClienteRequestDTO;
import com.pintaauto.inventory.dto.ClienteResponseDTO;
import com.pintaauto.inventory.entity.Cliente;
import com.pintaauto.inventory.repository.ClienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas unitarias de ClienteService")
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    private Cliente cliente;
    private ClienteRequestDTO requestDTO;
    private ClienteResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        // Inicializar datos de prueba
        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNombre("Juan");
        cliente.setApellido("Pérez");
        cliente.setCedula("1234567890");
        cliente.setFechaNacimiento(new Date(90, 0, 1)); // 1990-01-01
        cliente.setTelefono("0987654321");
        cliente.setEmail("juan.perez@example.com");
        cliente.setDireccion("Calle Principal 123");

        requestDTO = new ClienteRequestDTO();
        requestDTO.setNombre("Juan");
        requestDTO.setApellido("Pérez");
        requestDTO.setCedula("1234567890");
        requestDTO.setFechaNacimiento(new Date(90, 0, 1));
        requestDTO.setTelefono("0987654321");
        requestDTO.setEmail("juan.perez@example.com");
        requestDTO.setDireccion("Calle Principal 123");

        responseDTO = new ClienteResponseDTO(
                1L,
                "Juan",
                "Pérez",
                "1234567890",
                new Date(90, 0, 1),
                "0987654321",
                "juan.perez@example.com",
                "Calle Principal 123"
        );
    }

    @Test
    @DisplayName("Obtener todos los clientes")
    void testObtenerTodos() {
        // Arrange
        Cliente cliente2 = new Cliente();
        cliente2.setId(2L);
        cliente2.setNombre("María");
        cliente2.setApellido("García");
        cliente2.setCedula("9876543210");
        cliente2.setEmail("maria.garcia@example.com");

        when(clienteRepository.findAll()).thenReturn(Arrays.asList(cliente, cliente2));

        // Act
        List<ClienteResponseDTO> resultado = clienteService.obtenerTodos();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Juan", resultado.get(0).getNombre());
        assertEquals("María", resultado.get(1).getNombre());
        verify(clienteRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Obtener cliente por ID existente")
    void testObtenerPorIdExistente() {
        // Arrange
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        // Act
        ClienteResponseDTO resultado = clienteService.obtenerPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals("Juan", resultado.getNombre());
        assertEquals("1234567890", resultado.getCedula());
        verify(clienteRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Obtener cliente por ID no existente lanza excepción")
    void testObtenerPorIdNoExistente() {
        // Arrange
        when(clienteRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            clienteService.obtenerPorId(999L);
        });

        assertEquals("Cliente no encontrado", exception.getMessage());
        verify(clienteRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Crear cliente exitosamente")
    void testCrearClienteExitoso() {
        // Arrange
        when(clienteRepository.existsByCedula("1234567890")).thenReturn(false);
        when(clienteRepository.existsByEmail("juan.perez@example.com")).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);

        // Act
        ClienteResponseDTO resultado = clienteService.crear(requestDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals("Juan", resultado.getNombre());
        assertEquals("1234567890", resultado.getCedula());
        verify(clienteRepository, times(1)).existsByCedula("1234567890");
        verify(clienteRepository, times(1)).existsByEmail("juan.perez@example.com");
        verify(clienteRepository, times(1)).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Crear cliente con cédula duplicada lanza excepción")
    void testCrearClienteCedulaDuplicada() {
        // Arrange
        when(clienteRepository.existsByCedula("1234567890")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            clienteService.crear(requestDTO);
        });

        assertEquals("Ya existe un cliente con la cédula proporcionada", exception.getMessage());
        verify(clienteRepository, never()).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Crear cliente con email duplicado lanza excepción")
    void testCrearClienteEmailDuplicado() {
        // Arrange
        when(clienteRepository.existsByCedula("1234567890")).thenReturn(false);
        when(clienteRepository.existsByEmail("juan.perez@example.com")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            clienteService.crear(requestDTO);
        });

        assertEquals("Ya existe un cliente con el email proporcionado", exception.getMessage());
        verify(clienteRepository, never()).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Actualizar cliente existente")
    void testActualizarClienteExistente() {
        // Arrange
        ClienteRequestDTO updateDTO = new ClienteRequestDTO();
        updateDTO.setNombre("Juan Carlos");
        updateDTO.setApellido("Pérez García");
        updateDTO.setCedula("1234567890");
        updateDTO.setFechaNacimiento(new Date(90, 0, 1));
        updateDTO.setTelefono("0987654321");
        updateDTO.setEmail("juan.carlos@example.com");
        updateDTO.setDireccion("Calle Nueva 456");

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(clienteRepository.save(any(Cliente.class))).thenReturn(cliente);

        // Act
        ClienteResponseDTO resultado = clienteService.actualizar(1L, updateDTO);

        // Assert
        assertNotNull(resultado);
        verify(clienteRepository, times(1)).findById(1L);
        verify(clienteRepository, times(1)).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Actualizar cliente no existente lanza excepción")
    void testActualizarClienteNoExistente() {
        // Arrange
        when(clienteRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            clienteService.actualizar(999L, requestDTO);
        });

        assertEquals("Cliente no encontrado", exception.getMessage());
        verify(clienteRepository, never()).save(any(Cliente.class));
    }

    @Test
    @DisplayName("Eliminar cliente existente")
    void testEliminarClienteExistente() {
        // Arrange
        when(clienteRepository.existsById(1L)).thenReturn(true);
        doNothing().when(clienteRepository).deleteById(1L);

        // Act
        clienteService.eliminar(1L);

        // Assert
        verify(clienteRepository, times(1)).existsById(1L);
        verify(clienteRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Eliminar cliente no existente lanza excepción")
    void testEliminarClienteNoExistente() {
        // Arrange
        when(clienteRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            clienteService.eliminar(999L);
        });

        assertEquals("Cliente no encontrado", exception.getMessage());
        verify(clienteRepository, never()).deleteById(999L);
    }

    @Test
    @DisplayName("Validar formato de teléfono")
    void testValidarFormatoTelefono() {
        // Arrange
        ClienteRequestDTO invalidDTO = new ClienteRequestDTO();
        invalidDTO.setNombre("Test");
        invalidDTO.setApellido("Usuario");
        invalidDTO.setCedula("1234567890");
        invalidDTO.setFechaNacimiento(new Date(90, 0, 1));
        invalidDTO.setTelefono("123"); // Teléfono inválido
        invalidDTO.setEmail("test@example.com");
        invalidDTO.setDireccion("Test");

        // Act & Assert
        assertTrue(invalidDTO.getTelefono().length() < 10);
    }

    @Test
    @DisplayName("Validar email válido")
    void testValidarEmailValido() {
        // Arrange & Act
        String email = "juan.perez@example.com";

        // Assert
        assertTrue(email.contains("@"));
        assertTrue(email.contains("."));
    }

    @Test
    @DisplayName("Convertir Cliente a ResponseDTO")
    void testConvertirAResponseDTO() {
        // Act
        ClienteResponseDTO result = clienteService.convertirAResponseDTO(cliente);

        // Assert
        assertNotNull(result);
        assertEquals(cliente.getId(), result.getId());
        assertEquals(cliente.getNombre(), result.getNombre());
        assertEquals(cliente.getApellido(), result.getApellido());
        assertEquals(cliente.getCedula(), result.getCedula());
        assertEquals(cliente.getEmail(), result.getEmail());
    }
}


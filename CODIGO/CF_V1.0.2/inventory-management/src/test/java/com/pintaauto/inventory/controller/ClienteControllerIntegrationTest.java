package com.pintaauto.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pintaauto.inventory.dto.ClienteRequestDTO;
import com.pintaauto.inventory.dto.ClienteResponseDTO;
import com.pintaauto.inventory.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas de integración - ClienteController")
class ClienteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private ClienteService clienteService;

    @Autowired
    private ObjectMapper objectMapper;

    private ClienteResponseDTO clienteDTO;
    private ClienteRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        clienteDTO = new ClienteResponseDTO(
                1L,
                "Juan",
                "Pérez",
                "1234567890",
                new Date(90, 0, 1),
                "0987654321",
                "juan.perez@example.com",
                "Calle Principal 123"
        );

        requestDTO = new ClienteRequestDTO();
        requestDTO.setNombre("Juan");
        requestDTO.setApellido("Pérez");
        requestDTO.setCedula("1234567890");
        requestDTO.setFechaNacimiento(new Date(90, 0, 1));
        requestDTO.setTelefono("0987654321");
        requestDTO.setEmail("juan.perez@example.com");
        requestDTO.setDireccion("Calle Principal 123");
    }

    @Test
    @DisplayName("GET /api/clientes - Obtener todos los clientes")
    void testObtenerTodosClientes() throws Exception {
        // Arrange
        List<ClienteResponseDTO> list = new ArrayList<>();
        list.add(clienteDTO);
        when(clienteService.obtenerTodos()).thenReturn(list);

        // Act & Assert
        mockMvc.perform(get("/api/clientes")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nombre", equalTo("Juan")));

        verify(clienteService, times(1)).obtenerTodos();
    }

    @Test
    @DisplayName("GET /api/clientes/{id} - Obtener cliente por ID")
    void testObtenerClientePorId() throws Exception {
        // Arrange
        when(clienteService.obtenerPorId(1L)).thenReturn(clienteDTO);

        // Act & Assert
        mockMvc.perform(get("/api/clientes/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", equalTo("Juan")))
                .andExpect(jsonPath("$.cedula", equalTo("1234567890")));

        verify(clienteService, times(1)).obtenerPorId(1L);
    }

    @Test
    @DisplayName("POST /api/clientes - Crear nuevo cliente")
    void testCrearCliente() throws Exception {
        // Arrange
        when(clienteService.crear(ArgumentMatchers.any(ClienteRequestDTO.class)))
                .thenReturn(clienteDTO);

        // Act & Assert
        mockMvc.perform(post("/api/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre", equalTo("Juan")));

        verify(clienteService, times(1)).crear(ArgumentMatchers.any(ClienteRequestDTO.class));
    }

    @Test
    @DisplayName("PUT /api/clientes/{id} - Actualizar cliente")
    void testActualizarCliente() throws Exception {
        // Arrange
        when(clienteService.actualizar(eq(1L), any(ClienteRequestDTO.class)))
                .thenReturn(clienteDTO);

        // Act & Assert
        mockMvc.perform(put("/api/clientes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", equalTo("Juan")));

        verify(clienteService, times(1)).actualizar(eq(1L), ArgumentMatchers.any(ClienteRequestDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/clientes/{id} - Eliminar cliente")
    void testEliminarCliente() throws Exception {
        // Arrange
        doNothing().when(clienteService).eliminar(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/clientes/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(clienteService, times(1)).eliminar(1L);
    }
}


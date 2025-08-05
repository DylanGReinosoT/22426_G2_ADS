package com.pintaauto.inventory.UnitTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pintaauto.inventory.controller.ClienteController;
import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.ClienteRequestDTO;
import com.pintaauto.inventory.dto.ClienteResponseDTO;
import com.pintaauto.inventory.service.ClienteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClienteController.class)
public class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClienteService clienteService;

    @Autowired
    private ObjectMapper objectMapper;

    private ClienteResponseDTO clienteResponseDTO;
    private ClienteRequestDTO clienteRequestDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Configurar datos de prueba
        clienteResponseDTO = new ClienteResponseDTO();
        clienteResponseDTO.setId(1L);
        clienteResponseDTO.setNombre("Juan");
        clienteResponseDTO.setApellido("Pérez");
        clienteResponseDTO.setCedula("1234567890");
        
        // Convertir LocalDate a Date
        Date fechaNacimiento = Date.from(LocalDate.of(1990, 1, 1).atStartOfDay(ZoneId.systemDefault()).toInstant());
        clienteResponseDTO.setFechaNacimiento(fechaNacimiento);
        
        clienteResponseDTO.setTelefono("0987654321");
        clienteResponseDTO.setEmail("juan.perez@example.com");
        clienteResponseDTO.setDireccion("Quito, Ecuador");

        clienteRequestDTO = new ClienteRequestDTO();
        clienteRequestDTO.setNombre("Juan");
        clienteRequestDTO.setApellido("Pérez");
        clienteRequestDTO.setCedula("1234567890");
        clienteRequestDTO.setFechaNacimiento(fechaNacimiento);
        clienteRequestDTO.setTelefono("0987654321");
        clienteRequestDTO.setEmail("juan.perez@example.com");
        clienteRequestDTO.setDireccion("Quito, Ecuador");
    }

    @Test
    void testObtenerTodos_DebeRetornarListaDeClientes() throws Exception {
        // Given
        List<ClienteResponseDTO> clientes = Arrays.asList(clienteResponseDTO);
        when(clienteService.obtenerTodos()).thenReturn(clientes);

        // When & Then
        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Clientes obtenidos correctamente"))
                .andExpect(jsonPath("$.datos").isArray())
                .andExpect(jsonPath("$.datos[0].id").value(1))
                .andExpect(jsonPath("$.datos[0].nombre").value("Juan"))
                .andExpect(jsonPath("$.datos[0].apellido").value("Pérez"))
                .andExpect(jsonPath("$.datos[0].cedula").value("1234567890"))
                .andExpect(jsonPath("$.datos[0].email").value("juan.perez@example.com"));
    }

    @Test
    void testObtenerPorId_CuandoClienteExiste_DebeRetornarCliente() throws Exception {
        // Given
        when(clienteService.obtenerPorId(1L)).thenReturn(clienteResponseDTO);

        // When & Then
        mockMvc.perform(get("/api/clientes/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Cliente encontrado"))
                .andExpect(jsonPath("$.datos.id").value(1))
                .andExpect(jsonPath("$.datos.nombre").value("Juan"))
                .andExpect(jsonPath("$.datos.apellido").value("Pérez"))
                .andExpect(jsonPath("$.datos.cedula").value("1234567890"));
    }

    @Test
    void testObtenerPorId_CuandoClienteNoExiste_DebeRetornarError() throws Exception {
        // Given
        when(clienteService.obtenerPorId(99L))
                .thenThrow(new RuntimeException("Cliente no encontrado con ID: 99"));

        // When & Then
        mockMvc.perform(get("/api/clientes/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("Cliente no encontrado con ID: 99"));
    }

    @Test
    void testCrear_ConDatosValidos_DebeCrearCliente() throws Exception {
        // Given
        when(clienteService.crear(any(ClienteRequestDTO.class))).thenReturn(clienteResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Cliente creado correctamente"))
                .andExpect(jsonPath("$.datos.id").value(1))
                .andExpect(jsonPath("$.datos.nombre").value("Juan"))
                .andExpect(jsonPath("$.datos.apellido").value("Pérez"));
    }

    @Test
    void testCrear_ConCedulaExistente_DebeRetornarError() throws Exception {
        // Given
        when(clienteService.crear(any(ClienteRequestDTO.class)))
                .thenThrow(new RuntimeException("Ya existe un cliente con la cédula proporcionada"));

        // When & Then
        mockMvc.perform(post("/api/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteRequestDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCrear_ConEmailExistente_DebeRetornarError() throws Exception {
        // Given
        when(clienteService.crear(any(ClienteRequestDTO.class)))
                .thenThrow(new RuntimeException("Ya existe un cliente con el email proporcionado"));

        // When & Then
        mockMvc.perform(post("/api/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteRequestDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testActualizar_ConDatosValidos_DebeActualizarCliente() throws Exception {
        // Given
        ClienteResponseDTO clienteActualizado = new ClienteResponseDTO();
        clienteActualizado.setId(1L);
        clienteActualizado.setNombre("Juan Carlos");
        clienteActualizado.setApellido("Pérez García");
        clienteActualizado.setCedula("1234567890");
        clienteActualizado.setEmail("juan.carlos@example.com");

        when(clienteService.actualizar(eq(1L), any(ClienteRequestDTO.class)))
                .thenReturn(clienteActualizado);

        ClienteRequestDTO requestDTO = new ClienteRequestDTO();
        requestDTO.setNombre("Juan Carlos");
        requestDTO.setApellido("Pérez García");
        requestDTO.setCedula("1234567890");
        requestDTO.setEmail("juan.carlos@example.com");

        // When & Then
        mockMvc.perform(put("/api/clientes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Cliente actualizado correctamente"))
                .andExpect(jsonPath("$.datos.nombre").value("Juan Carlos"))
                .andExpect(jsonPath("$.datos.apellido").value("Pérez García"))
                .andExpect(jsonPath("$.datos.email").value("juan.carlos@example.com"));
    }

    @Test
    void testActualizar_ConIdInexistente_DebeRetornarError() throws Exception {
        // Given
        when(clienteService.actualizar(eq(99L), any(ClienteRequestDTO.class)))
                .thenThrow(new RuntimeException("Cliente no encontrado con ID: 99"));

        // When & Then
        mockMvc.perform(put("/api/clientes/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteRequestDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testEliminar_ConIdValido_DebeEliminarCliente() throws Exception {
        // Given
        doNothing().when(clienteService).eliminar(1L);

        // When & Then
        mockMvc.perform(delete("/api/clientes/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Cliente eliminado correctamente"));
    }

    @Test
    void testEliminar_ConIdInexistente_DebeRetornarError() throws Exception {
        // Given
        when(clienteService.obtenerPorId(99L))
                .thenThrow(new RuntimeException("Cliente no encontrado con ID: 99"));
        doNothing().when(clienteService).eliminar(99L);

        // When & Then
        mockMvc.perform(delete("/api/clientes/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false));
    }

    @Test
    void testCrear_ConDatosInvalidos_DebeRetornarErrorValidacion() throws Exception {
        // Given - Cliente con datos inválidos (nombre vacío)
        ClienteRequestDTO clienteInvalido = new ClienteRequestDTO();
        clienteInvalido.setNombre(""); // Nombre vacío
        clienteInvalido.setApellido("Pérez");
        clienteInvalido.setCedula("123"); // Cédula muy corta
        clienteInvalido.setEmail("email-invalido"); // Email inválido

        // When & Then
        mockMvc.perform(post("/api/clientes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(clienteInvalido)))
                .andExpect(status().isBadRequest());
    }
}

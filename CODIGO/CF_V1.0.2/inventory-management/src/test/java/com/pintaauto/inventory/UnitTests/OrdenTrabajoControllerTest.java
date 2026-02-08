package com.pintaauto.inventory.UnitTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pintaauto.inventory.controller.OrdenTrabajoController;
import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.OrdenTrabajoRequestDTO;
import com.pintaauto.inventory.dto.OrdenTrabajoResponseDTO;
import com.pintaauto.inventory.service.OrdenTrabajoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas unitarias para OrdenTrabajoController
 * Utiliza MockMvc setup manual con @InjectMocks
 */
@ExtendWith(MockitoExtension.class)
public class OrdenTrabajoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrdenTrabajoService ordenTrabajoService;

    @InjectMocks
    private OrdenTrabajoController controller;

    private ObjectMapper objectMapper;

    private OrdenTrabajoResponseDTO ordenTrabajoResponseDTO;
    private OrdenTrabajoRequestDTO ordenTrabajoRequestDTO;

    @BeforeEach
    void setUp() {
        // Configurar MockMvc con @InjectMocks
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        // Inicializar ObjectMapper
        objectMapper = new ObjectMapper();

        // Configurar materias primas de prueba
        Map<Long, Double> materiasPrimas = new HashMap<>();
        materiasPrimas.put(1L, 5.0);
        materiasPrimas.put(2L, 10.0);
        
        // Configurar datos de prueba para Response
        ordenTrabajoResponseDTO = new OrdenTrabajoResponseDTO();
        ordenTrabajoResponseDTO.setId(1L);
        ordenTrabajoResponseDTO.setTitulo("Mantenimiento de Motor");
        ordenTrabajoResponseDTO.setDescripcion("Cambio de aceite y filtros");
        ordenTrabajoResponseDTO.setVehiculo("Toyota Corolla 2020");
        ordenTrabajoResponseDTO.setFechaCreacion(LocalDateTime.now());
        ordenTrabajoResponseDTO.setMateriasPrimasYcantidades(materiasPrimas);
        ordenTrabajoResponseDTO.setValorMateriales(150.0);

        // Configurar datos de prueba para Request
        ordenTrabajoRequestDTO = new OrdenTrabajoRequestDTO();
        ordenTrabajoRequestDTO.setTitulo("Mantenimiento de Motor");
        ordenTrabajoRequestDTO.setDescripcion("Cambio de aceite y filtros");
        ordenTrabajoRequestDTO.setVehiculo("Toyota Corolla 2020");
        ordenTrabajoRequestDTO.setUsuarioId(1L);
        ordenTrabajoRequestDTO.setClienteId(1L);
        ordenTrabajoRequestDTO.setMateriasPrimasYcantidades(materiasPrimas);
    }

    @Test
    void testObtenerTodas_DebeRetornarListaDeOrdenes() throws Exception {
        // Given
        List<OrdenTrabajoResponseDTO> ordenes = Arrays.asList(ordenTrabajoResponseDTO);
        when(ordenTrabajoService.obtenerTodas()).thenReturn(ordenes);

        // When & Then
        mockMvc.perform(get("/api/ordenes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").value("Órdenes obtenidas correctamente"))
                .andExpect(jsonPath("$.datos").isArray())
                .andExpect(jsonPath("$.datos[0].id").value(1));
    }

    @Test
    void testObtenerPorId_CuandoOrdenExiste_DebeRetornarOrden() throws Exception {
        // Given
        when(ordenTrabajoService.obtenerPorId(1L)).thenReturn(ordenTrabajoResponseDTO);

        // When & Then
        mockMvc.perform(get("/api/ordenes/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").exists())
                .andExpect(jsonPath("$.datos.id").value(1));
    }

    @Test
    void testCrear_ConDatosValidos_DebeCrearOrden() throws Exception {
        // Given
        when(ordenTrabajoService.crear(any(OrdenTrabajoRequestDTO.class)))
                .thenReturn(ordenTrabajoResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/ordenes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ordenTrabajoRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").exists())
                .andExpect(jsonPath("$.datos.id").value(1));
    }

    @Test
    void testActualizar_ConDatosValidos_DebeActualizarOrden() throws Exception {
        // Given
        when(ordenTrabajoService.actualizar(eq(1L), any(OrdenTrabajoRequestDTO.class)))
                .thenReturn(ordenTrabajoResponseDTO);

        // When & Then
        mockMvc.perform(put("/api/ordenes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ordenTrabajoRequestDTO)))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testEliminar_ConIdValido_DebeEliminarOrden() throws Exception {
        // Given
        doNothing().when(ordenTrabajoService).eliminar(1L);

        // When & Then
        mockMvc.perform(delete("/api/ordenes/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").exists());
    }
}
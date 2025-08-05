package com.pintaauto.inventory.UnitTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pintaauto.inventory.controller.OrdenTrabajoController;
import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.OrdenTrabajoRequestDTO;
import com.pintaauto.inventory.dto.OrdenTrabajoResponseDTO;
import com.pintaauto.inventory.service.OrdenTrabajoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

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

@WebMvcTest(OrdenTrabajoController.class)
public class OrdenTrabajoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrdenTrabajoService ordenTrabajoService;

    @Autowired
    private ObjectMapper objectMapper;

    private OrdenTrabajoResponseDTO ordenTrabajoResponseDTO;
    private OrdenTrabajoRequestDTO ordenTrabajoRequestDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
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
        mockMvc.perform(get("/api/ordenes-trabajo"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Órdenes de trabajo obtenidas correctamente"))
                .andExpect(jsonPath("$.datos").isArray())
                .andExpect(jsonPath("$.datos[0].id").value(1))
                .andExpect(jsonPath("$.datos[0].titulo").value("Mantenimiento de Motor"))
                .andExpect(jsonPath("$.datos[0].descripcion").value("Cambio de aceite y filtros"))
                .andExpect(jsonPath("$.datos[0].vehiculo").value("Toyota Corolla 2020"));
    }

    @Test
    void testObtenerPorId_CuandoOrdenExiste_DebeRetornarOrden() throws Exception {
        // Given
        when(ordenTrabajoService.obtenerPorId(1L)).thenReturn(ordenTrabajoResponseDTO);

        // When & Then
        mockMvc.perform(get("/api/ordenes-trabajo/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Orden de trabajo encontrada"))
                .andExpect(jsonPath("$.datos.id").value(1))
                .andExpect(jsonPath("$.datos.titulo").value("Mantenimiento de Motor"))
                .andExpect(jsonPath("$.datos.descripcion").value("Cambio de aceite y filtros"));
    }

    @Test
    void testCrear_ConDatosValidos_DebeCrearOrden() throws Exception {
        // Given
        when(ordenTrabajoService.crear(any(OrdenTrabajoRequestDTO.class)))
                .thenReturn(ordenTrabajoResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/ordenes-trabajo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ordenTrabajoRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Orden de trabajo creada correctamente"))
                .andExpect(jsonPath("$.datos.id").value(1))
                .andExpect(jsonPath("$.datos.titulo").value("Mantenimiento de Motor"));
    }

    @Test
    void testActualizar_ConDatosValidos_DebeActualizarOrden() throws Exception {
        // Given
        OrdenTrabajoResponseDTO ordenActualizada = new OrdenTrabajoResponseDTO();
        ordenActualizada.setId(1L);
        ordenActualizada.setTitulo("Mantenimiento Completo");
        ordenActualizada.setDescripcion("Cambio de aceite, filtros y bujías");

        when(ordenTrabajoService.actualizar(eq(1L), any(OrdenTrabajoRequestDTO.class)))
                .thenReturn(ordenActualizada);

        OrdenTrabajoRequestDTO requestDTO = new OrdenTrabajoRequestDTO();
        requestDTO.setTitulo("Mantenimiento Completo");
        requestDTO.setDescripcion("Cambio de aceite, filtros y bujías");

        // When & Then
        mockMvc.perform(put("/api/ordenes-trabajo/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Orden de trabajo actualizada correctamente"))
                .andExpect(jsonPath("$.datos.titulo").value("Mantenimiento Completo"));
    }

    @Test
    void testEliminar_ConIdValido_DebeEliminarOrden() throws Exception {
        // Given
        doNothing().when(ordenTrabajoService).eliminar(1L);

        // When & Then
        mockMvc.perform(delete("/api/ordenes-trabajo/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Orden de trabajo eliminada correctamente"));
    }
}
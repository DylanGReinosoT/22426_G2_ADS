package com.pintaauto.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pintaauto.inventory.dto.MateriaPrimaRequestDTO;
import com.pintaauto.inventory.dto.MateriaPrimaResponseDTO;
import com.pintaauto.inventory.service.MateriaPrimaService;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas de integración - MateriaPrimaController")
class MateriaPrimaControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private MateriaPrimaService materiaPrimaService;

    @Autowired
    private ObjectMapper objectMapper;

    private MateriaPrimaResponseDTO materiaPrimaDTO;
    private MateriaPrimaRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        materiaPrimaDTO = new MateriaPrimaResponseDTO(
                1L,
                "Pintura Roja",
                "litro",
                100.0,
                "Pintura de excelente calidad",
                BigDecimal.valueOf(50.00),
                LocalDateTime.now(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        requestDTO = new MateriaPrimaRequestDTO();
        requestDTO.setNombre("Pintura Roja");
        requestDTO.setUnidadMedida("litro");
        requestDTO.setCantidad(100.0);
        requestDTO.setDetalles("Pintura de excelente calidad");
        requestDTO.setPrecioUnitario(BigDecimal.valueOf(50.00));
    }

    @Test
    @DisplayName("GET /api/materias-primas - Obtener todas las materias primas")
    void testObtenerTodasMateriaPrimas() throws Exception {
        // Arrange
        List<MateriaPrimaResponseDTO> list = new ArrayList<>();
        list.add(materiaPrimaDTO);
        when(materiaPrimaService.obtenerTodas()).thenReturn(list);

        // Act & Assert
        mockMvc.perform(get("/api/materias-primas")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nombre", equalTo("Pintura Roja")));

        verify(materiaPrimaService, times(1)).obtenerTodas();
    }

    @Test
    @DisplayName("GET /api/materias-primas/{id} - Obtener materia prima por ID")
    void testObtenerMateriaPrimaPorId() throws Exception {
        // Arrange
        when(materiaPrimaService.obtenerPorId(1L)).thenReturn(Optional.of(materiaPrimaDTO));

        // Act & Assert
        mockMvc.perform(get("/api/materias-primas/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", equalTo("Pintura Roja")))
                .andExpect(jsonPath("$.cantidad", equalTo(100)));

        verify(materiaPrimaService, times(1)).obtenerPorId(1L);
    }

    @Test
    @DisplayName("POST /api/materias-primas - Crear nueva materia prima")
    void testCrearMateriaPrima() throws Exception {
        // Arrange
        when(materiaPrimaService.crear(ArgumentMatchers.any(MateriaPrimaRequestDTO.class)))
                .thenReturn(materiaPrimaDTO);

        // Act & Assert
        mockMvc.perform(post("/api/materias-primas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre", equalTo("Pintura Roja")));

        verify(materiaPrimaService, times(1)).crear(ArgumentMatchers.any(MateriaPrimaRequestDTO.class));
    }

    @Test
    @DisplayName("PUT /api/materias-primas/{id} - Actualizar materia prima")
    void testActualizarMateriaPrima() throws Exception {
        // Arrange
        when(materiaPrimaService.actualizar(eq(1L), any(MateriaPrimaRequestDTO.class)))
                .thenReturn(materiaPrimaDTO);

        // Act & Assert
        mockMvc.perform(put("/api/materias-primas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", equalTo("Pintura Roja")));

        verify(materiaPrimaService, times(1)).actualizar(eq(1L), ArgumentMatchers.any(MateriaPrimaRequestDTO.class));
    }

    @Test
    @DisplayName("DELETE /api/materias-primas/{id} - Eliminar materia prima")
    void testEliminarMateriaPrima() throws Exception {
        // Arrange
        doNothing().when(materiaPrimaService).eliminar(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/materias-primas/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(materiaPrimaService, times(1)).eliminar(1L);
    }

    @Test
    @DisplayName("GET /api/materias-primas/{id} - Retorna 404 cuando no existe")
    void testObtenerMateriaPrimaNoExistente() throws Exception {
        // Arrange
        when(materiaPrimaService.obtenerPorId(999L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/materias-primas/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(materiaPrimaService, times(1)).obtenerPorId(999L);
    }

    @Test
    @DisplayName("POST /api/materias-primas - Validar campo nombre requerido")
    void testCrearMateriaPrimaSinNombre() throws Exception {
        // Arrange
        MateriaPrimaRequestDTO invalidDTO = new MateriaPrimaRequestDTO();
        invalidDTO.setNombre(null);
        invalidDTO.setUnidadMedida("litro");

        // Act & Assert
        mockMvc.perform(post("/api/materias-primas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isBadRequest());
    }
}


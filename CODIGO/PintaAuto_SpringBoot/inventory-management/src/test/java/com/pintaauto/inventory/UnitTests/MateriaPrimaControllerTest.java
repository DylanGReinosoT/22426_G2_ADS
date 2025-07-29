package com.pintaauto.inventory.UnitTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import com.pintaauto.inventory.controller.MateriaPrimaController;
import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.MateriaPrimaRequestDTO;
import com.pintaauto.inventory.dto.MateriaPrimaResponseDTO;
import com.pintaauto.inventory.security.JwtAuthenticationFilter;
import com.pintaauto.inventory.service.MateriaPrimaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = MateriaPrimaController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {JwtAuthenticationFilter.class}
        )
)
@WithMockUser
public class MateriaPrimaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MateriaPrimaService materiaPrimaService;

    @Autowired
    private ObjectMapper objectMapper;

    private MateriaPrimaResponseDTO materiaPrimaResponseDTO;
    private MateriaPrimaRequestDTO materiaPrimaRequestDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Configurar datos de prueba
        materiaPrimaResponseDTO = new MateriaPrimaResponseDTO(
                1L,
                "Pintura Blanca",
                "Litros",
                10.0,
                "Pintura de alta calidad color blanco",
                new BigDecimal("25.50"),
                LocalDateTime.now(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        materiaPrimaRequestDTO = new MateriaPrimaRequestDTO();
        materiaPrimaRequestDTO.setNombre("Pintura Blanca");
        materiaPrimaRequestDTO.setUnidadMedida("Litros");
        materiaPrimaRequestDTO.setCantidad(10.0);
        materiaPrimaRequestDTO.setDetalles("Pintura de alta calidad color blanco");
        materiaPrimaRequestDTO.setPrecioUnitario(new BigDecimal("25.50"));
    }
    @WithMockUser
    @Test
    void testObtenerTodas_DebeRetornarListaDeMateriasPrimas() throws Exception {


        // Given
        List<MateriaPrimaResponseDTO> materias = Arrays.asList(materiaPrimaResponseDTO);
        when(materiaPrimaService.obtenerTodas()).thenReturn(materias);

        // When & Then
        mockMvc.perform(get("/api/materia"))

                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").value("Materias obtenidas correctamente"))
                .andExpect(jsonPath("$.datos.materias").isArray())
                .andExpect(jsonPath("$.datos.materias[0].id").value(1))
                .andExpect(jsonPath("$.datos.materias[0].nombre").value("Pintura Blanca"))
                .andExpect(jsonPath("$.datos.materias[0].unidadMedida").value("Litros"))
                .andExpect(jsonPath("$.datos.materias[0].cantidad").value(10.0))
                .andExpect(jsonPath("$.datos.materias[0].precioUnitario").value(25.50));
    }
    @WithMockUser
    @Test
    void testObtenerTodas_CuandoOcurreError_DebeRetornarError() throws Exception {
        // Given
        when(materiaPrimaService.obtenerTodas())
                .thenThrow(new RuntimeException("Error en base de datos"));

        // When & Then
        mockMvc.perform(get("/api/materia"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.mensaje").value("Error al obtener la lista de materias"));
    }

    @Test
    void testObtenerPorId_CuandoMateriaExiste_DebeRetornarMateria() throws Exception {
        // Given
        when(materiaPrimaService.obtenerPorId(1L)).thenReturn(Optional.of(materiaPrimaResponseDTO));

        // When & Then
        mockMvc.perform(get("/api/materia/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").value("Materia encontrada"))
                .andExpect(jsonPath("$.datos.id").value(1))
                .andExpect(jsonPath("$.datos.nombre").value("Pintura Blanca"))
                .andExpect(jsonPath("$.datos.unidadMedida").value("Litros"))
                .andExpect(jsonPath("$.datos.cantidad").value(10.0));
    }

    @Test
    void testObtenerPorId_CuandoMateriaNoExiste_DebeRetornarError() throws Exception {
        // Given
        when(materiaPrimaService.obtenerPorId(99L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/materia/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.mensaje").value("Materia no encontrada"));
    }

    @Test
    void testObtenerPorId_CuandoOcurreError_DebeRetornarError() throws Exception {
        // Given
        when(materiaPrimaService.obtenerPorId(1L))
                .thenThrow(new RuntimeException("Error en base de datos"));

        // When & Then
        mockMvc.perform(get("/api/materia/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.mensaje").value("Error al obtener la materia"));
    }

    @Test
    void testCrear_ConDatosValidos_DebeCrearMateria() throws Exception {
        // Given
        when(materiaPrimaService.crear(any(MateriaPrimaRequestDTO.class)))
                .thenReturn(materiaPrimaResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/materia")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(materiaPrimaRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").value("Materia creada correctamente"))
                .andExpect(jsonPath("$.datos.id").value(1))
                .andExpect(jsonPath("$.datos.nombre").value("Pintura Blanca"))
                .andExpect(jsonPath("$.datos.unidadMedida").value("Litros"));
    }

    @Test
    void testCrear_ConNombreExistente_DebeRetornarError() throws Exception {
        // Given
        when(materiaPrimaService.crear(any(MateriaPrimaRequestDTO.class)))
                .thenThrow(new RuntimeException("La materia prima con el nombre 'Pintura Blanca' ya existe"));

        // When & Then
        mockMvc.perform(post("/api/materia")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(materiaPrimaRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.mensaje").value("La materia prima con el nombre 'Pintura Blanca' ya existe"));
    }

    @Test
    void testCrear_ConDatosInvalidos_DebeRetornarErrorValidacion() throws Exception {
        // Given - Materia prima con datos inválidos
        MateriaPrimaRequestDTO materiaInvalida = new MateriaPrimaRequestDTO();
        materiaInvalida.setNombre(""); // Nombre vacío
        materiaInvalida.setUnidadMedida(""); // Unidad vacía
        materiaInvalida.setCantidad(-1.0); // Cantidad negativa
        materiaInvalida.setPrecioUnitario(new BigDecimal("-10.0")); // Precio negativo

        // When & Then
        mockMvc.perform(post("/api/materia")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(materiaInvalida)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testActualizar_ConDatosValidos_DebeActualizarMateria() throws Exception {
        // Given
        MateriaPrimaResponseDTO materiaActualizada = new MateriaPrimaResponseDTO(
                1L,
                "Pintura Roja",
                "Litros",
                15.0,
                "Pintura de alta calidad color rojo",
                new BigDecimal("30.00"),
                LocalDateTime.now(),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(materiaPrimaService.actualizar(eq(1L), any(MateriaPrimaRequestDTO.class)))
                .thenReturn(materiaActualizada);

        MateriaPrimaRequestDTO requestDTO = new MateriaPrimaRequestDTO();
        requestDTO.setNombre("Pintura Roja");
        requestDTO.setUnidadMedida("Litros");
        requestDTO.setCantidad(15.0);
        requestDTO.setDetalles("Pintura de alta calidad color rojo");
        requestDTO.setPrecioUnitario(new BigDecimal("30.00"));

        // When & Then
        mockMvc.perform(put("/api/materia/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").value("Materia actualizada correctamente"))
                .andExpect(jsonPath("$.datos.nombre").value("Pintura Roja"))
                .andExpect(jsonPath("$.datos.cantidad").value(15.0))
                .andExpect(jsonPath("$.datos.precioUnitario").value(30.00));
    }

    @Test
    void testActualizar_ConIdInexistente_DebeRetornarError() throws Exception {
        // Given
        when(materiaPrimaService.actualizar(eq(99L), any(MateriaPrimaRequestDTO.class)))
                .thenThrow(new RuntimeException("Materia prima no encontrada con ID: 99"));

        // When & Then
        mockMvc.perform(put("/api/materia/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(materiaPrimaRequestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.mensaje").value("Materia prima no encontrada con ID: 99"));
    }

    @Test
    void testEliminar_ConIdValido_DebeEliminarMateria() throws Exception {
        // Given
        doNothing().when(materiaPrimaService).eliminar(1L);

        // When & Then
        mockMvc.perform(delete("/api/materia/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.mensaje").value("Materia eliminada correctamente"));
    }

    @Test
    void testEliminar_ConIdInexistente_DebeRetornarError() throws Exception {
        // Given
        doNothing().when(materiaPrimaService).eliminar(99L);
        when(materiaPrimaService.obtenerPorId(99L))
                .thenThrow(new RuntimeException("Materia prima no encontrada con ID: 99"));

        // When & Then
        mockMvc.perform(delete("/api/materia/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testBuscarPorNombre_ConNombreValido_DebeRetornarMaterias() throws Exception {
        // Given
        List<MateriaPrimaResponseDTO> materias = Arrays.asList(materiaPrimaResponseDTO);
        when(materiaPrimaService.buscarPorNombre("Pintura")).thenReturn(materias);

        // When & Then
        mockMvc.perform(get("/api/materia/buscar")
                .param("nombre", "Pintura"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.datos").isArray())
                .andExpect(jsonPath("$.datos[0].nombre").value("Pintura Blanca"));
    }

    @Test
    void testBuscarPorNombre_SinResultados_DebeRetornarListaVacia() throws Exception {
        // Given
        when(materiaPrimaService.buscarPorNombre("NoExiste")).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/api/materia/buscar")
                .param("nombre", "NoExiste"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.datos").isArray())
                .andExpect(jsonPath("$.datos").isEmpty());
    }
}

package com.pintaauto.inventory.UnitTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pintaauto.inventory.controller.UsuarioController;
import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UsuarioController.class)
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    private UsuarioResponseDTO usuarioResponseDTO;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Configurar datos de prueba
        usuarioResponseDTO = new UsuarioResponseDTO();
        usuarioResponseDTO.setId(1L);
        usuarioResponseDTO.setNombre("Admin");
        usuarioResponseDTO.setApellido("Sistema");
        usuarioResponseDTO.setEmail("admin@pintaauto.com");

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Admin");
        usuario.setApellido("Sistema");
        usuario.setEmail("admin@pintaauto.com");
    }

    @Test
    void testObtenerTodos_DebeRetornarListaDeUsuarios() throws Exception {
        // Given
        List<UsuarioResponseDTO> usuarios = Arrays.asList(usuarioResponseDTO);
        when(usuarioService.obtenerTodos()).thenReturn(usuarios);

        // When & Then
        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Usuarios obtenidos correctamente"))
                .andExpect(jsonPath("$.datos").isArray())
                .andExpect(jsonPath("$.datos[0].id").value(1))
                .andExpect(jsonPath("$.datos[0].nombre").value("Admin"))
                .andExpect(jsonPath("$.datos[0].apellido").value("Sistema"))
                .andExpect(jsonPath("$.datos[0].email").value("admin@pintaauto.com"));
    }

    @Test
    void testObtenerPorId_CuandoUsuarioExiste_DebeRetornarUsuario() throws Exception {
        // Given
        when(usuarioService.buscarPorId(1L)).thenReturn(Optional.of(usuario));
        when(usuarioService.convertirAResponseDTO(usuario)).thenReturn(usuarioResponseDTO);

        // When & Then
        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Usuario encontrado"))
                .andExpect(jsonPath("$.datos.id").value(1))
                .andExpect(jsonPath("$.datos.nombre").value("Admin"))
                .andExpect(jsonPath("$.datos.apellido").value("Sistema"))
                .andExpect(jsonPath("$.datos.email").value("admin@pintaauto.com"));
    }

    @Test
    void testObtenerPorId_CuandoUsuarioNoExiste_DebeRetornarError() throws Exception {
        // Given
        when(usuarioService.buscarPorId(99L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/usuarios/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("Usuario no encontrado"));
    }

    @Test
    void testEliminar_ConIdValido_DebeEliminarUsuario() throws Exception {
        // Given
        doNothing().when(usuarioService).eliminar(1L);

        // When & Then
        mockMvc.perform(delete("/api/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Usuario eliminado correctamente"));
    }

    @Test
    void testEliminar_ConIdInexistente_DebeRetornarError() throws Exception {
        // Given
        when(usuarioService.buscarPorId(99L)).thenReturn(Optional.empty());
        doNothing().when(usuarioService).eliminar(99L);

        // When & Then
        mockMvc.perform(delete("/api/usuarios/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("Usuario no encontrado"));
    }
}
package com.pintaauto.inventory.UnitTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pintaauto.inventory.controller.AuthController;
import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.AuthResponseDTO;
import com.pintaauto.inventory.dto.LoginRequestDTO;
import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas unitarias para AuthController
 * Utiliza MockMvc setup manual con @InjectMocks
 */
@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController controller;

    private ObjectMapper objectMapper;

    private LoginRequestDTO loginRequestDTO;
    private AuthResponseDTO authResponseDTO;

    @BeforeEach
    void setUp() {
        // Configurar MockMvc con @InjectMocks
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        // Inicializar ObjectMapper
        objectMapper = new ObjectMapper();

        // Configurar datos de prueba
        loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setEmail("admin@pintaauto.com");
        loginRequestDTO.setPassword("admin123");

        UsuarioResponseDTO usuarioResponse = new UsuarioResponseDTO();
        usuarioResponse.setId(1L);
        usuarioResponse.setNombre("Admin");
        usuarioResponse.setApellido("Sistema");
        usuarioResponse.setEmail("admin@pintaauto.com");

        authResponseDTO = new AuthResponseDTO();
        authResponseDTO.setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
        authResponseDTO.setUsuario(usuarioResponse);
    }

    @Test
    void testLogin_ConCredencialesValidas_DebeRetornarToken() throws Exception {
        // Given
        when(authService.login(any(LoginRequestDTO.class))).thenReturn(authResponseDTO);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Login exitoso"))
                .andExpect(jsonPath("$.datos.token").value("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."))
                .andExpect(jsonPath("$.datos.tipoToken").value("Bearer"))
                .andExpect(jsonPath("$.datos.expiresIn").value(3600))
                .andExpect(jsonPath("$.datos.nombreUsuario").value("Admin"))
                .andExpect(jsonPath("$.datos.emailUsuario").value("admin@pintaauto.com"))
                .andExpect(jsonPath("$.datos.rolUsuario").value("ADMIN"));
    }

    @Test
    void testLogin_ConCredencialesInvalidas_DebeRetornarError() throws Exception {
        // Given
        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new RuntimeException("Credenciales inválidas"));

        LoginRequestDTO credencialesInvalidas = new LoginRequestDTO();
        credencialesInvalidas.setEmail("admin@pintaauto.com");
        credencialesInvalidas.setPassword("contraseña_incorrecta");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credencialesInvalidas)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("Credenciales inválidas"));
    }

    @Test
    void testLogin_ConEmailInvalido_DebeRetornarErrorValidacion() throws Exception {
        // Given - Login con email inválido
        LoginRequestDTO loginInvalido = new LoginRequestDTO();
        loginInvalido.setEmail("email-invalido"); // Email sin formato válido
        loginInvalido.setPassword("admin123");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginInvalido)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false));
    }

    @Test
    void testLogin_ConCamposVacios_DebeRetornarErrorValidacion() throws Exception {
        // Given - Login con campos vacíos
        LoginRequestDTO loginVacio = new LoginRequestDTO();
        loginVacio.setEmail(""); // Email vacío
        loginVacio.setPassword(""); // Contraseña vacía

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginVacio)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false));
    }

    @Test
    void testLogin_ConCamposNulos_DebeRetornarErrorValidacion() throws Exception {
        // Given - Login con campos nulos
        LoginRequestDTO loginNulo = new LoginRequestDTO();
        loginNulo.setEmail(null);
        loginNulo.setPassword(null);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginNulo)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false));
    }

    @Test
    void testLogin_ConUsuarioInexistente_DebeRetornarError() throws Exception {
        // Given
        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new RuntimeException("Usuario no encontrado"));

        LoginRequestDTO usuarioInexistente = new LoginRequestDTO();
        usuarioInexistente.setEmail("noexiste@pintaauto.com");
        usuarioInexistente.setPassword("password");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioInexistente)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("Usuario no encontrado"));
    }

    @Test
    void testLogin_ConErrorInterno_DebeRetornarErrorServidor() throws Exception {
        // Given
        when(authService.login(any(LoginRequestDTO.class)))
                .thenThrow(new Exception("Error de base de datos"));

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(false))
                .andExpect(jsonPath("$.mensaje").value("Error interno del servidor"));
    }

    @Test
    void testVerifyToken_DebeRetornarTokenValido() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/auth/verify"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.exito").value(true))
                .andExpect(jsonPath("$.mensaje").value("Token válido"));
    }

    @Test
    void testLogin_ConContrasenaCorta_DebeRetornarErrorValidacion() throws Exception {
        // Given - Login con contraseña muy corta
        LoginRequestDTO loginContrasenaCorta = new LoginRequestDTO();
        loginContrasenaCorta.setEmail("admin@pintaauto.com");
        loginContrasenaCorta.setPassword("123"); // Contraseña muy corta

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginContrasenaCorta)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_ConEmailMuyLargo_DebeRetornarErrorValidacion() throws Exception {
        // Given - Login con email muy largo
        LoginRequestDTO loginEmailLargo = new LoginRequestDTO();
        String emailLargo = "a".repeat(250) + "@pintaauto.com"; // Email excesivamente largo
        loginEmailLargo.setEmail(emailLargo);
        loginEmailLargo.setPassword("admin123");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginEmailLargo)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_ConJSONMalformado_DebeRetornarError() throws Exception {
        // Given - JSON malformado
        String jsonMalformado = "{ email: 'admin@pintaauto.com', contrasena: 'admin123' }";

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMalformado))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_SinContentType_DebeRetornarError() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .content(objectMapper.writeValueAsString(loginRequestDTO)))
                .andExpect(status().isUnsupportedMediaType());
    }
}

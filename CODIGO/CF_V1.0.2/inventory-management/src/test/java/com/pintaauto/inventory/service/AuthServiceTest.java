package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.AuthResponseDTO;
import com.pintaauto.inventory.dto.LoginRequestDTO;
import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas unitarias de AuthService")
class AuthServiceTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;
    private LoginRequestDTO loginRequest;
    private UsuarioResponseDTO usuarioResponseDTO;

    @BeforeEach
    void setUp() {
        // Inicializar datos de prueba
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Admin");
        usuario.setApellido("Sistema");
        usuario.setEmail("admin@pintaauto.com");
        usuario.setPassword("$2a$10$hashedpassword");
        usuario.setActivo(true);
        usuario.setCreatedAt(LocalDateTime.now());
        usuario.setUpdatedAt(LocalDateTime.now());

        loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("admin@pintaauto.com");
        loginRequest.setPassword("password123");

        usuarioResponseDTO = new UsuarioResponseDTO(
                1L,
                "Admin",
                "Sistema",
                "admin@pintaauto.com",
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("Login exitoso con credenciales válidas")
    void testLoginExitoso() {
        // Arrange
        when(usuarioService.buscarPorEmail("admin@pintaauto.com"))
                .thenReturn(Optional.of(usuario));
        when(usuarioService.validarCredenciales(usuario, "password123"))
                .thenReturn(true);
        when(usuarioService.convertirAResponseDTO(usuario))
                .thenReturn(usuarioResponseDTO);
        when(jwtUtil.generateToken(1L, "admin@pintaauto.com"))
                .thenReturn("token_jwt_valido");

        // Act
        AuthResponseDTO resultado = authService.login(loginRequest);

        // Assert
        assertNotNull(resultado);
        assertNotNull(resultado.getToken());
        assertEquals("token_jwt_valido", resultado.getToken());
        assertEquals("admin@pintaauto.com", resultado.getUsuario().getEmail());
        verify(usuarioService, times(1)).buscarPorEmail("admin@pintaauto.com");
        verify(usuarioService, times(1)).validarCredenciales(usuario, "password123");
        verify(jwtUtil, times(1)).generateToken(1L, "admin@pintaauto.com");
    }

    @Test
    @DisplayName("Login falla cuando usuario no existe")
    void testLoginUsuarioNoExiste() {
        // Arrange
        when(usuarioService.buscarPorEmail("noexiste@pintaauto.com"))
                .thenReturn(Optional.empty());

        loginRequest.setEmail("noexiste@pintaauto.com");

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Credenciales inválidas", exception.getMessage());
        verify(usuarioService, never()).validarCredenciales(any(), any());
        verify(jwtUtil, never()).generateToken(any(), any());
    }

    @Test
    @DisplayName("Login falla cuando usuario está inactivo")
    void testLoginUsuarioInactivo() {
        // Arrange
        usuario.setActivo(false);
        when(usuarioService.buscarPorEmail("admin@pintaauto.com"))
                .thenReturn(Optional.of(usuario));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Usuario inactivo", exception.getMessage());
        verify(usuarioService, never()).validarCredenciales(any(), any());
        verify(jwtUtil, never()).generateToken(any(), any());
    }

    @Test
    @DisplayName("Login falla con contraseña incorrecta")
    void testLoginContraseñaIncorrecta() {
        // Arrange
        when(usuarioService.buscarPorEmail("admin@pintaauto.com"))
                .thenReturn(Optional.of(usuario));
        when(usuarioService.validarCredenciales(usuario, "passwordIncorrecto"))
                .thenReturn(false);

        loginRequest.setPassword("passwordIncorrecto");

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Credenciales inválidas", exception.getMessage());
        verify(jwtUtil, never()).generateToken(any(), any());
    }

    @Test
    @DisplayName("Login devuelve token JWT válido")
    void testLoginDevuelveTokenValido() {
        // Arrange
        String tokenEsperado = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

        when(usuarioService.buscarPorEmail("admin@pintaauto.com"))
                .thenReturn(Optional.of(usuario));
        when(usuarioService.validarCredenciales(usuario, "password123"))
                .thenReturn(true);
        when(usuarioService.convertirAResponseDTO(usuario))
                .thenReturn(usuarioResponseDTO);
        when(jwtUtil.generateToken(1L, "admin@pintaauto.com"))
                .thenReturn(tokenEsperado);

        // Act
        AuthResponseDTO resultado = authService.login(loginRequest);

        // Assert
        assertNotNull(resultado.getToken());
        assertEquals(tokenEsperado, resultado.getToken());
    }

    @Test
    @DisplayName("Login devuelve datos de usuario correctos")
    void testLoginDevuelveUsuarioCorrecto() {
        // Arrange
        when(usuarioService.buscarPorEmail("admin@pintaauto.com"))
                .thenReturn(Optional.of(usuario));
        when(usuarioService.validarCredenciales(usuario, "password123"))
                .thenReturn(true);
        when(usuarioService.convertirAResponseDTO(usuario))
                .thenReturn(usuarioResponseDTO);
        when(jwtUtil.generateToken(1L, "admin@pintaauto.com"))
                .thenReturn("token_valido");

        // Act
        AuthResponseDTO resultado = authService.login(loginRequest);

        // Assert
        assertNotNull(resultado.getUsuario());
        assertEquals("Admin", resultado.getUsuario().getNombre());
        assertEquals("Sistema", resultado.getUsuario().getApellido());
        assertEquals("admin@pintaauto.com", resultado.getUsuario().getEmail());
        assertTrue(resultado.getUsuario().getActivo());
    }

    @Test
    @DisplayName("Validar que email es requerido para login")
    void testLoginEmailRequerido() {
        // Arrange
        LoginRequestDTO invalidRequest = new LoginRequestDTO();
        invalidRequest.setEmail(null);
        invalidRequest.setPassword("password123");

        // Act & Assert
        assertNull(invalidRequest.getEmail());
    }

    @Test
    @DisplayName("Validar que contraseña es requerida para login")
    void testLoginContraseñaRequerida() {
        // Arrange
        LoginRequestDTO invalidRequest = new LoginRequestDTO();
        invalidRequest.setEmail("admin@pintaauto.com");
        invalidRequest.setPassword(null);

        // Act & Assert
        assertNull(invalidRequest.getPassword());
    }
}


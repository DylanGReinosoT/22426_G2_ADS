package com.pintaauto.inventory.util;

import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas unitarias de JwtUtil")
class JwtUtilTest {

    @InjectMocks
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        // Configurar valores mediante reflection
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", "my-super-secret-key-that-is-long-enough-for-hmac-sha256");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpiration", 86400000L); // 24 horas en milisegundos
    }

    @Test
    @DisplayName("Generar token JWT válido")
    void testGenerarTokenValido() {
        // Act
        String token = jwtUtil.generateToken(1L, "admin@pintaauto.com");

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.contains("."));
    }

    @Test
    @DisplayName("Token JWT debe tener tres partes (header.payload.signature)")
    void testTokenTieneTresPartes() {
        // Act
        String token = jwtUtil.generateToken(1L, "admin@pintaauto.com");

        // Assert
        String[] partes = token.split("\\.");
        assertEquals(3, partes.length);
    }

    @Test
    @DisplayName("Extraer userId del token")
    void testExtraerUserIdDelToken() {
        // Arrange
        Long userId = 123L;
        String email = "test@pintaauto.com";

        // Act
        String token = jwtUtil.generateToken(userId, email);
        Long userIdExtraido = jwtUtil.getUserIdFromToken(token);

        // Assert
        assertEquals(userId, userIdExtraido);
    }

    @Test
    @DisplayName("Extraer email del token")
    void testExtraerEmailDelToken() {
        // Arrange
        Long userId = 123L;
        String email = "test@pintaauto.com";

        // Act
        String token = jwtUtil.generateToken(userId, email);
        String emailExtraido = jwtUtil.getEmailFromToken(token);

        // Assert
        assertEquals(email, emailExtraido);
    }

    @Test
    @DisplayName("Validar token válido")
    void testValidarTokenValido() {
        // Arrange
        String token = jwtUtil.generateToken(1L, "admin@pintaauto.com");

        // Act
        boolean esValido = jwtUtil.validateToken(token);

        // Assert
        assertTrue(esValido);
    }

    @Test
    @DisplayName("Rechazar token inválido")
    void testValidarTokenInvalido() {
        // Arrange
        String tokenInvalido = "token.invalido.aqui";

        // Act & Assert
        assertThrows(JwtException.class, () -> {
            jwtUtil.validateToken(tokenInvalido);
        });
    }

    @Test
    @DisplayName("Rechazar token nulo")
    void testValidarTokenNulo() {
        // Act & Assert
        assertThrows(Exception.class, () -> {
            jwtUtil.validateToken(null);
        });
    }

    @Test
    @DisplayName("Rechazar token vacío")
    void testValidarTokenVacio() {
        // Act & Assert
        assertThrows(Exception.class, () -> {
            jwtUtil.validateToken("");
        });
    }

    @Test
    @DisplayName("Token con diferentes usuarios debe ser diferente")
    void testTokenesDiferentesParaUsuariosDiferentes() {
        // Act
        String token1 = jwtUtil.generateToken(1L, "usuario1@pintaauto.com");
        String token2 = jwtUtil.generateToken(2L, "usuario2@pintaauto.com");

        // Assert
        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("Generar múltiples tokens debe producir tokens únicos")
    void testGenerarMultiplesTokenesUnicos() {
        // Act
        String token1 = jwtUtil.generateToken(1L, "admin@pintaauto.com");
        String token2 = jwtUtil.generateToken(1L, "admin@pintaauto.com");

        // Assert
        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("Token debe contener userId en el payload")
    void testTokenContienUserIdEnPayload() {
        // Arrange
        Long userId = 42L;

        // Act
        String token = jwtUtil.generateToken(userId, "test@pintaauto.com");
        Long userIdExtraido = jwtUtil.getUserIdFromToken(token);

        // Assert
        assertEquals(userId, userIdExtraido);
    }

    @Test
    @DisplayName("Token debe contener email en las claims")
    void testTokenContienEmailEnClaims() {
        // Arrange
        String email = "user@pintaauto.com";

        // Act
        String token = jwtUtil.generateToken(1L, email);
        String emailExtraido = jwtUtil.getEmailFromToken(token);

        // Assert
        assertEquals(email, emailExtraido);
    }

    @Test
    @DisplayName("Tiempo de expiración debe ser correcto")
    void testTiempoExpiracion() {
        // Arrange
        long expiracionMs = 3600000L; // 1 hora
        ReflectionTestUtils.setField(jwtUtil, "jwtExpiration", expiracionMs);

        // Act
        String token = jwtUtil.generateToken(1L, "test@pintaauto.com");

        // Assert
        assertNotNull(token);
        assertTrue(jwtUtil.validateToken(token));
    }
}


package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas unitarias de UsuarioService")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private UsuarioResponseDTO responseDTO;

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

        responseDTO = new UsuarioResponseDTO(
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
    @DisplayName("Buscar usuario por email exitosamente")
    void testBuscarPorEmailExitoso() {
        // Arrange
        when(usuarioRepository.findByEmail("admin@pintaauto.com")).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> resultado = usuarioService.buscarPorEmail("admin@pintaauto.com");

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("Admin", resultado.get().getNombre());
        assertEquals("admin@pintaauto.com", resultado.get().getEmail());
        verify(usuarioRepository, times(1)).findByEmail("admin@pintaauto.com");
    }

    @Test
    @DisplayName("Buscar usuario por email no encontrado")
    void testBuscarPorEmailNoEncontrado() {
        // Arrange
        when(usuarioRepository.findByEmail("noexiste@pintaauto.com")).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> resultado = usuarioService.buscarPorEmail("noexiste@pintaauto.com");

        // Assert
        assertFalse(resultado.isPresent());
        verify(usuarioRepository, times(1)).findByEmail("noexiste@pintaauto.com");
    }

    @Test
    @DisplayName("Crear usuario administrador nuevo")
    void testCrearUsuarioAdminNuevo() {
        // Arrange
        when(usuarioRepository.existsByEmail("newadmin@pintaauto.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$10$encryptedpassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        Usuario resultado = usuarioService.crearUsuarioAdmin("Admin", "Nuevo", "newadmin@pintaauto.com", "password123");

        // Assert
        assertNotNull(resultado);
        assertEquals("Admin", resultado.getNombre());
        verify(usuarioRepository, times(1)).existsByEmail("newadmin@pintaauto.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Crear usuario administrador que ya existe retorna existente")
    void testCrearUsuarioAdminExistente() {
        // Arrange
        when(usuarioRepository.existsByEmail("admin@pintaauto.com")).thenReturn(true);
        when(usuarioRepository.findByEmail("admin@pintaauto.com")).thenReturn(Optional.of(usuario));

        // Act
        Usuario resultado = usuarioService.crearUsuarioAdmin("Admin", "Sistema", "admin@pintaauto.com", "password123");

        // Assert
        assertNotNull(resultado);
        assertEquals("Admin", resultado.getNombre());
        verify(usuarioRepository, times(1)).existsByEmail("admin@pintaauto.com");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Obtener todos los usuarios")
    void testObtenerTodos() {
        // Arrange
        Usuario usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setNombre("Usuario");
        usuario2.setApellido("Normal");
        usuario2.setEmail("usuario@pintaauto.com");
        usuario2.setActivo(true);

        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario, usuario2));

        // Act
        List<UsuarioResponseDTO> resultado = usuarioService.obtenerTodos();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Admin", resultado.get(0).getNombre());
        assertEquals("Usuario", resultado.get(1).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Obtener usuarios cuando no hay registros")
    void testObtenerTodosVacio() {
        // Arrange
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<UsuarioResponseDTO> resultado = usuarioService.obtenerTodos();

        // Assert
        assertNotNull(resultado);
        assertEquals(0, resultado.size());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Buscar usuario por ID existente")
    void testBuscarPorIdExistente() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> resultado = usuarioService.buscarPorId(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("Admin", resultado.get().getNombre());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Buscar usuario por ID no existente")
    void testBuscarPorIdNoExistente() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> resultado = usuarioService.buscarPorId(999L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(usuarioRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Eliminar usuario existente")
    void testEliminarUsuarioExistente() {
        // Arrange
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        doNothing().when(usuarioRepository).deleteById(1L);

        // Act
        usuarioService.eliminar(1L);

        // Assert
        verify(usuarioRepository, times(1)).existsById(1L);
        verify(usuarioRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Eliminar usuario no existente lanza excepción")
    void testEliminarUsuarioNoExistente() {
        // Arrange
        when(usuarioRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.eliminar(999L);
        });

        assertEquals("Usuario no encontrado con ID: 999", exception.getMessage());
        verify(usuarioRepository, never()).deleteById(999L);
    }

    @Test
    @DisplayName("Validar credenciales correctas")
    void testValidarCredencialesCorrectas() {
        // Arrange
        String passwordIngresado = "password123";
        when(passwordEncoder.matches(passwordIngresado, usuario.getPassword())).thenReturn(true);

        // Act
        boolean resultado = usuarioService.validarCredenciales(usuario, passwordIngresado);

        // Assert
        assertTrue(resultado);
        verify(passwordEncoder, times(1)).matches(passwordIngresado, usuario.getPassword());
    }

    @Test
    @DisplayName("Validar credenciales incorrectas")
    void testValidarCredencialesIncorrectas() {
        // Arrange
        String passwordIngresado = "passwordIncorrecto";
        when(passwordEncoder.matches(passwordIngresado, usuario.getPassword())).thenReturn(false);

        // Act
        boolean resultado = usuarioService.validarCredenciales(usuario, passwordIngresado);

        // Assert
        assertFalse(resultado);
        verify(passwordEncoder, times(1)).matches(passwordIngresado, usuario.getPassword());
    }

    @Test
    @DisplayName("Convertir Usuario a ResponseDTO")
    void testConvertirAResponseDTO() {
        // Act
        UsuarioResponseDTO resultado = usuarioService.convertirAResponseDTO(usuario);

        // Assert
        assertNotNull(resultado);
        assertEquals(usuario.getId(), resultado.getId());
        assertEquals(usuario.getNombre(), resultado.getNombre());
        assertEquals(usuario.getApellido(), resultado.getApellido());
        assertEquals(usuario.getEmail(), resultado.getEmail());
        assertEquals(usuario.getActivo(), resultado.getActivo());
    }

    @Test
    @DisplayName("Usuario activo debe ser verdadero")
    void testUsuarioActivoVerdadero() {
        // Arrange & Act
        Usuario usuarioActivo = new Usuario();
        usuarioActivo.setActivo(true);

        // Assert
        assertTrue(usuarioActivo.getActivo());
    }

    @Test
    @DisplayName("Usuario inactivo debe ser falso")
    void testUsuarioInactivoFalso() {
        // Arrange & Act
        Usuario usuarioInactivo = new Usuario();
        usuarioInactivo.setActivo(false);

        // Assert
        assertFalse(usuarioInactivo.getActivo());
    }
}


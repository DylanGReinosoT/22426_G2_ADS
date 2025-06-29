package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Buscar usuario por email
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // Crear usuario administrador inicial
    public Usuario crearUsuarioAdmin(String nombre, String apellido, String email, String password) {
        if (usuarioRepository.existsByEmail(email)) {
            return usuarioRepository.findByEmail(email).get();
        }

        Usuario admin = new Usuario();
        admin.setNombre(nombre);
        admin.setApellido(apellido);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setActivo(true);

        return usuarioRepository.save(admin);
    }

    // Validar credenciales
    public boolean validarCredenciales(Usuario usuario, String password) {
        return passwordEncoder.matches(password, usuario.getPassword());
    }

    // Convertir a DTO
    public UsuarioResponseDTO convertirAResponseDTO(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getActivo(),
                usuario.getCreatedAt(),
                usuario.getUpdatedAt()
        );
    }
}
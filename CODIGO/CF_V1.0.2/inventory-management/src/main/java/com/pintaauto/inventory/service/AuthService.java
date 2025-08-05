package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.AuthResponseDTO;
import com.pintaauto.inventory.dto.LoginRequestDTO;
import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        // Buscar usuario por email
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Credenciales inválidas");
        }

        Usuario usuario = usuarioOpt.get();

        // Verificar que el usuario esté activo
        if (!usuario.getActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        // Validar contraseña
        if (!usuarioService.validarCredenciales(usuario, loginRequest.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Generar token JWT
        String token = jwtUtil.generateToken(usuario.getId(), usuario.getEmail());

        // Convertir usuario a DTO
        UsuarioResponseDTO usuarioDTO = usuarioService.convertirAResponseDTO(usuario);

        return new AuthResponseDTO(usuarioDTO, token);
    }
}

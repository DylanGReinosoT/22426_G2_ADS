package com.pintaauto.inventory.controller;

import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Obtener todos los usuarios
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioResponseDTO>>> obtenerTodos() {
        // Suponiendo que tienes un método para obtener todos los usuarios
        List<UsuarioResponseDTO> usuarios = usuarioService.obtenerTodos();
        return ResponseEntity.ok(ApiResponse.success("Usuarios obtenidos correctamente", usuarios));
    }

    /**
     * Obtener usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> obtenerPorId(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioService.buscarPorId(id);
        if (usuarioOpt.isPresent()) {
            UsuarioResponseDTO usuarioDTO = usuarioService.convertirAResponseDTO(usuarioOpt.get());
            return ResponseEntity.ok(ApiResponse.success("Usuario encontrado", usuarioDTO));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Usuario no encontrado"));
        }
    }

    /**
     * Eliminar usuario por ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            usuarioService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Usuario eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
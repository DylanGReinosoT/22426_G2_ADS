package com.pintaauto.inventory.controller;

import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.AuthResponseDTO;
import com.pintaauto.inventory.dto.LoginRequestDTO;
import com.pintaauto.inventory.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Agregar temporalmente para debugging
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint de login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO loginRequest,
            BindingResult bindingResult) {

        try {
            // Validar errores de validación
            if (bindingResult.hasErrors()) {
                String errores = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getDefaultMessage())
                        .collect(Collectors.joining(", "));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Error de validación: " + errores));
            }

            AuthResponseDTO authResponse = authService.login(loginRequest);
            return ResponseEntity.ok(
                    ApiResponse.success("Login exitoso", authResponse)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Endpoint para verificar el estado del token
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyToken() {
        return ResponseEntity.ok(
                ApiResponse.success("Token válido")
        );
    }
}
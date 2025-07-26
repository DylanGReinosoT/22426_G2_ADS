package com.pintaauto.inventory.controller;

import com.pintaauto.inventory.dto.ClienteRequestDTO;
import com.pintaauto.inventory.dto.ClienteResponseDTO;
import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // Obtener todos los clientes
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClienteResponseDTO>>> obtenerTodos() {
        List<ClienteResponseDTO> clientes = clienteService.obtenerTodos();
        return ResponseEntity.ok(ApiResponse.success("Clientes obtenidos correctamente", clientes));
    }

    // Obtener cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteResponseDTO>> obtenerPorId(@PathVariable Long id) {
        try {
            ClienteResponseDTO cliente = clienteService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success("Cliente encontrado", cliente));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Crear nuevo cliente
    @PostMapping
    public ResponseEntity<ApiResponse<ClienteResponseDTO>> crear(
            @Valid @RequestBody ClienteRequestDTO requestDTO) {
        try {
            ClienteResponseDTO clienteCreado = clienteService.crear(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Cliente creado correctamente", clienteCreado));
        } catch (Exception e) {
            // El GlobalExceptionHandler se encargará de manejar las excepciones
            throw e;
        }
    }

    // Actualizar cliente
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteResponseDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequestDTO requestDTO) {
        try {
            ClienteResponseDTO clienteActualizado = clienteService.actualizar(id, requestDTO);
            return ResponseEntity.ok(ApiResponse.success("Cliente actualizado correctamente", clienteActualizado));
        } catch (Exception e) {
            // El GlobalExceptionHandler se encargará de manejar las excepciones
            throw e;
        }
    }

    // Eliminar cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            clienteService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Cliente eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
package com.pintaauto.inventory.controller;

import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.OrdenTrabajoRequestDTO;
import com.pintaauto.inventory.dto.OrdenTrabajoResponseDTO;
import com.pintaauto.inventory.service.OrdenTrabajoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenTrabajoController {

    @Autowired
    private OrdenTrabajoService ordenTrabajoService;

    // Obtener todas las órdenes de trabajo
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrdenTrabajoResponseDTO>>> obtenerTodas() {
        List<OrdenTrabajoResponseDTO> ordenes = ordenTrabajoService.obtenerTodas();
        return ResponseEntity.ok(ApiResponse.success("Órdenes obtenidas correctamente", ordenes));
    }

    // Obtener orden de trabajo por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrdenTrabajoResponseDTO>> obtenerPorId(@PathVariable Long id) {
        try {
            OrdenTrabajoResponseDTO orden = ordenTrabajoService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success("Orden encontrada", orden));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Crear nueva orden de trabajo
    @PostMapping
    public ResponseEntity<ApiResponse<OrdenTrabajoResponseDTO>> crear(
            @Valid @RequestBody OrdenTrabajoRequestDTO requestDTO,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errores = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error de validación: " + errores));
        }
        try {
            OrdenTrabajoResponseDTO ordenCreada = ordenTrabajoService.crear(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Orden creada correctamente", ordenCreada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Actualizar orden de trabajo
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrdenTrabajoResponseDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody OrdenTrabajoRequestDTO requestDTO,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errores = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error de validación: " + errores));
        }
        try {
            OrdenTrabajoResponseDTO ordenActualizada = ordenTrabajoService.actualizar(id, requestDTO);
            return ResponseEntity.ok(ApiResponse.success("Orden actualizada correctamente", ordenActualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Eliminar orden de trabajo
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            ordenTrabajoService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Orden eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Buscar órdenes por título
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<OrdenTrabajoResponseDTO>>> buscarPorTitulo(@RequestParam String titulo) {
        List<OrdenTrabajoResponseDTO> ordenes = ordenTrabajoService.buscarPorTitulo(titulo);
        return ResponseEntity.ok(ApiResponse.success("Búsqueda completada", ordenes));
    }

    // Buscar órdenes por usuario responsable
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<ApiResponse<List<OrdenTrabajoResponseDTO>>> buscarPorUsuario(@PathVariable Long usuarioId) {
        List<OrdenTrabajoResponseDTO> ordenes = ordenTrabajoService.buscarPorUsuario(usuarioId);
        return ResponseEntity.ok(ApiResponse.success("Órdenes del usuario obtenidas correctamente", ordenes));
    }
}
package com.pintaauto.inventory.controller;

import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.OrdenCompraRequestDTO;
import com.pintaauto.inventory.dto.OrdenCompraResponseDTO;
import com.pintaauto.inventory.service.OrdenCompraService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orden-compra")
public class OrdenCompraController {

    @Autowired
    private OrdenCompraService ordenCompraService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrdenCompraResponseDTO>>> obtenerTodas() {
        try {
            List<OrdenCompraResponseDTO> ordenes = ordenCompraService.obtenerTodas();
            return ResponseEntity.ok(ApiResponse.success("Órdenes de compra obtenidas correctamente", ordenes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener las órdenes de compra"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrdenCompraResponseDTO>> obtenerPorId(@PathVariable Long id) {
        try {
            OrdenCompraResponseDTO orden = ordenCompraService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success("Orden de compra encontrada", orden));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener la orden de compra"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrdenCompraResponseDTO>> crear(
            @Valid @RequestBody OrdenCompraRequestDTO requestDTO,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errores = bindingResult.getFieldErrors().stream()
                        .map(error -> error.getDefaultMessage())
                        .collect(Collectors.joining(", "));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Error de validación: " + errores));
            }
            OrdenCompraResponseDTO orden = ordenCompraService.crear(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Orden de compra creada correctamente", orden));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear la orden de compra"));
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<OrdenCompraResponseDTO>> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String nuevoEstado = body.get("estado");
            if (nuevoEstado == null || nuevoEstado.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("El campo 'estado' es obligatorio"));
            }
            OrdenCompraResponseDTO orden = ordenCompraService.cambiarEstado(id, nuevoEstado);
            return ResponseEntity.ok(ApiResponse.success("Estado actualizado correctamente", orden));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cambiar el estado"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            ordenCompraService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Orden de compra eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar la orden de compra"));
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generarPdf(@PathVariable Long id) {
        try {
            byte[] pdf = ordenCompraService.generarPdf(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=orden-compra-" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

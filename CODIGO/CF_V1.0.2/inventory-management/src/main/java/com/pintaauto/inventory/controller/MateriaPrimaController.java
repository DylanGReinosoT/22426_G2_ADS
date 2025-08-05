package com.pintaauto.inventory.controller;

import com.pintaauto.inventory.dto.ApiResponse;
import com.pintaauto.inventory.dto.MateriaPrimaRequestDTO;
import com.pintaauto.inventory.dto.MateriaPrimaResponseDTO;
import com.pintaauto.inventory.service.MateriaPrimaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/materia")
//@CrossOrigin(origins = "*")
public class MateriaPrimaController {

    @Autowired
    private MateriaPrimaService materiaPrimaService;

    /**
     * Obtiene todas las materias primas
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> obtenerTodas() {
        try {
            List<MateriaPrimaResponseDTO> materias = materiaPrimaService.obtenerTodas();

            // Envolver en un objeto para compatibilidad con el frontend
            Map<String, Object> datos = new HashMap<>();
            datos.put("materias", materias);

            return ResponseEntity.ok(
                    ApiResponse.success("Materias obtenidas correctamente", datos)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener la lista de materias"));
        }
    }

    /**
     * Obtiene una materia prima por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MateriaPrimaResponseDTO>> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<MateriaPrimaResponseDTO> materia = materiaPrimaService.obtenerPorId(id);

            if (materia.isPresent()) {
                return ResponseEntity.ok(
                        ApiResponse.success("Materia encontrada", materia.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Materia no encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener la materia"));
        }
    }

    /**
     * Crea una nueva materia prima
     */
    @PostMapping
    public ResponseEntity<ApiResponse<MateriaPrimaResponseDTO>> crear(
            @Valid @RequestBody MateriaPrimaRequestDTO requestDTO,
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

            MateriaPrimaResponseDTO materiaCreada = materiaPrimaService.crear(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Materia creada correctamente", materiaCreada));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear la materia"));
        }
    }

    /**
     * Actualiza una materia prima existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MateriaPrimaResponseDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody MateriaPrimaRequestDTO requestDTO,
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

            MateriaPrimaResponseDTO materiaActualizada = materiaPrimaService.actualizar(id, requestDTO);
            return ResponseEntity.ok(
                    ApiResponse.success("Materia actualizada correctamente", materiaActualizada)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar la materia"));
        }
    }

    /**
     * Elimina una materia prima
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        try {
            materiaPrimaService.eliminar(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Materia eliminada correctamente")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar la materia"));
        }
    }

    /**
     * Busca materias primas por nombre
     */
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<MateriaPrimaResponseDTO>>> buscarPorNombre(
            @RequestParam String nombre) {
        try {
            List<MateriaPrimaResponseDTO> materias = materiaPrimaService.buscarPorNombre(nombre);
            return ResponseEntity.ok(
                    ApiResponse.success("Búsqueda completada", materias)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al buscar materias"));
        }
    }
}

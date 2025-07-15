package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.MateriaPrimaRequestDTO;
import com.pintaauto.inventory.dto.MateriaPrimaResponseDTO;
import com.pintaauto.inventory.entity.MateriaPrima;
import com.pintaauto.inventory.repository.MateriaPrimaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MateriaPrimaService {

    @Autowired
    private MateriaPrimaRepository materiaPrimaRepository;

    // Obtener todas las materias primas
    @Transactional(readOnly = true)
    public List<MateriaPrimaResponseDTO> obtenerTodas() {
        List<MateriaPrima> materias = materiaPrimaRepository.findAll();
        return materias.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    // Obtener materia prima por ID
    @Transactional(readOnly = true)
    public Optional<MateriaPrimaResponseDTO> obtenerPorId(Long id) {
        return materiaPrimaRepository.findById(id)
                .map(this::convertirAResponseDTO);
    }

    // Crear nueva materia prima
    public MateriaPrimaResponseDTO crear(MateriaPrimaRequestDTO requestDTO) {
        // Validar que no existe una materia prima con el mismo nombre
        if (materiaPrimaRepository.existsByNombre(requestDTO.getNombre())) {
            throw new RuntimeException("La materia prima con el nombre '" + requestDTO.getNombre() + "' ya existe");
        }

        MateriaPrima materia = convertirAEntidad(requestDTO);
        MateriaPrima materiaGuardada = materiaPrimaRepository.save(materia);
        return convertirAResponseDTO(materiaGuardada);
    }

    // Actualizar materia prima
    public MateriaPrimaResponseDTO actualizar(Long id, MateriaPrimaRequestDTO requestDTO) {
        MateriaPrima materia = materiaPrimaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Materia prima no encontrada con ID: " + id));

        // Validar que no existe otra materia prima con el mismo nombre
        if (materiaPrimaRepository.existsByNombreAndIdNot(requestDTO.getNombre(), id)) {
            throw new RuntimeException("Ya existe otra materia prima con el nombre '" + requestDTO.getNombre() + "'");
        }

        // Actualizar campos (fechaIngreso no se actualiza por diseño)
        materia.setNombre(requestDTO.getNombre());
        materia.setUnidadMedida(requestDTO.getUnidadMedida());
        materia.setCantidad(requestDTO.getCantidad());
        materia.setDetalles(requestDTO.getDetalles());
        materia.setPrecioUnitario(requestDTO.getPrecioUnitario());

        MateriaPrima materiaActualizada = materiaPrimaRepository.save(materia);
        return convertirAResponseDTO(materiaActualizada);
    }

    // Eliminar materia prima
    public void eliminar(Long id) {
        if (!materiaPrimaRepository.existsById(id)) {
            throw new RuntimeException("Materia prima no encontrada con ID: " + id);
        }
        materiaPrimaRepository.deleteById(id);
    }

    // Buscar por nombre
    @Transactional(readOnly = true)
    public List<MateriaPrimaResponseDTO> buscarPorNombre(String nombre) {
        List<MateriaPrima> materias = materiaPrimaRepository.findByNombreContaining(nombre);
        return materias.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    // Métodos de conversión
    private MateriaPrimaResponseDTO convertirAResponseDTO(MateriaPrima materia) {
        return new MateriaPrimaResponseDTO(
                materia.getId(),
                materia.getNombre(),
                materia.getUnidadMedida(),
                materia.getCantidad(),
                materia.getDetalles(),
                materia.getPrecioUnitario(),
                materia.getFechaIngreso(),
                materia.getCreatedAt(),
                materia.getUpdatedAt()
        );
    }

    private MateriaPrima convertirAEntidad(MateriaPrimaRequestDTO requestDTO) {
        return new MateriaPrima(
                requestDTO.getNombre(),
                requestDTO.getUnidadMedida(),
                requestDTO.getCantidad(),
                requestDTO.getDetalles(),
                requestDTO.getPrecioUnitario()
        );
    }
}

package com.pintaauto.inventory.service;


import com.pintaauto.inventory.dto.*;
import com.pintaauto.inventory.entity.Cliente;
import com.pintaauto.inventory.entity.MateriaPrima;
import com.pintaauto.inventory.entity.OrdenTrabajo;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.repository.ClienteRepository;
import com.pintaauto.inventory.repository.MateriaPrimaRepository;
import com.pintaauto.inventory.service.UsuarioService;
import com.pintaauto.inventory.repository.OrdenTrabajoRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrdenTrabajoService{

    @Autowired
    UsuarioService usuarioService;
    @Autowired
    ClienteService clienteService;
    @Autowired
    ClienteRepository clienteRepository;
    @Autowired
    private OrdenTrabajoRepository ordenTrabajoRepository;

    // Inyecta el repositorio de MateriaPrima
    @Autowired
    private MateriaPrimaRepository materiaPrimaRepository;

    //Obtener todas la ordenes de trabajo
    @Transactional(readOnly = true)
    public List<OrdenTrabajoResponseDTO> obtenerTodas() {
        List<OrdenTrabajo> ordenes = ordenTrabajoRepository.findAll();
        return ordenes.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }


    // Obtener orden de trabajo por ID
    @Transactional(readOnly = true)
    public OrdenTrabajoResponseDTO obtenerPorId(Long id) {
        return ordenTrabajoRepository.findById(id)
                .map(this::convertirAResponseDTO)
                .orElseThrow(() -> new RuntimeException("Orden de trabajo no encontrada con ID: " + id));
    }

    // Crear nueva orden de trabajo
    public OrdenTrabajoResponseDTO crear(OrdenTrabajoRequestDTO requestDTO) {
        Usuario user = new Usuario();
        user = ordenTrabajoRepository.findUsuarioById(requestDTO.getUsuarioId());
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado con ID: " + requestDTO.getUsuarioId());
        }

        OrdenTrabajo ordenTrabajo = convertirAEntidad(requestDTO);
        // Guardar la nueva orden de trabajo
        OrdenTrabajo ordenGuardada = ordenTrabajoRepository.save(ordenTrabajo);

        return convertirAResponseDTO(ordenGuardada);
    }

    // Actualizar orden de trabajo
    public OrdenTrabajoResponseDTO actualizar(Long id, OrdenTrabajoRequestDTO requestDTO) {
        OrdenTrabajo ordenTrabajo = ordenTrabajoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden de trabajo no encontrada con ID: " + id));

        // Actualizar campos de la orden de trabajo
        ordenTrabajo.setTitulo(requestDTO.getTitulo());
        ordenTrabajo.setDescripcion(requestDTO.getDescripcion());
        // No actualizamos usuario ni materias primas, asumiendo que no cambian

        // Guardar la orden de trabajo actualizada
        OrdenTrabajo ordenActualizada = ordenTrabajoRepository.save(ordenTrabajo);

        return convertirAResponseDTO(ordenActualizada);
    }

    // Eliminar orden de trabajo
    public void eliminar(Long id) {
        if (!ordenTrabajoRepository.existsById(id)) {
            throw new RuntimeException("Orden de trabajo no encontrada con ID: " + id);
        }
        ordenTrabajoRepository.deleteById(id);
    }

    // Buscar orden de trabajo por titulo
    @Transactional(readOnly = true)
    public List<OrdenTrabajoResponseDTO> buscarPorTitulo(String titulo) {
        List<OrdenTrabajo> ordenes = ordenTrabajoRepository.findByTituloContainingIgnoreCase(titulo);
        return ordenes.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    //Buscar ordenes de trabajo por usuario
    @Transactional(readOnly = true)
    public List<OrdenTrabajoResponseDTO> buscarPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));
        List<OrdenTrabajo> ordenes = ordenTrabajoRepository.findByUsuario(usuario);
        return ordenes.stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    private OrdenTrabajoResponseDTO convertirAResponseDTO(OrdenTrabajo ordenTrabajo) {
        // Suponiendo que tienes un método para convertir Usuario a UsuarioResponseDTO
        UsuarioResponseDTO usuarioDTO = usuarioService.convertirAResponseDTO(ordenTrabajo.getUsuario());

        // Suponiendo que tienes un método para convertir Cliente a ClienteResponseDTO
        ClienteResponseDTO clienteDTO = clienteService.convertirAResponseDTO(ordenTrabajo.getCliente());

        // Suponiendo que tienes un método para convertir MateriaPrima a MateriaPrimaResponseDTO
        List<MateriaPrimaResponseDTO> materiasPrimasDTO = ordenTrabajo.getMateriasPrimas().stream()
            .map(this::convertirMateriaPrimaAResponseDTO)
            .collect(Collectors.toList());

        return new OrdenTrabajoResponseDTO(
            ordenTrabajo.getId(),
            ordenTrabajo.getTitulo(),
            ordenTrabajo.getDescripcion(),
            ordenTrabajo.getFechaCreacion(),
            ordenTrabajo.getFechaFinalizacion(),
            ordenTrabajo.getHoraCreacion(),
            ordenTrabajo.getHoraFinalizacion(),
            usuarioDTO,
            clienteDTO,
            materiasPrimasDTO
        );
    }

    // Implementa este metodo según tu MateriaPrimaResponseDTO
    private MateriaPrimaResponseDTO convertirMateriaPrimaAResponseDTO(MateriaPrima materiaPrima) {
        // Mapea los campos necesarios
        return new MateriaPrimaResponseDTO(
            materiaPrima.getId(),
            materiaPrima.getNombre(),
            materiaPrima.getUnidadMedida(),
            materiaPrima.getCantidad(),
            materiaPrima.getDetalles(),
            materiaPrima.getPrecioUnitario(),
            materiaPrima.getFechaIngreso(),
            materiaPrima.getCreatedAt(),
            materiaPrima.getUpdatedAt()
        );
    }

    private OrdenTrabajo convertirAEntidad(OrdenTrabajoRequestDTO requestDTO){
        Usuario user = new Usuario();
        // En tu servicio
        Cliente cliente = new Cliente();
        user = ordenTrabajoRepository.findUsuarioById(requestDTO.getUsuarioId());
        // Recuperar todas las materias primas por sus IDs
        cliente = ordenTrabajoRepository.findClienteById(requestDTO.getClienteId());
        List<MateriaPrima> materiasPrimas = materiaPrimaRepository.findAllById(requestDTO.getMateriasPrimasIds());
        return new OrdenTrabajo(
            requestDTO.getTitulo(),
            requestDTO.getDescripcion(),
            user,
            cliente,
            materiasPrimas
        );
    }
}


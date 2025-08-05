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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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


    @Transactional
    // Crear nueva orden de trabajo
    public OrdenTrabajoResponseDTO crear(OrdenTrabajoRequestDTO requestDTO) {
        Usuario user = new Usuario();
        Map<Long, Double> materiasUsadas = requestDTO.getMateriasPrimasYcantidades();
        user = ordenTrabajoRepository.findUsuarioById(requestDTO.getUsuarioId());
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado con ID: " + requestDTO.getUsuarioId());
        }
        for (Map.Entry<Long, Double> entrada : materiasUsadas.entrySet()){
            Long materiaPrimaId = entrada.getKey();
            Double cantidadUsada = entrada.getValue();

            // Verificar si la materia prima existe
            MateriaPrima materiaPrima = materiaPrimaRepository.findById(materiaPrimaId)
                    .orElseThrow(() -> new RuntimeException("Materia prima no encontrada con ID: " + materiaPrimaId));

            // Verificar si hay suficiente cantidad disponible
            if (materiaPrima.getCantidad() < cantidadUsada) {
                throw new RuntimeException("No hay suficiente cantidad de la materia prima '" + materiaPrima.getNombre() + "'");
            }

            // Actualizar la cantidad de la materia prima
            materiaPrima.setCantidad(materiaPrima.getCantidad() - cantidadUsada);
            materiaPrimaRepository.save(materiaPrima);
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
        ordenTrabajo.setVehiculo(requestDTO.getVehiculo());
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
        //  convertir Usuario a UsuarioResponseDTO
        UsuarioResponseDTO usuarioDTO = usuarioService.convertirAResponseDTO(ordenTrabajo.getUsuario());

        // convertir Cliente a ClienteResponseDTO
        ClienteResponseDTO clienteDTO = clienteService.convertirAResponseDTO(ordenTrabajo.getCliente());

        // convertir MateriaPrima a MateriaPrimaResponseDTO
        Map<Long, Double> materiasPrimasYcantidades = new HashMap<>();
        for (Map.Entry<MateriaPrima, Double> entry : ordenTrabajo.getMateriasPrimasYcantidades().entrySet()) {
            materiasPrimasYcantidades.put(entry.getKey().getId(), entry.getValue());
        }
        Double valorMateriales = calcularValorMateriales(materiasPrimasYcantidades);
        Map<MateriaPrima, Double> materiasPrimas = ordenTrabajo.getMateriasPrimasYcantidades().entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));


        return new OrdenTrabajoResponseDTO(
            ordenTrabajo.getId(),
            ordenTrabajo.getTitulo(),
            ordenTrabajo.getDescripcion(),
            ordenTrabajo.getVehiculo(),
            ordenTrabajo.getFechaCreacion(),
            ordenTrabajo.getFechaFinalizacion(),
            ordenTrabajo.getHoraCreacion(),
            ordenTrabajo.getHoraFinalizacion(),
            usuarioDTO,
            clienteDTO,
            materiasPrimasYcantidades,
            valorMateriales
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

    public Double calcularValorMateriales(Map<Long, Double> idsYcantidades) {
        return idsYcantidades.entrySet().stream()
                .mapToDouble(entry -> {
                    MateriaPrima materia = materiaPrimaRepository.findById(entry.getKey())
                            .orElseThrow(() -> new RuntimeException("Materia prima no encontrada con ID: " + entry.getKey()));
                    return materia.getPrecioUnitario().doubleValue() * entry.getValue();
                })
                .sum();
    }


    private OrdenTrabajo convertirAEntidad(OrdenTrabajoRequestDTO requestDTO){
        Usuario user = new Usuario();
        // En tu servicio
        Cliente cliente = new Cliente();
        user = ordenTrabajoRepository.findUsuarioById(requestDTO.getUsuarioId());
        // Recuperar todas las materias primas por sus IDs
        cliente = ordenTrabajoRepository.findClienteById(requestDTO.getClienteId());
//        Map<MateriaPrima, Double> materiasPrimasYcantidades = requestDTO.getMateriasPrimasYcantidades();
        Map<Long, Double> idsYcantidades = requestDTO.getMateriasPrimasYcantidades(); // tu mapa de entrada
        Map<MateriaPrima, Double> materiasPrimasYcantidades = new HashMap<>();

        for (Map.Entry<Long, Double> entry : idsYcantidades.entrySet()) {
            MateriaPrima materia = materiaPrimaRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Materia prima no encontrada con ID: " + entry.getKey()));
            materiasPrimasYcantidades.put(materia, entry.getValue());
        }
        Double valorMateriales = calcularValorMateriales(requestDTO.getMateriasPrimasYcantidades());
        return new OrdenTrabajo(
            requestDTO.getTitulo(),
            requestDTO.getDescripcion(),
            requestDTO.getVehiculo(),
            user,
            cliente,
            materiasPrimasYcantidades,
            valorMateriales
        );
    }

}


package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.ClienteRequestDTO;
import com.pintaauto.inventory.dto.ClienteResponseDTO;
import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.entity.Cliente;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.repository.ClienteRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<ClienteResponseDTO> obtenerTodos() {
        return clienteRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ClienteResponseDTO obtenerPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return toResponseDTO(cliente);
    }

    // se hace el uso de @Valid para validar el DTO con las anotaciones de validación
    public ClienteResponseDTO crear(@Valid @RequestBody ClienteRequestDTO requestDTO) {
        Cliente cliente = toEntity(requestDTO);
        // Validar que cédula no se repita
        if (clienteRepository.existsByCedula(cliente.getCedula())) {
            throw new RuntimeException("Ya existe un cliente con la cédula proporcionada");
        }
        //validar que el email no se repita
        if (clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new RuntimeException("Ya existe un cliente con el email proporcionado");
        }
        Cliente guardado = clienteRepository.save(cliente);
        return toResponseDTO(guardado);
    }

    public ClienteResponseDTO actualizar(Long id, ClienteRequestDTO requestDTO) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        cliente.setNombre(requestDTO.getNombre());
        cliente.setApellido(requestDTO.getApellido());
        cliente.setCedula(requestDTO.getCedula());
        cliente.setFechaNacimiento(requestDTO.getFechaNacimiento());
        cliente.setTelefono(requestDTO.getTelefono());
        cliente.setEmail(requestDTO.getEmail());
        cliente.setDireccion(requestDTO.getDireccion());
        Cliente actualizado = clienteRepository.save(cliente);
        return toResponseDTO(actualizado);
    }

    public void eliminar(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
        }
        clienteRepository.deleteById(id);
    }

    // Métodos auxiliares para conversión
    private ClienteResponseDTO toResponseDTO(Cliente cliente) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setApellido(cliente.getApellido());
        dto.setCedula(cliente.getCedula());
        dto.setFechaNacimiento(cliente.getFechaNacimiento());
        dto.setTelefono(cliente.getTelefono());
        dto.setEmail(cliente.getEmail());
        dto.setDireccion(cliente.getDireccion());
        return dto;
    }

    private Cliente toEntity(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setApellido(dto.getApellido());
        cliente.setCedula(dto.getCedula());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        cliente.setDireccion(dto.getDireccion());
        return cliente;
    }

    // Convertir a DTO
    public ClienteResponseDTO convertirAResponseDTO(Cliente cliente) {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getApellido(),
                cliente.getCedula(),
                cliente.getFechaNacimiento(),
                cliente.getTelefono(),
                cliente.getEmail(),
                cliente.getDireccion()
        );
    }
}
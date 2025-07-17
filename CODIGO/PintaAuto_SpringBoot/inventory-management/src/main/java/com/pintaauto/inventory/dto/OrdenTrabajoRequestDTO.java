package com.pintaauto.inventory.dto;

import com.pintaauto.inventory.entity.Usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class OrdenTrabajoRequestDTO {

    @NotBlank(message = "El título no puede estar vacío")
    @Size(min = 5, max = 80, message = "El título debe tener entre 5 y 80 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(max = 255, message = "La descripción debe tener un máximo de 255 caracteres")
    private String descripcion;

    @NotBlank(message = "la descripcion de vehiculo no puede estar vacío")
    @Size(max = 255, message = "La descripcion de vehiculo debe tener un máximo de 255 caracteres")
    private String vehiculo;

    @NotNull(message = "El usuario responsable es obligatorio")
    private Long usuarioId;

    @NotNull(message = "El cliente es obligatorio")
    private Long clienteId;

    @NotNull(message = "Debe especificar al menos una materia prima")
    private List<Long> materiasPrimasIds;

    // Constructores


    public OrdenTrabajoRequestDTO(String titulo, String descripcion, String vehiculo, Long usuarioId, Long clienteId, List<Long> materiasPrimasIds) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.vehiculo = vehiculo;
        this.usuarioId = usuarioId;
        this.clienteId = clienteId;
        this.materiasPrimasIds = materiasPrimasIds;
    }

    // Getters y setters
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getVehiculo() { return vehiculo; }
    public void setVehiculo(String vehiculo) { this.vehiculo = vehiculo; }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }

    public List<Long> getMateriasPrimasIds() { return materiasPrimasIds; }
    public void setMateriasPrimasIds(List<Long> materiasPrimasIds) { this.materiasPrimasIds = materiasPrimasIds; }
}
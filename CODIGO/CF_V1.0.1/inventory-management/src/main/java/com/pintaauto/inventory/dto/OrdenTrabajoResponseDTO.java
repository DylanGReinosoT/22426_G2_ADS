package com.pintaauto.inventory.dto;

import com.pintaauto.inventory.entity.MateriaPrima;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public class OrdenTrabajoResponseDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private String vehiculo;
    private LocalDateTime fechaCreacion;
    private LocalTime fechaFinalizacion;
    private LocalTime horaCreacion;
    private LocalTime horaFinalizacion;
    private UsuarioResponseDTO usuario;
    private ClienteResponseDTO cliente;
    private Map<Long, Double> materiasPrimasYcantidades;
    private Double valorMateriales;

    // Constructores
    
    public OrdenTrabajoResponseDTO() {}

    public OrdenTrabajoResponseDTO(Long id,
                                   String titulo,
                                   String descripcion,
                                   String vehiculo,
                                   LocalDateTime fechaCreacion,
                                   LocalTime fechaFinalizacion,
                                   LocalTime horaCreacion,
                                   LocalTime horaFinalizacion,
                                   UsuarioResponseDTO usuario,
                                   ClienteResponseDTO cliente,
                                   Map<Long, Double> materiasPrimasYcantidades,
                                   Double valorMateriales) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.vehiculo = vehiculo;
        this.fechaCreacion = fechaCreacion;
        this.fechaFinalizacion = fechaFinalizacion;
        this.horaCreacion = horaCreacion;
        this.horaFinalizacion = horaFinalizacion;
        this.usuario = usuario;
        this.cliente = cliente;
        this.materiasPrimasYcantidades = materiasPrimasYcantidades;
        this.valorMateriales = valorMateriales;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getVehiculo() {return vehiculo;}
    public void setVehiculo(String vehiculo) { this.vehiculo = vehiculo;}

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalTime getFechaFinalizacion() { return fechaFinalizacion; }
    public void setFechaFinalizacion(LocalTime fechaFinalizacion) { this.fechaFinalizacion = fechaFinalizacion; }

    public LocalTime getHoraCreacion() { return horaCreacion; }
    public void setHoraCreacion(LocalTime horaCreacion) { this.horaCreacion = horaCreacion; }

    public LocalTime getHoraFinalizacion() { return horaFinalizacion; }
    public void setHoraFinalizacion(LocalTime horaFinalizacion) { this.horaFinalizacion = horaFinalizacion; }

    public UsuarioResponseDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioResponseDTO usuario) { this.usuario = usuario; }

    public ClienteResponseDTO getCliente() { return cliente; }
    public void setCliente(ClienteResponseDTO cliente) { this.cliente = cliente; }

    public Map<Long, Double> getMateriasPrimasYcantidades() {
        return materiasPrimasYcantidades;
    }

    public void setMateriasPrimasYcantidades(Map<Long, Double> materiasPrimasYcantidades) {
        this.materiasPrimasYcantidades = materiasPrimasYcantidades;
    }

    public Double getValorMateriales() {
        return valorMateriales;
    }

    public void setValorMateriales(Double valorMateriales) {
        this.valorMateriales = valorMateriales;
    }
}
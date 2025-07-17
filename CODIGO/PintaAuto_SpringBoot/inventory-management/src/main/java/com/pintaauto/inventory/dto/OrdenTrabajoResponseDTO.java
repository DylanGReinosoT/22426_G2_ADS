package com.pintaauto.inventory.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

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
    private List<MateriaPrimaResponseDTO> materiasPrimas;

    // Constructores


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
                                   List<MateriaPrimaResponseDTO> materiasPrimas) {
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
        this.materiasPrimas = materiasPrimas;
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

    public List<MateriaPrimaResponseDTO> getMateriasPrimas() { return materiasPrimas; }
    public void setMateriasPrimas(List<MateriaPrimaResponseDTO> materiasPrimas) { this.materiasPrimas = materiasPrimas; }
}
package com.pintaauto.inventory.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class OrdenCompraResponseDTO {

    private Long id;
    private MateriaPrimaResponseDTO materiaPrima;
    private Double cantidadSolicitada;
    private String proveedor;
    private String estado;
    private Double precioTotal;
    private String observaciones;
    private UsuarioResponseDTO usuario;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaCreacion;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaActualizacion;

    // Constructores
    public OrdenCompraResponseDTO() {}

    public OrdenCompraResponseDTO(Long id, MateriaPrimaResponseDTO materiaPrima,
                                   Double cantidadSolicitada, String proveedor,
                                   String estado, Double precioTotal, String observaciones,
                                   UsuarioResponseDTO usuario, LocalDateTime fechaCreacion,
                                   LocalDateTime fechaActualizacion) {
        this.id = id;
        this.materiaPrima = materiaPrima;
        this.cantidadSolicitada = cantidadSolicitada;
        this.proveedor = proveedor;
        this.estado = estado;
        this.precioTotal = precioTotal;
        this.observaciones = observaciones;
        this.usuario = usuario;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MateriaPrimaResponseDTO getMateriaPrima() { return materiaPrima; }
    public void setMateriaPrima(MateriaPrimaResponseDTO materiaPrima) { this.materiaPrima = materiaPrima; }

    public Double getCantidadSolicitada() { return cantidadSolicitada; }
    public void setCantidadSolicitada(Double cantidadSolicitada) { this.cantidadSolicitada = cantidadSolicitada; }

    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Double getPrecioTotal() { return precioTotal; }
    public void setPrecioTotal(Double precioTotal) { this.precioTotal = precioTotal; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public UsuarioResponseDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioResponseDTO usuario) { this.usuario = usuario; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}

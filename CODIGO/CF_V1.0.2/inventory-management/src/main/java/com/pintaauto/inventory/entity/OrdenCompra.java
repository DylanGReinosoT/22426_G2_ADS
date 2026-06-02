package com.pintaauto.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "orden_compra")
public class OrdenCompra {

    public enum Estado {
        PENDIENTE, APROBADA, RECIBIDA, CANCELADA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La materia prima es obligatoria")
    @ManyToOne
    @JoinColumn(name = "materia_prima_id", nullable = false)
    private MateriaPrima materiaPrima;

    @NotNull(message = "La cantidad solicitada es obligatoria")
    @Min(value = 1, message = "La cantidad solicitada debe ser mayor a 0")
    @Column(name = "cantidad_solicitada", nullable = false)
    private Double cantidadSolicitada;

    @NotBlank(message = "El proveedor no puede estar vacío")
    @Size(max = 150, message = "El proveedor no puede exceder los 150 caracteres")
    @Column(nullable = false, length = 150)
    private String proveedor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.PENDIENTE;

    @Column(name = "precio_total")
    private Double precioTotal;

    @Size(max = 500, message = "Las observaciones no pueden exceder los 500 caracteres")
    @Column(length = 500)
    private String observaciones;

    @NotNull(message = "El usuario es obligatorio")
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", nullable = false)
    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

    // Constructores
    public OrdenCompra() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MateriaPrima getMateriaPrima() { return materiaPrima; }
    public void setMateriaPrima(MateriaPrima materiaPrima) { this.materiaPrima = materiaPrima; }

    public Double getCantidadSolicitada() { return cantidadSolicitada; }
    public void setCantidadSolicitada(Double cantidadSolicitada) { this.cantidadSolicitada = cantidadSolicitada; }

    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }

    public Double getPrecioTotal() { return precioTotal; }
    public void setPrecioTotal(Double precioTotal) { this.precioTotal = precioTotal; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}

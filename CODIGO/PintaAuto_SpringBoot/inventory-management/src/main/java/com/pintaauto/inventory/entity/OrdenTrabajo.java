package com.pintaauto.inventory.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name= "orden_trabajo")
public class OrdenTrabajo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotBlank(message = "El titulo no puede estar vacío")
    @Size(min = 5, max = 80, message = "El nombre no puede exceder los 80 caracteres")
    @Column(nullable = false, length = 80)
    String titulo;

    @NotBlank(message = "La descripcion no puede estar vacío")
    @Size(max = 255, message = "La descripcion debe tener un máximo de 255 caracteres")
    @Column(nullable = false)
    String descripcion;

    @NotBlank(message = "la descripcion de vehiculo no puede estar vacío")
    @Size(max = 255, message = "La descripcion de vehiculo debe tener un máximo de 255 caracteres")
    String vehiculo;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_finalizacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalTime fechaFinalizacion;

    @Column(name = "hora_creacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalTime horaCreacion;

    @Column(name = "hora_finalizacion", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalTime horaFinalizacion;

    // Relación muchos a uno con Usuario (responsable)
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Relación muchos a uno con Cliente (cliente asociado)
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ElementCollection
    @CollectionTable(
            name = "orden_trabajo_materia_cantidades",
            joinColumns = @JoinColumn(name = "orden_trabajo_id")
    )
    @MapKeyColumn(name = "materia_prima_id")
    @Column(name = "cantidad_usada")
    private Map<MateriaPrima, Double> materiasPrimasYcantidades = new HashMap<>();

    @Column(name= "valor_materiales")
    private Double valorMateriales;


    // Constructores

    public OrdenTrabajo() {}
    public OrdenTrabajo(
                        String titulo,
                        String descripcion,
                        String vehiculo,
                        Usuario usuario,
                        Cliente cliente,
                        Map<MateriaPrima, Double> materiasPrimasYcantidades,
                        Double valorMateriales) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.vehiculo = vehiculo;
        this.usuario = usuario;
        this.cliente = cliente;
        this.materiasPrimasYcantidades = materiasPrimasYcantidades;
        this.valorMateriales = valorMateriales;
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getVehiculo() {
        return vehiculo;
    }

    public void setVehiculo(String vehiculo) {
        this.vehiculo = vehiculo;
    }


    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalTime getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(LocalTime fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public LocalTime getHoraCreacion() {
        return horaCreacion;
    }

    public void setHoraCreacion(LocalTime horaCreacion) {
        this.horaCreacion = horaCreacion;
    }

    public LocalTime getHoraFinalizacion() {
        return horaFinalizacion;
    }

    public void setHoraFinalizacion(LocalTime horaFinalizacion) {
        this.horaFinalizacion = horaFinalizacion;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Map<MateriaPrima, Double> getMateriasPrimasYcantidades() {
        return materiasPrimasYcantidades;
    }

    public void setMateriasPrimasYcantidades(Map<MateriaPrima, Double> materiasPrimasYcantidades) {
        this.materiasPrimasYcantidades = materiasPrimasYcantidades;
    }
}

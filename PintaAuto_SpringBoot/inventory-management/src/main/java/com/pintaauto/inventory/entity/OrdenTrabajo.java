package com.pintaauto.inventory.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

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

    // Relación muchos a muchos con MateriaPrima (materia prima utilizada)
    @ManyToMany
    @JoinTable(
        name = "orden_trabajo_materia_prima",
        joinColumns = @JoinColumn(name = "orden_trabajo_id"),
        inverseJoinColumns = @JoinColumn(name = "materia_prima_id")
    )
    private List<MateriaPrima> materiasPrimas;

    // Constructores

    public OrdenTrabajo() {}
    public OrdenTrabajo(
                        String titulo,
                        String descripcion,
                        Usuario usuario,
                        List<MateriaPrima> materiasPrimas) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.usuario = usuario;
        this.materiasPrimas = materiasPrimas;
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

    public List<MateriaPrima> getMateriasPrimas() {
        return materiasPrimas;
    }

    public void setMateriasPrimas(List<MateriaPrima> materiasPrimas) {
        this.materiasPrimas = materiasPrimas;
    }
}

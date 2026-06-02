package com.pintaauto.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class OrdenCompraRequestDTO {

    @NotNull(message = "El ID de la materia prima es obligatorio")
    private Long materiaPrimaId;

    @NotNull(message = "La cantidad solicitada es obligatoria")
    @Min(value = 1, message = "La cantidad solicitada debe ser mayor a 0")
    private Double cantidadSolicitada;

    @NotBlank(message = "El proveedor no puede estar vacío")
    @Size(max = 150, message = "El proveedor no puede exceder los 150 caracteres")
    private String proveedor;

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @Size(max = 500, message = "Las observaciones no pueden exceder los 500 caracteres")
    private String observaciones;

    // Constructores
    public OrdenCompraRequestDTO() {}

    // Getters y Setters
    public Long getMateriaPrimaId() { return materiaPrimaId; }
    public void setMateriaPrimaId(Long materiaPrimaId) { this.materiaPrimaId = materiaPrimaId; }

    public Double getCantidadSolicitada() { return cantidadSolicitada; }
    public void setCantidadSolicitada(Double cantidadSolicitada) { this.cantidadSolicitada = cantidadSolicitada; }

    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}

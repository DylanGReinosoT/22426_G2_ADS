package com.pintaauto.inventory.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class MateriaPrimaRequestDTO {

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 3, max = 80, message = "El nombre debe tener entre 3 y 80 caracteres")
    private String nombre;

    @NotBlank(message = "La unidad de medida no puede estar vacía")
    private String unidadMedida;

    @NotNull(message = "La cantidad no puede estar vacía")
    @Min(value = 0, message = "La cantidad debe ser mayor o igual a 0")
    private Double cantidad;

    @NotBlank(message = "Los detalles no pueden estar vacíos")
    @Size(max = 255, message = "Los detalles deben tener un máximo de 255 caracteres")
    private String detalles;

    @NotNull(message = "El precio unitario no puede estar vacío")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio unitario debe ser mayor a 0")
    private BigDecimal precioUnitario;

    // Constructores
    public MateriaPrimaRequestDTO() {}

    public MateriaPrimaRequestDTO(String nombre, String unidadMedida, Double cantidad,
                                  String detalles, BigDecimal precioUnitario) {
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.cantidad = cantidad;
        this.detalles = detalles;
        this.precioUnitario = precioUnitario;
    }

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }

    public String getDetalles() { return detalles; }
    public void setDetalles(String detalles) { this.detalles = detalles; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
}

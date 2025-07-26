package com.pintaauto.inventory.dto;

public class MateriaPrimaConCantidadDTO {
    private Long id;
    private String nombre;
    private String unidadMedida;
    private Double cantidadUsada;
    private Double precioUnitario;
    private String detalles;

    public MateriaPrimaConCantidadDTO() {}

    public MateriaPrimaConCantidadDTO(Long id, String nombre, String unidadMedida,
                                      Double cantidadUsada, Double precioUnitario, String detalles) {
        this.id = id;
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.cantidadUsada = cantidadUsada;
        this.precioUnitario = precioUnitario;
        this.detalles = detalles;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public Double getCantidadUsada() { return cantidadUsada; }
    public void setCantidadUsada(Double cantidadUsada) { this.cantidadUsada = cantidadUsada; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }

    public String getDetalles() { return detalles; }
    public void setDetalles(String detalles) { this.detalles = detalles; }
}
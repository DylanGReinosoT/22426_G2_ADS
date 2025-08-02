package com.pintaauto.inventory.dto;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public class ItemsReporteFechasDTO {
    private int idOrden;
    private String cliente;
    private String usuario;
    private LocalDateTime fechaCreacion;
    private List<MateriaPrimaReporteDTO> materiales;
    private Double valorMateriales;


    public ItemsReporteFechasDTO() {
        // Default constructor
    }
    public ItemsReporteFechasDTO(int idOrden,
                                 String cliente,
                                 String usuario,
                                 LocalDateTime fechaCreacion,
                                 List<MateriaPrimaReporteDTO> materiales) {
        this.idOrden = idOrden;
        this.cliente = cliente;
        this.usuario = usuario;
        this.fechaCreacion = fechaCreacion;
        this.materiales = materiales;
    }

    public int getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(int idOrden) {
        this.idOrden = idOrden;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }


    public List<MateriaPrimaReporteDTO> getMateriales() {
        return materiales;
    }

    public void setMateriales(List<MateriaPrimaReporteDTO> materiales) {
        this.materiales = materiales;
    }

    public Double getValorMateriales() {
        return valorMateriales;
    }

    public void setValorMateriales(Double valorMateriales) {
        this.valorMateriales = valorMateriales;
    }
}

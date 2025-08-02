package com.pintaauto.inventory.dto;

import java.util.Date;
import java.util.List;

public class ItemsReporteFechasDTO {
    private Long idOrden;
    private String cliente;
    private String usuario;
    private Date fechaCreacion;
    private Date fechaFinalizacion;
    private List<MateriaPrimaReporteDTO> materiales;
    private Double valorMateriales;


    public ItemsReporteFechasDTO() {
        // Default constructor
    }
    public ItemsReporteFechasDTO(Long idOrden,
                                 String cliente,
                                 String usuario,
                                 Date fechaCreacion,
                                 Date fechaFinalizacion,
                                 List<MateriaPrimaReporteDTO> materiales) {
        this.idOrden = idOrden;
        this.cliente = cliente;
        this.usuario = usuario;
        this.fechaCreacion = fechaCreacion;
        this.fechaFinalizacion = fechaFinalizacion;
        this.materiales = materiales;
    }

    public Long getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Long idOrden) {
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

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Date getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(Date fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
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

package com.pintaauto.inventory.entity;

import com.pintaauto.inventory.dto.ItemsReporteFechasDTO;

import java.util.List;

public class ReporteFechas {
    private int id;
    private List<ItemsReporteFechasDTO> ordenes;
    private Double totalMateriales;

    public ReporteFechas() {
        // Default constructor
    }

    public ReporteFechas(int id, List<ItemsReporteFechasDTO> ordenes, Double totalMateriales) {
        this.id = id;
        this.ordenes = ordenes;
        this.totalMateriales = totalMateriales;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<ItemsReporteFechasDTO> getOrdenes() {
        return ordenes;
    }

    public void setOrdenes(List<ItemsReporteFechasDTO> ordenes) {
        this.ordenes = ordenes;
    }

    public Double getTotalMateriales() {
        return totalMateriales;
    }

    public void setTotalMateriales(Double totalMateriales) {
        this.totalMateriales = totalMateriales;
    }
}

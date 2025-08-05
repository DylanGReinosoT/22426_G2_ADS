package com.pintaauto.inventory.entity;

import com.pintaauto.inventory.dto.ItemsReporteFechasDTO;
import com.pintaauto.inventory.dto.ItemsReporteMateriasDTO;

import java.util.List;

public class ReporteMaterias {
    private int id;
    private String nombreMateria;
    private List<ItemsReporteMateriasDTO> ordenes;
    private Double totalMateriales;

    public ReporteMaterias() {
        // Default constructor
    }
    public ReporteMaterias(int id, String nombreMateria, List<ItemsReporteMateriasDTO> ordenes, Double totalMateriales) {
        this.id = id;
        this.nombreMateria = nombreMateria;
        this.ordenes = ordenes;
        this.totalMateriales = totalMateriales;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreMateria() {
        return nombreMateria;
    }

    public void setNombreMateria(String nombreMateria) {
        this.nombreMateria = nombreMateria;
    }

    public List<ItemsReporteMateriasDTO> getOrdenes() {
        return ordenes;
    }

    public void setOrdenes(List<ItemsReporteMateriasDTO> ordenes) {
        this.ordenes = ordenes;
    }

    public Double getTotalMateriales() {
        return totalMateriales;
    }

    public void setTotalMateriales(Double totalMateriales) {
        this.totalMateriales = totalMateriales;
    }
}


package com.pintaauto.inventory.dto;

import com.pintaauto.inventory.entity.Cliente;
import com.pintaauto.inventory.entity.Usuario;

import java.time.LocalDateTime;
import java.util.Date;

public class ItemsReporteMateriasDTO {
    private String cliente;
    private String usuario;
    private LocalDateTime fechaUso;
    private Double valorUnitario;
    private Double cantidad;
    private Double valorTotal;

    public ItemsReporteMateriasDTO() {
        // Default constructor
    }
    public ItemsReporteMateriasDTO(String cliente, String usuario, LocalDateTime fechaUso, Double valorUnitario, Double cantidad) {
        this.cliente = cliente;
        this.usuario = usuario;
        this.fechaUso = fechaUso;
        this.valorUnitario = valorUnitario;
        this.cantidad = cantidad;
        this.valorTotal = valorUnitario * cantidad;
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

    public LocalDateTime getFechaUso() {
        return fechaUso;
    }

    public void setFechaUso(LocalDateTime fechaUso) {
        this.fechaUso = fechaUso;
    }

    public Double getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(Double valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

    public Double getCantidad() {
        return cantidad;
    }

    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
    }

    public Double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }
}

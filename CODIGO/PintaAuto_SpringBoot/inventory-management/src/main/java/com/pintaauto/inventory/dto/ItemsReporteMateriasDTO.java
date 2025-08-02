package com.pintaauto.inventory.dto;

import com.pintaauto.inventory.entity.Cliente;
import com.pintaauto.inventory.entity.Usuario;

import java.util.Date;

public class ItemsReporteMateriasDTO {
    private Cliente cliente;
    private Usuario usuario;
    private Date fechaUso;
    private Double valorUnitario;
    private Double cantidad;
    private Double valorTotal;

    public ItemsReporteMateriasDTO() {
        // Default constructor
    }
    public ItemsReporteMateriasDTO(Cliente cliente, Usuario usuario, Date fechaUso, Double valorUnitario, Double cantidad) {
        this.cliente = cliente;
        this.usuario = usuario;
        this.fechaUso = fechaUso;
        this.valorUnitario = valorUnitario;
        this.cantidad = cantidad;
        this.valorTotal = valorUnitario * cantidad;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Date getFechaUso() {
        return fechaUso;
    }

    public void setFechaUso(Date fechaUso) {
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

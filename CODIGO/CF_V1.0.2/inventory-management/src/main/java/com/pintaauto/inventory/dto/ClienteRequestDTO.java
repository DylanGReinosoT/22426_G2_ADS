package com.pintaauto.inventory.dto;

import com.pintaauto.inventory.validation.CedulaEcuatoriana;
import com.pintaauto.inventory.validation.MayorEdad;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Date;

public class ClienteRequestDTO {

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 3, max = 80, message = "El nombre no puede exceder los 80 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(min = 3, max = 80, message = "El apellido no puede exceder los 80 caracteres")
    private String apellido;

    @CedulaEcuatoriana
    @NotBlank(message = "La cédula no puede estar vacía")
    @Size(max = 10, message = "La cédula debe tener máximo 10 caracteres")
    private String cedula;

    @MayorEdad
    @NotNull(message = "La fecha de nacimiento no puede estar vacía")
    @Temporal(TemporalType.DATE)
    private Date fechaNacimiento;

    @NotBlank(message = "El teléfono no puede estar vacío")
    @Size(max = 10, message = "El teléfono debe tener 10 caracteres")
    private String telefono;

    @NotBlank(message = "El email no puede estar vacío")
    @Size(max = 255, message = "El email no puede exceder los 255 caracteres")
    private String email;

    @NotBlank(message = "La dirección no puede estar vacía")
    @Size(max = 255, message = "La dirección no puede exceder los 255 caracteres")
    private String direccion;

    // Getters y Setters

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }
    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
}
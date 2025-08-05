package com.pintaauto.inventory.entity;


import com.pintaauto.inventory.validation.CedulaEcuatoriana;
import com.pintaauto.inventory.validation.MayorEdad;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;


import java.util.Date;

@Entity
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // comentario test
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 3, max = 80, message = "El nombre debe tener entre 3 y 80 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El nombre solo puede contener letras y espacios")
    @Column(nullable = false, length = 80)
    private String nombre;


    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(min = 3, max = 80, message = "El nombre no puede exceder los 80 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El apellido solo puede contener letras y espacios")
    @Column(nullable = false, length = 80)
    private String apellido;

    @CedulaEcuatoriana
    @NotBlank(message = "La cédula no puede estar vacía")
    @Size( max = 10, message = "La cédula debe sobrepasar los 10 caracteres")
    @Column(nullable = false, unique = true, length = 10)
    private String cedula;

    @MayorEdad
    @NotNull(message = "La fecha de nacimiento no puede estar vacía")
    @Temporal(TemporalType.DATE)
    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;

    @NotBlank(message = "El teléfono no puede estar vacío")
    @Size( max = 10, message = "El teléfono debe tener 10 caracteres")
    @Column(nullable = false, length = 10)
    private String telefono;

    @NotBlank(message = "El email no puede estar vacío")
    @Size(max = 255, message = "El email no puede exceder los 255 caracteres")
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank(message = "La dirección no puede estar vacía")
    @Size(max = 255, message = "La dirección no puede exceder los 255 caracteres")
    @Column(nullable = false, length = 255)
    private String direccion;


    // Constructores

    public Cliente(){}

    public Cliente(Long id,
                   String nombre,
                   String apellido,
                   String cedula,
                   String telefono,
                   String email,
                   String direccion) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cedula = cedula;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
    }

    //Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
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
}



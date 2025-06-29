package com.pintaauto.inventory.config;

import com.pintaauto.inventory.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioService usuarioService;

    @Value("${app.admin.nombre}")
    private String adminNombre;

    @Value("${app.admin.apellido}")
    private String adminApellido;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        // Crear usuario administrador si no existe
        usuarioService.crearUsuarioAdmin(adminNombre, adminApellido, adminEmail, adminPassword);
        System.out.println("✅ Usuario administrador inicializado: " + adminEmail);
    }
}

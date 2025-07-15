package com.pintaauto.inventory.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.pintaauto.inventory.repository")
@EnableTransactionManagement
public class DatabaseConfig {
    // Esta clase habilita los repositorios JPA y el manejo de transacciones
}

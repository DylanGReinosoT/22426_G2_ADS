package com.pintaauto.inventory.repository;

import com.pintaauto.inventory.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Buscar por email
    Optional<Cliente> findByEmail(String email);

    Optional<Cliente> findById(Long id);


    // Verificar si existe un cliente con un email específico
    boolean existsByEmail(String email);

    //Verificar si existe un cliente con una cédula específica
    boolean existsByCedula(String cedula);

    // Verificar si existe un cliente con un email específico excluyendo un ID
    @Query("SELECT COUNT(c) > 0 FROM Cliente c WHERE LOWER(c.email) = LOWER(:email) AND c.id != :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);

    // Buscar por nombre o apellido
    @Query("SELECT c FROM Cliente c WHERE LOWER(c.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) OR LOWER(c.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))")
    List<Cliente> findByNombreOrApellidoContaining(@Param("nombre") String nombre, @Param("apellido") String apellido);
}
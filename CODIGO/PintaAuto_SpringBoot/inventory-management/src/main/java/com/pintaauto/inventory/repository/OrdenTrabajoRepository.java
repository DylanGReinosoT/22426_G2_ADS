package com.pintaauto.inventory.repository;

import com.pintaauto.inventory.entity.Cliente;
import com.pintaauto.inventory.entity.OrdenTrabajo;
import com.pintaauto.inventory.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, Long> {

    // Buscar órdenes por usuario responsable
    List<OrdenTrabajo> findByUsuario(Usuario usuario);


    // Buscar por título que contenga un texto (búsqueda parcial)
    List<OrdenTrabajo> findByTituloContainingIgnoreCase(String titulo);

    @Query("SELECT u FROM Usuario u WHERE u.id = :usuarioId")
    Usuario findUsuarioById(Long usuarioId);

    @Query("SELECT c FROM Cliente c WHERE c.id = :clienteId")
    Cliente findClienteById(Long clienteId);


}
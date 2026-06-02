package com.pintaauto.inventory.repository;

import com.pintaauto.inventory.entity.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {

    List<OrdenCompra> findByEstado(OrdenCompra.Estado estado);

    List<OrdenCompra> findByMateriaPrimaId(Long materiaPrimaId);

    List<OrdenCompra> findByUsuarioId(Long usuarioId);
}

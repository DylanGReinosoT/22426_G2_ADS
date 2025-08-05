package com.pintaauto.inventory.repository;

import com.pintaauto.inventory.entity.MateriaPrima;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MateriaPrimaRepository extends JpaRepository<MateriaPrima, Long> {

    // Buscar por nombre (para validar duplicados)
    Optional<MateriaPrima> findByNombre(String nombre);

    // Buscar por nombre ignorando mayúsculas/minúsculas
    Optional<MateriaPrima> findByNombreIgnoreCase(String nombre);

    // Buscar por unidad de medida
    List<MateriaPrima> findByUnidadMedida(String unidadMedida);

    // Buscar materias primas con cantidad menor a un valor específico
    @Query("SELECT m FROM MateriaPrima m WHERE m.cantidad < :cantidad")
    List<MateriaPrima> findByCantidadMenorQue(@Param("cantidad") Integer cantidad);

    // Buscar por nombre que contenga un texto (búsqueda parcial)
    @Query("SELECT m FROM MateriaPrima m WHERE LOWER(m.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<MateriaPrima> findByNombreContaining(@Param("nombre") String nombre);

    // Verificar si existe una materia prima con un nombre específico
    boolean existsByNombre(String nombre);

    // Verificar si existe una materia prima con un nombre específico excluyendo un ID
    @Query("SELECT COUNT(m) > 0 FROM MateriaPrima m WHERE LOWER(m.nombre) = LOWER(:nombre) AND m.id != :id")
    boolean existsByNombreAndIdNot(@Param("nombre") String nombre, @Param("id") Long id);


}

package com.pintaauto.inventory.service;

import com.pintaauto.inventory.dto.ItemsReporteFechasDTO;
import com.pintaauto.inventory.dto.ItemsReporteMateriasDTO;
import com.pintaauto.inventory.dto.MateriaPrimaReporteDTO;
import com.pintaauto.inventory.entity.*;
import com.pintaauto.inventory.repository.MateriaPrimaRepository;
import com.pintaauto.inventory.repository.OrdenTrabajoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private OrdenTrabajoRepository ordenTrabajoRepository;

    public ReporteFechas generarReportePorFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        // Consulta los datos necesarios
        List<OrdenTrabajo> resultados = ordenTrabajoRepository.obtenerDatosPorRangosFechas(fechaInicio, fechaFin);

        List<MateriaPrimaReporteDTO> listaMaterias = new ArrayList<>();
        List<ItemsReporteFechasDTO> listaItems = new ArrayList<>();
        for(OrdenTrabajo orden : resultados){
            ItemsReporteFechasDTO item = new ItemsReporteFechasDTO();
            Cliente cliente = orden.getCliente();
            Usuario usuario = orden.getUsuario();
            Map<MateriaPrima, Double> materiales = new HashMap<>();


            item.setCliente(cliente.getNombre() + " " + cliente.getApellido());
            item.setUsuario(usuario.getNombre());
            item.setFechaCreacion(orden.getFechaCreacion());
            for(Map.Entry<MateriaPrima, Double> entry : materiales.entrySet()){
                MateriaPrima materia = entry.getKey();
                Double cantidad = entry.getValue();
                MateriaPrimaReporteDTO materiaDTO = new MateriaPrimaReporteDTO(
                        materia.getNombre(),
                        cantidad,
                        materia.getPrecioUnitario().doubleValue()
                );
                listaMaterias.add(materiaDTO);
            }
            item.setMateriales(listaMaterias);
            listaItems.add(item);
        }
        // Calcular el total de materiales
        double sumaTotal = listaMaterias.stream()
                .mapToDouble(MateriaPrimaReporteDTO::getValorTotal)
                .sum();

        // Retorna el reporte
        ReporteFechas reporte = new ReporteFechas();
        reporte.setOrdenes(listaItems);
        reporte.setTotalMateriales(sumaTotal);
        return reporte;
    }

//    public ReporteMaterias generarReportePorMateriaPrima(String nombreMateriaPrima) {
//        // Consulta los datos necesarios
//        List<Object[]> resultados = materiaPrimaRepository.obtenerDatosPorMateriaPrima(nombreMateriaPrima);
//
//        // Transforma los resultados en DTOs
//        List<ItemsReporteMateriasDTO> items = resultados.stream()
//                .map(resultado -> new ItemsReporteMateriasDTO(
//                        (Cliente) resultado[0], // cliente
//                        (Usuario) resultado[1], // usuario
//                        (Date) resultado[2], // fechaUso
//                        (Double) resultado[3], // valorUnitario
//                        (Double) resultado[4] // cantidad
//                ))
//                .collect(Collectors.toList());
//
//        // Calcula el total de materiales
//        Double totalMateriales = items.stream()
//                .mapToDouble(ItemsReporteMateriasDTO::getValorTotal)
//                .sum();
//
//        // Retorna el reporte
//        ReporteMaterias reporte = new ReporteMaterias();
//        reporte.setOrdenes(items);
//        reporte.setTotalMateriales(totalMateriales);
//        return reporte;
//    }
}
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
        for(OrdenTrabajo orden : resultados) {
            List<MateriaPrimaReporteDTO> listaMateriasAux = new ArrayList<>();
            ItemsReporteFechasDTO item = new ItemsReporteFechasDTO();
            Cliente cliente = orden.getCliente();
            Usuario usuario = orden.getUsuario();
            Map<MateriaPrima, Double> materiales = orden.getMateriasPrimasYcantidades();

            item.setCliente(cliente.getNombre() + " " + cliente.getApellido());
            item.setUsuario(usuario.getNombre());
            item.setFechaCreacion(orden.getFechaCreacion());
            for (Map.Entry<MateriaPrima, Double> entry : materiales.entrySet()) {
                MateriaPrima materia = entry.getKey();
                Double cantidad = entry.getValue();
                MateriaPrimaReporteDTO materiaDTO = new MateriaPrimaReporteDTO(
                        materia.getNombre(),
                        cantidad,
                        materia.getPrecioUnitario().doubleValue()
                );
                listaMaterias.add(materiaDTO);
                listaMateriasAux.add(materiaDTO);
            }
            item.setMateriales(listaMateriasAux);
            item.setValorMateriales(listaMateriasAux.stream()
                    .mapToDouble(MateriaPrimaReporteDTO::getValorTotal)
                    .sum());
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

    public ReporteMaterias generarReportePorMateriaPrima(String nombreMateriaPrima) {
        // Consulta los datos necesarios
        List<OrdenTrabajo> resultados = ordenTrabajoRepository.obtenerDatosPorMateriaPrima(nombreMateriaPrima);


        List<ItemsReporteMateriasDTO> listaItems = new ArrayList<>();
        for (OrdenTrabajo orden : resultados) {
            ItemsReporteMateriasDTO item = new ItemsReporteMateriasDTO();
            Map<MateriaPrima, Double> materiales = orden.getMateriasPrimasYcantidades();
            for (MateriaPrima materia : materiales.keySet()) {
                if (materia.getNombre().equalsIgnoreCase(nombreMateriaPrima)) {

                    Cliente cliente = orden.getCliente();
                    Usuario usuario = orden.getUsuario();
                    item.setCliente(cliente.getNombre() + " " + cliente.getApellido());
                    item.setUsuario(usuario.getNombre());
                    item.setFechaUso(orden.getFechaCreacion());
                    Double cantidad = materiales.get(materia);
                    item.setValorUnitario(materia.getPrecioUnitario().doubleValue());
                    item.setCantidad(cantidad);
                    item.setValorTotal(item.getValorUnitario() * item.getCantidad());

                }
            }
            listaItems.add(item);
        }


        // Calcula el total de materiales
        Double totalMateriales = listaItems.stream()
                .mapToDouble(ItemsReporteMateriasDTO::getValorTotal)
                .sum();

        // Retorna el reporte
        ReporteMaterias reporte = new ReporteMaterias();
        reporte.setOrdenes(listaItems);
        reporte.setTotalMateriales(totalMateriales);
        return reporte;
    }
}
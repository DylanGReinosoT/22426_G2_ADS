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

    public ReporteMaterias generarReportePorMateriaPrima(String nombreMateriaPrima) {
        // Consulta los datos necesarios
        List<OrdenTrabajo> resultados = ordenTrabajoRepository.obtenerDatosPorMateriaPrima(nombreMateriaPrima);
        ItemsReporteMateriasDTO item = new ItemsReporteMateriasDTO();

        List<ItemsReporteMateriasDTO> listaItems = new ArrayList<>();
        for (OrdenTrabajo orden: resultados){
            Cliente cliente = orden.getCliente();
            Usuario usuario = orden.getUsuario();
            item.setFechaUso(orden.getFechaCreacion());
            Map<MateriaPrima, Double> materiales = new HashMap<>();

            for(MateriaPrima materia : orden.getMateriasPrimasYcantidades().keySet()){
                if(materia.getNombre().equalsIgnoreCase(nombreMateriaPrima)){
                    Double cantidad = orden.getMateriasPrimasYcantidades().get(materia);
                    item.setValorUnitario(materia.getPrecioUnitario().doubleValue());
                    item.setCantidad(cantidad);
                    item.setValorTotal(item.getValorUnitario() * item.getCantidad());
                    materiales.put(materia, cantidad);
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
package com.pintaauto.inventory.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.pintaauto.inventory.dto.ItemsReporteFechasDTO;
import com.pintaauto.inventory.dto.ItemsReporteMateriasDTO;
import com.pintaauto.inventory.dto.MateriaPrimaReporteDTO;
import com.pintaauto.inventory.entity.*;
import com.pintaauto.inventory.repository.MateriaPrimaRepository;
import com.pintaauto.inventory.repository.OrdenTrabajoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ReporteService {

    @Autowired
    private OrdenTrabajoRepository ordenTrabajoRepository;

    public ReporteFechas generarReportePorFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        // Consulta los datos necesarios
        List<OrdenTrabajo> resultados = ordenTrabajoRepository.obtenerDatosPorRangosFechas(fechaInicio, fechaFin);

        List<MateriaPrimaReporteDTO> listaMaterias = new ArrayList<>();
        List<ItemsReporteFechasDTO> listaItems = new ArrayList<>();
        int numId = 1;
        for(OrdenTrabajo orden : resultados) {
            List<MateriaPrimaReporteDTO> listaMateriasAux = new ArrayList<>();
            ItemsReporteFechasDTO item = new ItemsReporteFechasDTO();
            Cliente cliente = orden.getCliente();
            Usuario usuario = orden.getUsuario();
            Map<MateriaPrima, Double> materiales = orden.getMateriasPrimasYcantidades();

            item.setIdOrden(numId);
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
            numId++;
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

            Cliente cliente = orden.getCliente();
            Usuario usuario = orden.getUsuario();
            item.setCliente(cliente.getNombre() + " " + cliente.getApellido());
            item.setUsuario(usuario.getNombre());
            item.setFechaUso(orden.getFechaCreacion());

            for (MateriaPrima materia : materiales.keySet()) {
                if (materia.getNombre().equalsIgnoreCase(nombreMateriaPrima)) {
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
        reporte.setNombreMateria(nombreMateriaPrima);
        reporte.setOrdenes(listaItems);
        reporte.setTotalMateriales(totalMateriales);
        return reporte;
    }

    public byte[] generarReporteFechasPdf(ReporteFechas reporte) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);

        document.open();

        // Título del documento
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph("Reporte por Rango de Fechas", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" ")); // Espacio

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

        for (ItemsReporteFechasDTO orden : reporte.getOrdenes()) {
            document.add(new Paragraph("Orden ID: " + orden.getIdOrden()));
            document.add(new Paragraph("Cliente: " + orden.getCliente()));
            document.add(new Paragraph("Usuario: " + orden.getUsuario()));
            document.add(new Paragraph("Fecha de creación: " + orden.getFechaCreacion().format(formatter)));
            document.add(new Paragraph(" "));

            // Tabla de materiales
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // Cabecera
            Stream.of("Nombre", "Cantidad", "Precio Unitario", "Valor Total")
                    .forEach(header -> {
                        PdfPCell cell = new PdfPCell(new Phrase(header));
                        cell.setBackgroundColor(Color.LIGHT_GRAY);
                        table.addCell(cell);
                    });

            // Filas
            for (MateriaPrimaReporteDTO m : orden.getMateriales()) {
                table.addCell(m.getNombre());
                table.addCell(m.getCantidad().toString());
                table.addCell("$" + m.getPrecioUnitario().toString());
                table.addCell("$" + m.getValorTotal().toString());
            }

            document.add(table);
            document.add(new Paragraph("Total materiales: $" + orden.getValorMateriales()));
            document.add(new Paragraph("------------------------------------------------------"));
        }

        // Total general
        document.add(new Paragraph("TOTAL GENERAL DE MATERIALES: $" + reporte.getTotalMateriales(), new Font(Font.HELVETICA, 14, Font.BOLD)));

        document.close();
        return baos.toByteArray();
    }

    public byte[] generarReporteMateriasPdf(ReporteMaterias reporte) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        String titulo = "Reporte por Materia Prima: " + reporte.getNombreMateria();

        document.open();

        // Título del documento
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph(titulo, titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" ")); // Espacio

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

        for (ItemsReporteMateriasDTO orden : reporte.getOrdenes()) {
            document.add(new Paragraph("Cliente: " + orden.getCliente()));
            document.add(new Paragraph("Usuario: " + orden.getUsuario()));
            document.add(new Paragraph(" "));

            // Tabla de materiales
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // Cabecera
            Stream.of("Valor Unitario", "Cantidad", "Valor Total")
                    .forEach(header -> {
                        PdfPCell cell = new PdfPCell(new Phrase(header));
                        cell.setBackgroundColor(Color.LIGHT_GRAY);
                        table.addCell(cell);
                    });

            // Filas
            table.addCell(orden.getValorUnitario().toString());
            table.addCell("$" + orden.getCantidad().toString());
            table.addCell("$" + orden.getValorTotal().toString());


            document.add(table);
            document.add(new Paragraph("------------------------------------------------------"));
        }

        // Total general
        document.add(new Paragraph("TOTAL GENERADO: $" + reporte.getTotalMateriales(), new Font(Font.HELVETICA, 14, Font.BOLD)));

        document.close();
        return baos.toByteArray();
    }
}
package com.pintaauto.inventory.controller;

import com.pintaauto.inventory.entity.ReporteFechas;
import com.pintaauto.inventory.entity.ReporteMaterias;
import com.pintaauto.inventory.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping("/fechas")
    public ResponseEntity<ReporteFechas> generarReportePorFechas(
            @RequestParam("fechaInicio") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDateTime fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDateTime fechaFin) {
        ReporteFechas reporte = reporteService.generarReportePorFechas(fechaInicio, fechaFin);
        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/materia")
    public ResponseEntity<ReporteMaterias> generarReporteMaterias(
            @RequestParam("nombreMateria") String nombreMateria) {
        ReporteMaterias reporte = reporteService.generarReportePorMateriaPrima(nombreMateria);
        return ResponseEntity.ok(reporte);
    }

    @PostMapping("/fechas/pdf")
    public ResponseEntity<byte[]> generarPdf(@RequestBody ReporteFechas reporteFechas) throws Exception {
        byte[] pdfBytes = reporteService.generarReporteFechasPdf(reporteFechas);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ReporteFechas.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PostMapping("/materia/pdf")
    public ResponseEntity<byte[]> generarPdfMateria(@RequestBody ReporteMaterias reporteMaterias) throws Exception {
        byte[] pdfBytes = reporteService.generarReporteMateriasPdf(reporteMaterias);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ReporteMateria.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
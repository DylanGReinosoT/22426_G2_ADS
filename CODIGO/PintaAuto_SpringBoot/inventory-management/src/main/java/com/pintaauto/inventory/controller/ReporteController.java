package com.pintaauto.inventory.controller;

import com.pintaauto.inventory.entity.ReporteFechas;
import com.pintaauto.inventory.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reportes/fechas")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping
    public ResponseEntity<ReporteFechas> generarReportePorFechas(
            @RequestParam("fechaInicio") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDateTime fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDateTime fechaFin) {
        ReporteFechas reporte = reporteService.generarReportePorFechas(fechaInicio, fechaFin);
        return ResponseEntity.ok(reporte);
    }
}
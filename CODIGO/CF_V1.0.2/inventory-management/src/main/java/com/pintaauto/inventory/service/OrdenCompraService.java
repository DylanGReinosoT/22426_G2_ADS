package com.pintaauto.inventory.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.pintaauto.inventory.dto.OrdenCompraRequestDTO;
import com.pintaauto.inventory.dto.OrdenCompraResponseDTO;
import com.pintaauto.inventory.dto.MateriaPrimaResponseDTO;
import com.pintaauto.inventory.dto.UsuarioResponseDTO;
import com.pintaauto.inventory.entity.MateriaPrima;
import com.pintaauto.inventory.entity.OrdenCompra;
import com.pintaauto.inventory.entity.Usuario;
import com.pintaauto.inventory.repository.MateriaPrimaRepository;
import com.pintaauto.inventory.repository.OrdenCompraRepository;
import com.pintaauto.inventory.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrdenCompraService {

    @Autowired
    private OrdenCompraRepository ordenCompraRepository;

    @Autowired
    private MateriaPrimaRepository materiaPrimaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MateriaPrimaService materiaPrimaService;

    // Obtener todas las órdenes de compra
    @Transactional(readOnly = true)
    public List<OrdenCompraResponseDTO> obtenerTodas() {
        return ordenCompraRepository.findAll().stream()
                .map(this::convertirAResponseDTO)
                .collect(Collectors.toList());
    }

    // Obtener por ID
    @Transactional(readOnly = true)
    public OrdenCompraResponseDTO obtenerPorId(Long id) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden de compra no encontrada con ID: " + id));
        return convertirAResponseDTO(orden);
    }

    // Crear nueva orden de compra
    public OrdenCompraResponseDTO crear(OrdenCompraRequestDTO requestDTO) {
        MateriaPrima materiaPrima = materiaPrimaRepository.findById(requestDTO.getMateriaPrimaId())
                .orElseThrow(() -> new RuntimeException("Materia prima no encontrada con ID: " + requestDTO.getMateriaPrimaId()));

        Usuario usuario = usuarioRepository.findById(requestDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + requestDTO.getUsuarioId()));

        OrdenCompra orden = new OrdenCompra();
        orden.setMateriaPrima(materiaPrima);
        orden.setCantidadSolicitada(requestDTO.getCantidadSolicitada());
        orden.setProveedor(requestDTO.getProveedor());
        orden.setObservaciones(requestDTO.getObservaciones());
        orden.setUsuario(usuario);
        orden.setEstado(OrdenCompra.Estado.PENDIENTE);
        orden.setPrecioTotal(materiaPrima.getPrecioUnitario().doubleValue() * requestDTO.getCantidadSolicitada());

        return convertirAResponseDTO(ordenCompraRepository.save(orden));
    }

    // Cambiar estado de la orden de compra
    public OrdenCompraResponseDTO cambiarEstado(Long id, String nuevoEstado) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden de compra no encontrada con ID: " + id));

        OrdenCompra.Estado estadoActual = orden.getEstado();

        if (estadoActual == OrdenCompra.Estado.RECIBIDA) {
            throw new RuntimeException("No se puede cambiar el estado de una orden ya recibida");
        }
        if (estadoActual == OrdenCompra.Estado.CANCELADA) {
            throw new RuntimeException("No se puede cambiar el estado de una orden cancelada");
        }

        OrdenCompra.Estado estado;
        try {
            estado = OrdenCompra.Estado.valueOf(nuevoEstado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + nuevoEstado + ". Estados válidos: PENDIENTE, APROBADA, RECIBIDA, CANCELADA");
        }

        // Al recibir la orden, reponer el stock de la materia prima
        if (estado == OrdenCompra.Estado.RECIBIDA) {
            MateriaPrima materiaPrima = orden.getMateriaPrima();
            materiaPrima.setCantidad(materiaPrima.getCantidad() + orden.getCantidadSolicitada());
            materiaPrimaRepository.save(materiaPrima);
        }

        orden.setEstado(estado);
        return convertirAResponseDTO(ordenCompraRepository.save(orden));
    }

    // Eliminar orden de compra (solo si está PENDIENTE o CANCELADA)
    public void eliminar(Long id) {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden de compra no encontrada con ID: " + id));

        if (orden.getEstado() == OrdenCompra.Estado.RECIBIDA) {
            throw new RuntimeException("No se puede eliminar una orden de compra ya recibida");
        }
        if (orden.getEstado() == OrdenCompra.Estado.APROBADA) {
            throw new RuntimeException("No se puede eliminar una orden de compra aprobada. Primero cancélela");
        }

        ordenCompraRepository.deleteById(id);
    }

    // Generar PDF de una orden de compra
    public byte[] generarPdf(Long id) throws DocumentException {
        OrdenCompra orden = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden de compra no encontrada con ID: " + id));

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        // ── Encabezado ──────────────────────────────────────────────
        Font fuenteTitulo = new Font(Font.HELVETICA, 20, Font.BOLD, Color.WHITE);
        PdfPTable header = new PdfPTable(1);
        header.setWidthPercentage(100);
        PdfPCell headerCell = new PdfPCell(new Phrase("ORDEN DE COMPRA #" + orden.getId(), fuenteTitulo));
        headerCell.setBackgroundColor(new Color(153, 0, 0));
        headerCell.setPadding(14);
        headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell.setBorder(Rectangle.NO_BORDER);
        header.addCell(headerCell);
        document.add(header);
        document.add(new Paragraph(" "));

        // ── Empresa ─────────────────────────────────────────────────
        Font fuenteNegrita = new Font(Font.HELVETICA, 11, Font.BOLD);
        Font fuenteNormal  = new Font(Font.HELVETICA, 11, Font.NORMAL);

        Paragraph empresa = new Paragraph();
        empresa.add(new Chunk("Empresa: ", fuenteNegrita));
        empresa.add(new Chunk("PintAuto", fuenteNormal));
        document.add(empresa);

        Paragraph fechaDoc = new Paragraph();
        fechaDoc.add(new Chunk("Fecha de emisión: ", fuenteNegrita));
        fechaDoc.add(new Chunk(orden.getFechaCreacion().format(formatter), fuenteNormal));
        document.add(fechaDoc);

        Paragraph estadoDoc = new Paragraph();
        estadoDoc.add(new Chunk("Estado: ", fuenteNegrita));
        estadoDoc.add(new Chunk(orden.getEstado().name(), fuenteNormal));
        document.add(estadoDoc);

        document.add(new Paragraph(" "));

        // ── Proveedor y solicitante ──────────────────────────────────
        Font fuenteSeccion = new Font(Font.HELVETICA, 13, Font.BOLD, new Color(153, 0, 0));

        document.add(new Paragraph("Datos del proveedor", fuenteSeccion));
        document.add(new LineSeparator());
        document.add(new Paragraph(" "));

        Paragraph proveedor = new Paragraph();
        proveedor.add(new Chunk("Proveedor: ", fuenteNegrita));
        proveedor.add(new Chunk(orden.getProveedor(), fuenteNormal));
        document.add(proveedor);

        document.add(new Paragraph(" "));

        document.add(new Paragraph("Solicitante", fuenteSeccion));
        document.add(new LineSeparator());
        document.add(new Paragraph(" "));

        Paragraph solicitante = new Paragraph();
        solicitante.add(new Chunk("Nombre: ", fuenteNegrita));
        solicitante.add(new Chunk(orden.getUsuario().getNombre() + " " + orden.getUsuario().getApellido(), fuenteNormal));
        document.add(solicitante);

        Paragraph emailDoc = new Paragraph();
        emailDoc.add(new Chunk("Email: ", fuenteNegrita));
        emailDoc.add(new Chunk(orden.getUsuario().getEmail(), fuenteNormal));
        document.add(emailDoc);

        document.add(new Paragraph(" "));

        // ── Tabla de materiales ──────────────────────────────────────
        document.add(new Paragraph("Detalle del pedido", fuenteSeccion));
        document.add(new LineSeparator());
        document.add(new Paragraph(" "));

        PdfPTable tabla = new PdfPTable(5);
        tabla.setWidthPercentage(100);
        tabla.setWidths(new float[]{3f, 2f, 2f, 2f, 2f});
        tabla.setSpacingBefore(8f);

        Font fuenteCabecera = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
        String[] columnas = {"Material", "Unidad", "Cantidad", "Precio Unitario", "Total"};
        for (String col : columnas) {
            PdfPCell cell = new PdfPCell(new Phrase(col, fuenteCabecera));
            cell.setBackgroundColor(new Color(50, 50, 50));
            cell.setPadding(7);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            tabla.addCell(cell);
        }

        MateriaPrima mp = orden.getMateriaPrima();
        Font fuenteFila = new Font(Font.HELVETICA, 10, Font.NORMAL);

        addCeldaTabla(tabla, mp.getNombre(), fuenteFila, Element.ALIGN_LEFT);
        addCeldaTabla(tabla, mp.getUnidadMedida(), fuenteFila, Element.ALIGN_CENTER);
        addCeldaTabla(tabla, String.valueOf(orden.getCantidadSolicitada()), fuenteFila, Element.ALIGN_CENTER);
        addCeldaTabla(tabla, "$" + String.format("%.2f", mp.getPrecioUnitario().doubleValue()), fuenteFila, Element.ALIGN_RIGHT);
        addCeldaTabla(tabla, "$" + String.format("%.2f", orden.getPrecioTotal()), fuenteFila, Element.ALIGN_RIGHT);

        document.add(tabla);
        document.add(new Paragraph(" "));

        // ── Total ────────────────────────────────────────────────────
        Font fuenteTotal = new Font(Font.HELVETICA, 13, Font.BOLD);
        Paragraph total = new Paragraph("TOTAL: $" + String.format("%.2f", orden.getPrecioTotal()), fuenteTotal);
        total.setAlignment(Element.ALIGN_RIGHT);
        document.add(total);

        // ── Observaciones ────────────────────────────────────────────
        if (orden.getObservaciones() != null && !orden.getObservaciones().isBlank()) {
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Observaciones", fuenteSeccion));
            document.add(new LineSeparator());
            document.add(new Paragraph(" "));
            document.add(new Paragraph(orden.getObservaciones(), fuenteNormal));
        }

        // ── Pie de página ────────────────────────────────────────────
        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));
        Font fuentePie = new Font(Font.HELVETICA, 9, Font.ITALIC, Color.GRAY);
        Paragraph pie = new Paragraph("Documento generado el " + java.time.LocalDateTime.now().format(formatter) + " — PintAuto © " + java.time.Year.now().getValue(), fuentePie);
        pie.setAlignment(Element.ALIGN_CENTER);
        document.add(pie);

        document.close();
        return baos.toByteArray();
    }

    // ── Conversión ───────────────────────────────────────────────────

    private OrdenCompraResponseDTO convertirAResponseDTO(OrdenCompra orden) {
        MateriaPrimaResponseDTO mpDTO = materiaPrimaService.convertirAResponseDTO(orden.getMateriaPrima());

        Usuario u = orden.getUsuario();
        UsuarioResponseDTO usuarioDTO = new UsuarioResponseDTO(
                u.getId(), u.getNombre(), u.getApellido(), u.getEmail(),
                u.getActivo(), u.getCreatedAt(), u.getUpdatedAt()
        );

        return new OrdenCompraResponseDTO(
                orden.getId(),
                mpDTO,
                orden.getCantidadSolicitada(),
                orden.getProveedor(),
                orden.getEstado().name(),
                orden.getPrecioTotal(),
                orden.getObservaciones(),
                usuarioDTO,
                orden.getFechaCreacion(),
                orden.getFechaActualizacion()
        );
    }

    private void addCeldaTabla(PdfPTable tabla, String texto, Font fuente, int alineacion) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, fuente));
        cell.setPadding(6);
        cell.setHorizontalAlignment(alineacion);
        tabla.addCell(cell);
    }
}

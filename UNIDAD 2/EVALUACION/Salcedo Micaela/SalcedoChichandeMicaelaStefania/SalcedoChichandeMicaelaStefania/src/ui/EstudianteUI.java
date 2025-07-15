package ui;

import controller.EstudianteController;
import model.Estudiante;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;

public class EstudianteUI extends JFrame {
    private EstudianteController controller;
    // Campos de texto para ingresar datos del estudiante
    private JTextField txtId, txtNombre, txtApellidos, txtEdad;
    // Campo para buscar estudiantes por ID
    private JTextField txtBuscarId;
    // Tabla para mostrar los estudiantes
    private JTable tableEstudiantes;

    private DefaultTableModel tableModel;

    public EstudianteUI() {
        controller = new EstudianteController();

        // Datos quemados
        controller.crearEstudiante(1, "Pérez", "Ana", 20);
        controller.crearEstudiante(2, "García", "Luis", 22);

        initComponents();  // Inicializa componentes gráficos
        cargarTabla(); // carga los datos en la tabla
    }

    private void initComponents() {
        setTitle("Formulario de Estudiantes");
        setSize(600, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Panel con el formulario para ingresar datos del estudiante
        JPanel panelFormulario = new JPanel(new GridLayout(5, 3, 5, 5));
        panelFormulario.setBorder(BorderFactory.createTitledBorder("Datos del Estudiante"));
        // Crear campos de texto
        txtId = new JTextField();
        txtNombre = new JTextField();
        txtApellidos = new JTextField();
        txtEdad = new JTextField();
        // Añadir etiquetas y campos al panel formulario
        panelFormulario.add(new JLabel("ID:"));
        panelFormulario.add(txtId);
        panelFormulario.add(new JLabel()); // espacio vacío

        panelFormulario.add(new JLabel("Nombre:"));
        panelFormulario.add(txtNombre);
        panelFormulario.add(new JLabel());

        panelFormulario.add(new JLabel("Apellidos:"));
        panelFormulario.add(txtApellidos);
        panelFormulario.add(new JLabel());

        panelFormulario.add(new JLabel("Edad:"));
        panelFormulario.add(txtEdad);
        panelFormulario.add(new JLabel());
        // Botones para acciones
        JButton btnActualizar = new JButton("Actualizar");
        JButton btnAgregar = new JButton("Agregar");
        JButton btnEliminar = new JButton("Eliminar");

        panelFormulario.add(btnActualizar);
        panelFormulario.add(btnAgregar);
        panelFormulario.add(btnEliminar);

        // Panel para búsqueda y listado de estudiantes
        JPanel panelBusqueda = new JPanel(new FlowLayout(FlowLayout.LEFT));
        txtBuscarId = new JTextField(10);
        JButton btnBuscar = new JButton("Buscar");
        JButton btnListar = new JButton("Listar Todos");

        panelBusqueda.setBorder(BorderFactory.createTitledBorder("Buscar/Listar"));
        panelBusqueda.add(new JLabel("ID:"));
        panelBusqueda.add(txtBuscarId);
        panelBusqueda.add(btnBuscar);
        panelBusqueda.add(btnListar);

        // Tabla para mostrar estudiantes
        tableModel = new DefaultTableModel(new String[]{"ID", "Nombres", "Apellidos", "Edad"}, 0);
        tableEstudiantes = new JTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(tableEstudiantes);

        // Panel central que contiene la búsqueda y la tabla
        JPanel panelCentral = new JPanel(new BorderLayout());
        panelCentral.add(panelBusqueda, BorderLayout.NORTH);
        panelCentral.add(scrollPane, BorderLayout.CENTER);


        add(panelFormulario, BorderLayout.NORTH);
        add(panelCentral, BorderLayout.CENTER);

        // Asociar eventos a los botones
        btnAgregar.addActionListener((ActionEvent e) -> agregarEstudiante());
        btnBuscar.addActionListener((ActionEvent e) -> buscarEstudiante());
        btnListar.addActionListener((ActionEvent e) -> cargarTabla());
        btnActualizar.addActionListener((ActionEvent e) -> actualizarEstudiante());
        btnEliminar.addActionListener((ActionEvent e) -> eliminarEstudiante());

        setVisible(true);
    }
    // Método para agregar un nuevo estudiante

    private void agregarEstudiante() {
        try {
            int id = Integer.parseInt(txtId.getText());
            String nombre = txtNombre.getText();
            String apellidos = txtApellidos.getText();
            int edad = Integer.parseInt(txtEdad.getText());

            controller.crearEstudiante(id, apellidos, nombre, edad);
            JOptionPane.showMessageDialog(this, "Estudiante agregado.");
            limpiarCampos();
            cargarTabla();
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Por favor ingresa datos válidos.");
        }
    }
    // Método para buscar un estudiante
    private void buscarEstudiante() {
        try {
            int id = Integer.parseInt(txtBuscarId.getText());
            Estudiante e = controller.buscarEstudiante(id);

            tableModel.setRowCount(0); // limpiar tabla

            if (e != null) {
                tableModel.addRow(new Object[]{e.getId(), e.getNombres(), e.getApellidos(), e.getEdad()});
            } else {
                JOptionPane.showMessageDialog(this, "Estudiante no encontrado.");
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "ID inválido.");
        }
    }
    // Método para cargar la tabla con estudiantes

    private void cargarTabla() {
        tableModel.setRowCount(0); // limpiar
        for (Estudiante e : controller.obtenerTodos()) {
            tableModel.addRow(new Object[]{e.getId(), e.getNombres(), e.getApellidos(), e.getEdad()});
        }
    }
    // metodo para actualizar estudiantes
    private void actualizarEstudiante() {
        try {
            int id = Integer.parseInt(txtId.getText());
            String nombre = txtNombre.getText();
            String apellidos = txtApellidos.getText();
            int edad = Integer.parseInt(txtEdad.getText());

            boolean actualizado = controller.actualizarEstudiante(id, apellidos, nombre, edad);
            if (actualizado) {
                JOptionPane.showMessageDialog(this, "Estudiante actualizado.");
                limpiarCampos();
                cargarTabla();
            } else {
                JOptionPane.showMessageDialog(this, "Estudiante no encontrado para actualizar.");
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Datos inválidos.");
        }
    }
   // metodo para eliminar estudiante
    private void eliminarEstudiante() {
        try {
            int id = Integer.parseInt(txtId.getText());
            int confirmacion = JOptionPane.showConfirmDialog(this, "¿Estás seguro de eliminar al estudiante?", "Confirmar", JOptionPane.YES_NO_OPTION);
            if (confirmacion == JOptionPane.YES_OPTION) {
                boolean eliminado = controller.eliminarEstudiante(id);
                if (eliminado) {
                    JOptionPane.showMessageDialog(this, "Estudiante eliminado.");
                    limpiarCampos();
                    cargarTabla();
                } else {
                    JOptionPane.showMessageDialog(this, "Estudiante no encontrado para eliminar.");
                }
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "ID inválido.");
        }
    }
   // metodo para limpiar los campos de ingreso de texto
    private void limpiarCampos() {
        txtId.setText("");
        txtNombre.setText("");
        txtApellidos.setText("");
        txtEdad.setText("");
    }

    public static void main(String[] args) {
        new EstudianteUI();
    }
}

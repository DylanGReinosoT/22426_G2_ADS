package model;
// modelo del estudiante con todos sus atributos
public class Estudiante {
    private int id;
    private String apellidos;
    private String nombres;
    private int edad;
// contructor del modelo estudiante
    /**
     * Constructor de la clase Estudiante
     * Inicializa un objeto Estudiante con sus datos principales
     *
     * @param id identificador único del estudiante
     * @param apellidos apellidos del estudiante
     * @param nombres nombres del estudiante
     * @param edad edad del estudiante
     */
    public Estudiante(int id, String apellidos, String nombres, int edad) {
        this.id = id;
        this.apellidos = apellidos;
        this.nombres = nombres;
        this.edad = edad;
    }

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public int getEdad() { return edad; }
    public void setEdad(int edad) { this.edad = edad; }
}





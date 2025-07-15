package controller;

import dao.EstudianteDAO;
import model.Estudiante;

import java.util.List;

public class EstudianteController {
    private EstudianteDAO dao = new EstudianteDAO();
    /**
     * Crea un nuevo estudiante y lo agrega al DAO
     * @param id identificador del estudiante
     * @param apellidos apellidos del estudiante
     * @param nombres nombres del estudiante
     * @param edad edad del estudiante
     */
    public void crearEstudiante(int id, String apellidos, String nombres, int edad) {
        Estudiante e = new Estudiante(id, apellidos, nombres, edad);
        dao.agregar(e);
    }
    /**
     * Devuelve la lista completa de estudiantes almacenados
     * @return lista de estudiantes
     */
    public List<Estudiante> obtenerTodos() {
        return dao.listar();
    }
    /**
     * Busca un estudiante por su ID
     * @param id identificador del estudiante
     * @return el estudiante encontrado o null si no existe
     */
    public Estudiante buscarEstudiante(int id) {
        return dao.buscarPorId(id);
    }
    /**
     * Actualiza los datos de un estudiante existente
     * @param id identificador del estudiante a actualizar
     * @param apellidos nuevos apellidos
     * @param nombres nuevos nombres
     * @param edad nueva edad
     * @return true si el estudiante fue actualizado, false si no se encontró
     */
    public boolean actualizarEstudiante(int id, String apellidos, String nombres, int edad) {
        Estudiante e = buscarEstudiante(id);
        if (e != null) {
            e.setApellidos(apellidos);
            e.setNombres(nombres);
            e.setEdad(edad);
            return dao.actualizar(e);
        }
        return false;
    }
    /**
     * Elimina un estudiante por su ID
     * @param id identificador del estudiante a eliminar
     * @return true si el estudiante fue eliminado, false si no se encontró
     */
    public boolean eliminarEstudiante(int id) {
        return dao.eliminar(id);
    }
}

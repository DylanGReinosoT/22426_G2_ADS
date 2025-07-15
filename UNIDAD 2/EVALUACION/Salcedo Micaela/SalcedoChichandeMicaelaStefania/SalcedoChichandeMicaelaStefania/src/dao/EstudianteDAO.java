package dao;

import java.util.ArrayList;
import java.util.List;
import model.Estudiante;

public class EstudianteDAO {
    // Lista que almacena los estudiantes en memoria
    private List<Estudiante> estudiantes = new ArrayList<>();
    /**
     * Agrega un nuevo estudiante a la lista
     * @param e objeto Estudiante a agregar
     */
    public void agregar(Estudiante e) {
        estudiantes.add(e);
    }
    /**
     * Devuelve la lista completa de estudiantes almacenados
     * @return lista de estudiantes
     */
    public List<Estudiante> listar() {
        return estudiantes;
    }
    /**
     * Busca un estudiante por su ID
     * @param id identificador del estudiante
     * @return el estudiante encontrado o null si no existe
     */
    public Estudiante buscarPorId(int id) {
        for (Estudiante e : estudiantes) {
            if (e.getId() == id) {
                return e;
            }
        }
        return null;
    }
    /**
     * Actualiza un estudiante existente en la lista
     * @param estudianteActualizado objeto Estudiante con los datos nuevos
     * @return true si se actualizó exitosamente, false si no se encontró
     */
    public boolean actualizar(Estudiante estudianteActualizado) {
        for (int i = 0; i < estudiantes.size(); i++) {
            if (estudiantes.get(i).getId() == estudianteActualizado.getId()) {
                estudiantes.set(i, estudianteActualizado);
                return true; // actualizado exitosamente
            }
        }
        return false; // no encontrado
    }
    /**
     * Elimina un estudiante de la lista según su ID
     * @param id identificador del estudiante a eliminar
     * @return true si se eliminó al menos un estudiante, false si no se encontró
     */
    public boolean eliminar(int id) {
        return estudiantes.removeIf(e -> e.getId() == id);
    }
}

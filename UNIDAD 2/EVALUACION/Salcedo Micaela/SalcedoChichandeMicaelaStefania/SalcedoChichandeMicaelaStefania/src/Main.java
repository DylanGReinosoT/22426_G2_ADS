
package ui;
import controller.EstudianteController;
import model.Estudiante;

public class Main {
    public static void main(String[] args) {

        javax.swing.SwingUtilities.invokeLater(() -> {
            // Crear y mostrar la ventana principal
            new EstudianteUI();
        });
    }
}


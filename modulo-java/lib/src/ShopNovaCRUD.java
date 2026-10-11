
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Scanner;


public class ShopNovaCRUD {

    private static final String URL =
            "jdbc:mysql://localhost:3306/shopnova";

    private static final String USUARIO = "root";

    // Cambia este valor por la contraseña de tu MySQL.
    private static final String CLAVE = "Mysql2026!";

    public static Connection conectar() throws SQLException {
        return DriverManager.getConnection(URL, USUARIO, CLAVE);
    }

    public static void registrar(String nombre) {
        String sql = "INSERT INTO categorias (nombre) VALUES (?)";

        try (Connection conexion = conectar();
             PreparedStatement consulta =
                     conexion.prepareStatement(sql)) {

            consulta.setString(1, nombre);
            consulta.executeUpdate();

            System.out.println("Categoría registrada correctamente.");

        } catch (SQLException e) {
            System.out.println("Error al registrar: " + e.getMessage());
        }
    }

    public static void consultar() {
        String sql = "SELECT id_categoria, nombre FROM categorias";

        try (Connection conexion = conectar();
             PreparedStatement consulta =
                     conexion.prepareStatement(sql);
             ResultSet resultado = consulta.executeQuery()) {

            System.out.println("\n--- CATEGORÍAS DE SHOPNOVA ---");

            while (resultado.next()) {
                System.out.println(
                    resultado.getInt("id_categoria") + " - " +
                    resultado.getString("nombre")
                );
            }

        } catch (SQLException e) {
            System.out.println("Error al consultar: " + e.getMessage());
        }
    }

    public static void actualizar(int id, String nombre) {
        String sql =
                "UPDATE categorias SET nombre = ? WHERE id_categoria = ?";

        try (Connection conexion = conectar();
             PreparedStatement consulta =
                     conexion.prepareStatement(sql)) {

            consulta.setString(1, nombre);
            consulta.setInt(2, id);

            int filas = consulta.executeUpdate();

            if (filas > 0) {
                System.out.println("Categoría actualizada correctamente.");
            } else {
                System.out.println("No se encontró esa categoría.");
            }

        } catch (SQLException e) {
            System.out.println("Error al actualizar: " + e.getMessage());
        }
    }

    public static void eliminar(int id) {
        String sql = "DELETE FROM categorias WHERE id_categoria = ?";

        try (Connection conexion = conectar();
             PreparedStatement consulta =
                     conexion.prepareStatement(sql)) {

            consulta.setInt(1, id);

            int filas = consulta.executeUpdate();

            if (filas > 0) {
                System.out.println("Categoría eliminada correctamente.");
            } else {
                System.out.println("No se encontró esa categoría.");
            }

        } catch (SQLException e) {
            System.out.println("Error al eliminar: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        int opcion;

        do {
            System.out.println("\n===== SHOPNOVA =====");
            System.out.println("1. Registrar categoría");
            System.out.println("2. Consultar categorías");
            System.out.println("3. Actualizar categoría");
            System.out.println("4. Eliminar categoría");
            System.out.println("0. Salir");
            System.out.print("Selecciona una opción: ");

            try {
                opcion = Integer.parseInt(entrada.nextLine());

                switch (opcion) {
                    case 1:
                        System.out.print("Nombre de la categoría: ");
                        registrar(entrada.nextLine().trim());
                        break;

                    case 2:
                        consultar();
                        break;

                    case 3:
                        System.out.print("ID de la categoría: ");
                        int idActualizar =
                                Integer.parseInt(entrada.nextLine());

                        System.out.print("Nuevo nombre: ");
                        actualizar(idActualizar,
                                entrada.nextLine().trim());
                        break;

                    case 4:
                        System.out.print("ID de la categoría a eliminar: ");
                        int idEliminar =
                                Integer.parseInt(entrada.nextLine());

                        System.out.print(
                                "¿Seguro que deseas eliminarla? (SI/NO): ");

                        if (entrada.nextLine().equalsIgnoreCase("SI")) {
                            eliminar(idEliminar);
                        } else {
                            System.out.println("Operación cancelada.");
                        }
                        break;

                    case 0:
                        System.out.println("Programa finalizado.");
                        break;

                    default:
                        System.out.println("Opción no válida.");
                }

            } catch (NumberFormatException e) {
                System.out.println("Debes escribir un número válido.");
                opcion = -1;
            }

        } while (opcion != 0);

        entrada.close();
    }
}

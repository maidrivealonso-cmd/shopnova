

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Scanner;

public class ShopNovaCRUD {

    private static final String URL =
            "jdbc:mysql://localhost:3306/shopnova";

    public static Connection conectar() throws SQLException {
        Properties config = new Properties();

        try (FileInputStream archivo =
                     new FileInputStream("config.properties")) {
            config.load(archivo);

        } catch (IOException e) {
            throw new SQLException(
                    "No se pudo leer config.properties. "
                    + "Verifica que exista dentro de modulo-java.", e);
        }

        String usuario = config.getProperty("DB_USER");
        String clave = config.getProperty("DB_PASSWORD");

        if (usuario == null || usuario.trim().isEmpty()
                || clave == null || clave.isEmpty()) {
            throw new SQLException(
                    "Falta configurar DB_USER o DB_PASSWORD "
                    + "en config.properties.");
        }

        return DriverManager.getConnection(URL, usuario, clave);
    }

    // Registrar una categoría
    public static void registrar(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            System.out.println("El nombre no puede estar vacío.");
            return;
        }

        String sql = "INSERT INTO categorias (nombre) VALUES (?)";

        try (Connection conexion = conectar();
             PreparedStatement consulta =
                     conexion.prepareStatement(sql)) {

            consulta.setString(1, nombre.trim());
            consulta.executeUpdate();

            System.out.println(
                    "Categoría registrada correctamente.");

        } catch (SQLException e) {
            System.out.println(
                    "Error al registrar: " + e.getMessage());
        }
    }

    // Consultar las categorías
    public static void consultar() {
        String sql =
                "SELECT id_categoria, nombre FROM categorias";

        try (Connection conexion = conectar();
             PreparedStatement consulta =
                     conexion.prepareStatement(sql);
             ResultSet resultado = consulta.executeQuery()) {

            System.out.println("\n--- CATEGORÍAS DE SHOPNOVA ---");

            boolean hayCategorias = false;

            while (resultado.next()) {
                hayCategorias = true;

                System.out.println(
                        resultado.getInt("id_categoria")
                        + " - "
                        + resultado.getString("nombre"));
            }

            if (!hayCategorias) {
                System.out.println(
                        "No hay categorías registradas.");
            }

        } catch (SQLException e) {
            System.out.println(
                    "Error al consultar: " + e.getMessage());
        }
    }

    // Actualizar una categoría
    public static void actualizar(int id, String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            System.out.println("El nombre no puede estar vacío.");
            return;
        }

        String sql =
                "UPDATE categorias SET nombre = ? "
                + "WHERE id_categoria = ?";

        try (Connection conexion = conectar();
             PreparedStatement consulta =
                     conexion.prepareStatement(sql)) {

            consulta.setString(1, nombre.trim());
            consulta.setInt(2, id);

            int filas = consulta.executeUpdate();

            if (filas > 0) {
                System.out.println(
                        "Categoría actualizada correctamente.");
            } else {
                System.out.println(
                        "No se encontró esa categoría.");
            }

        } catch (SQLException e) {
            System.out.println(
                    "Error al actualizar: " + e.getMessage());
        }
    }

    // Eliminar una categoría
    public static void eliminar(int id) {
        String sql =
                "DELETE FROM categorias WHERE id_categoria = ?";

        try (Connection conexion = conectar();
             PreparedStatement consulta =
                     conexion.prepareStatement(sql)) {

            consulta.setInt(1, id);

            int filas = consulta.executeUpdate();

            if (filas > 0) {
                System.out.println(
                        "Categoría eliminada correctamente.");
            } else {
                System.out.println(
                        "No se encontró esa categoría.");
            }

        } catch (SQLException e) {
            System.out.println(
                    "Error al eliminar: " + e.getMessage());
        }
    }

    // Menú principal
    public static void main(String[] args) {
        try (Scanner entrada = new Scanner(System.in)) {
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
                    opcion = Integer.parseInt(
                            entrada.nextLine().trim());

                    switch (opcion) {
                        case 1:
                            System.out.print(
                                    "Nombre de la categoría: ");
                            registrar(entrada.nextLine().trim());
                            break;

                        case 2:
                            consultar();
                            break;

                        case 3:
                            System.out.print(
                                    "ID de la categoría: ");
                            int idActualizar = Integer.parseInt(
                                    entrada.nextLine().trim());

                            System.out.print("Nuevo nombre: ");
                            String nuevoNombre =
                                    entrada.nextLine().trim();

                            actualizar(idActualizar, nuevoNombre);
                            break;

                        case 4:
                            System.out.print(
                                    "ID de la categoría a eliminar: ");
                            int idEliminar = Integer.parseInt(
                                    entrada.nextLine().trim());

                            System.out.print(
                                    "¿Seguro que deseas eliminarla? (SI/NO): ");

                            if (entrada.nextLine()
                                    .trim().equalsIgnoreCase("SI")) {
                                eliminar(idEliminar);
                            } else {
                                System.out.println(
                                        "Operación cancelada.");
                            }
                            break;

                        case 0:
                            System.out.println(
                                    "Programa finalizado.");
                            break;

                        default:
                            System.out.println(
                                    "Opción no válida.");
                    }

                } catch (NumberFormatException e) {
                    System.out.println(
                            "Debes escribir un número válido.");
                    opcion = -1;
                }

            } while (opcion != 0);
        }
    }
}

/* ==========================================
   SHOPNOVA - FUNCIONES JAVASCRIPT
========================================== */


/* ==========================================
   DETALLE DEL PRODUCTO
========================================== */

let colorSeleccionado = "Blanco";
let tallaSeleccionada = "M";
let cantidadProducto = 1;


/* Seleccionar color */

document.querySelectorAll(".color").forEach(function(boton) {

    boton.addEventListener("click", function() {

        document.querySelectorAll(".color")
            .forEach(function(b) {
                b.classList.remove("seleccionado");
            });

        boton.classList.add("seleccionado");

        colorSeleccionado =
            boton.dataset.color;

    });

});


/* Seleccionar talla */

document.querySelectorAll(".tallas button")
.forEach(function(boton) {

    boton.addEventListener("click", function() {

        document.querySelectorAll(".tallas button")
            .forEach(function(b) {
                b.classList.remove("seleccionada");
            });

        boton.classList.add("seleccionada");

        tallaSeleccionada =
            boton.dataset.talla;

    });

});


/* Botón MENOS */

const botonMenos =
    document.getElementById("menos");

if (botonMenos) {

    botonMenos.addEventListener("click", function() {

        if (cantidadProducto > 1) {

            cantidadProducto--;

            document.getElementById("cantidad")
                .textContent = cantidadProducto;

        }

    });

}


/* Botón MÁS */

const botonMas =
    document.getElementById("mas");

if (botonMas) {

    botonMas.addEventListener("click", function() {

        cantidadProducto++;

        document.getElementById("cantidad")
            .textContent = cantidadProducto;

    });

}


/* ==========================================
   AGREGAR PRODUCTO AL CARRITO
========================================== */

const botonAgregar =
    document.getElementById("agregarCarrito");

if (botonAgregar) {

    botonAgregar.addEventListener("click", function() {

        let carrito =
            JSON.parse(localStorage.getItem("shopnovaCarrito")) || [];


        const producto = {

            nombre: "Essential White Tee",

            precio: 95000,

            color: colorSeleccionado,

            talla: tallaSeleccionada,

            cantidad: cantidadProducto

        };


        /*
        Si ya existe el mismo producto,
        talla y color, aumenta la cantidad.
        */

        const productoExistente =
            carrito.find(function(item) {

                return item.nombre === producto.nombre &&
                       item.color === producto.color &&
                       item.talla === producto.talla;

            });


        if (productoExistente) {

            productoExistente.cantidad +=
                producto.cantidad;

        } else {

            carrito.push(producto);

        }


        localStorage.setItem(
            "shopnovaCarrito",
            JSON.stringify(carrito)
        );


        alert("Producto agregado al carrito");


        window.location.href =
            "carrito.html";

    });

}


/* ==========================================
   CARRITO
========================================== */

function mostrarCarrito() {

    const lista =
        document.getElementById("listaCarrito");


    if (!lista) {
        return;
    }


    let carrito =
        JSON.parse(localStorage.getItem("shopnovaCarrito")) || [];


    lista.innerHTML = "";


    /* Carrito vacío */

    if (carrito.length === 0) {

        lista.innerHTML = `
            <div class="carrito-vacio">
                <h2>Tu carrito está vacío</h2>
                <p>Agrega una camiseta para continuar.</p>

                <button
                    onclick="window.location.href='productos.html'">
                    Ver productos
                </button>
            </div>
        `;

        actualizarTotales();

        return;
    }


    /* Mostrar productos */

    carrito.forEach(function(producto, indice) {

        const item =
            document.createElement("div");

        item.className =
            "item-carrito";


        item.innerHTML = `

            <div class="imagen-carrito">
                Imagen
            </div>


            <div class="datos-carrito">

                <h3>
                    ${producto.nombre}
                </h3>


                <p>
                    $${producto.precio.toLocaleString("es-CO")}
                </p>


                <p>
                    Color: <strong>${producto.color}</strong>
                </p>


                <p>
                    Talla: <strong>${producto.talla}</strong>
                </p>


                <div class="cantidad-carrito">

                    <button
                        type="button"
                        onclick="cambiarCantidad(${indice}, -1)">
                        -
                    </button>


                    <span>
                        ${producto.cantidad}
                    </span>


                    <button
                        type="button"
                        onclick="cambiarCantidad(${indice}, 1)">
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="eliminar-producto"
                    onclick="eliminarProducto(${indice})">

                    Eliminar

                </button>

            </div>

        `;


        lista.appendChild(item);

    });


    actualizarTotales();

}


/* ==========================================
   CAMBIAR CANTIDAD
========================================== */

function cambiarCantidad(indice, cambio) {

    let carrito =
        JSON.parse(localStorage.getItem("shopnovaCarrito")) || [];


    if (!carrito[indice]) {
        return;
    }


    carrito[indice].cantidad += cambio;


    /* No permitir cantidad menor que 1 */

    if (carrito[indice].cantidad <= 0) {

        carrito.splice(indice, 1);

    }


    localStorage.setItem(
        "shopnovaCarrito",
        JSON.stringify(carrito)
    );


    mostrarCarrito();

}


/* ==========================================
   ELIMINAR PRODUCTO
========================================== */

function eliminarProducto(indice) {

    let carrito =
        JSON.parse(localStorage.getItem("shopnovaCarrito")) || [];


    carrito.splice(indice, 1);


    localStorage.setItem(
        "shopnovaCarrito",
        JSON.stringify(carrito)
    );


    mostrarCarrito();

}


/* ==========================================
   TOTALES
========================================== */

function actualizarTotales() {

    const subtotalElemento =
        document.getElementById("subtotal");

    const totalElemento =
        document.getElementById("total");


    if (!subtotalElemento || !totalElemento) {
        return;
    }


    let carrito =
        JSON.parse(localStorage.getItem("shopnovaCarrito")) || [];


    let subtotal = 0;


    carrito.forEach(function(producto) {

        subtotal +=
            producto.precio *
            producto.cantidad;

    });


    subtotalElemento.textContent =
        "$" + subtotal.toLocaleString("es-CO");


    totalElemento.textContent =
        "$" + subtotal.toLocaleString("es-CO");

}


/* ==========================================
   BUSCADOR DE PRODUCTOS
========================================== */

const buscador =
    document.getElementById("buscadorProductos");


if (buscador) {

    buscador.addEventListener("input", function() {

        const texto =
            buscador.value
                .toLowerCase()
                .trim();


        const productos =
            document.querySelectorAll(
                ".tarjeta-producto"
            );


        let encontrados = 0;


        productos.forEach(function(producto) {

            const nombre =
                producto.dataset.nombre
                    .toLowerCase();


            if (nombre.includes(texto)) {

                producto.style.display = "";

                encontrados++;

            } else {

                producto.style.display = "none";

            }

        });


        const sinResultados =
            document.getElementById("sinResultados");


        if (sinResultados) {

            if (encontrados === 0) {

                sinResultados.style.display =
                    "block";

            } else {

                sinResultados.style.display =
                    "none";

            }

        }

    });

}


/* ==========================================
   INICIAR CARRITO
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarCarrito();

    }
);
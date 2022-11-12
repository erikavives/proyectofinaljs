/////Carrito de compras de video juegos/////

const listado = document.getElementById("listado");
const listadoProductos = "json/data.json";

let productos;

fetch(listadoProductos)
  .then((respuesta) => respuesta.json())
  .then((datos) => {
    mostrarProductos(datos);
    productos = datos;
  })
  .catch((error) => console.log(error))
  .finally(() => console.log("Proceso Finalizado"));

/// Array carrito

let carrito = [];

if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
}

const contenedorProductos = document.getElementById("contenedorProductos");

const mostrarProductos = (datos) => {
  datos.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("col-xl-6", "col-md-6", "col-xs-12");
    card.innerHTML = `
            <div class="card border-light mb-3">
                <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                <h5 class="card-title"> ${producto.nombre} </h5>
                <p class="card-text"> ${producto.precio} </p>
                <button class="btn colorBoton" id="boton${producto.id}"> Agregar al Carrito </button>
                </div>
            </div>
        `;
    contenedorProductos.appendChild(card);

    //Agregar productos al carrito:
    const boton = document.getElementById(`boton${producto.id}`);
    boton.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Tu juego se agrego al carrito",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  });
};

//Función agregar al carrito:

const agregarAlCarrito = (id) => {
  const producto = productos.find((producto) => producto.id === id);
  const productoEnCarrito = carrito.find((producto) => producto.id === id);
  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push ({...producto, cantidad: 1} );
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  calcularTotal();
};

//mostrarProductos();

const contenedorCarrito = document.getElementById("contenedorCarrito");

const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
  mostrarCarrito();
});

const mostrarCarrito = () => {
  contenedorCarrito.innerHTML = "";
  carrito.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("col-xl-6", "col-md-6", "col-xs-12");
    card.innerHTML = `
            <div class="card border-warning mb-3">
                <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="card-body">
                <h5 class="card-title"> ${producto.nombre} </h5>
                <p class="card-text"> ${producto.precio} </p>
                <p class="card-text"> ${producto.cantidad} </p>
                <button class="btn colorBoton" id="eliminar${producto.id}"> Eliminar Producto </button>
                </div>
            </div>
        `;
    contenedorCarrito.appendChild(card);

    //Eliminar productos del carrito:
    const boton = document.getElementById(`eliminar${producto.id}`);
    boton.addEventListener("click", () => {
      eliminarDelCarrito(producto.id);
      Swal.fire({
        title: "Estas seguro que quieres eliminar este producto?",
        text: "Estas por eliminar un juego del carrito!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Borrado!", "Tu juego fue.", "success");
        }
      });
    });
  });
  calcularTotal();
};

const eliminarDelCarrito = (id) => {
  const producto = carrito.find((producto) => producto.id === id);
  const indice = carrito.indexOf(producto);
  carrito.splice(indice, 1);
  mostrarCarrito();

  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
  eliminarTodoElCarrito();
});

const eliminarTodoElCarrito = () => {
  carrito = [];
  mostrarCarrito();

  localStorage.clear();
};

const total = document.getElementById("total");

const calcularTotal = () => {
  let totalCompra = 0;
  carrito.forEach((producto) => {
    totalCompra = totalCompra + producto.precio * producto.cantidad;
  });
  total.innerHTML = `Total: $${totalCompra}`;
};

//finalizar compra
const finalizarCompra= document.getElementById("finalizarCompra");
finalizarCompra.addEventListener("click",() => {
  eliminarTodoElCarrito();
  Swal.fire({
    title: 'Gracias por tu compra!',
    text: 'Que lo difrutes, vuelva pronto.',
    imageUrl: 'img/bannerlogotwitch.png',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
  })
  localStorage.clear();
});

const header = document.querySelector("#header");
const contenedor = document.querySelector("#contenedorc");
const body = document.querySelector("body");
window.addEventListener("scroll", function(){
    if(contenedor.getBoundingClientRect().top<10){
        header.classList.add("scroll")
    }
    else{
        header.classList.remove("scroll")
    }
})

function eliminarProducto(productoId) {
    const producto = document.getElementById(productoId);
    if (producto) {
        producto.remove();
    }
}


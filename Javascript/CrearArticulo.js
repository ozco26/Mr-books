function cargarImagen() {
    var inputImagen = document.getElementById('imagen');
    var imagenLibro = document.getElementById('imagenLibro');


    if (inputImagen.files && inputImagen.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imagenLibro.src = e.target.result;
        };

        reader.readAsDataURL(inputImagen.files[0]);
    }
}
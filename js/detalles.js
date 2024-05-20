function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // agregar otros valores predeterminados si es necesario
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}


async function cargar_datos() {
    await fetch('../assets/productos.JSON') 
        .then(resp => resp.json())
        .then((res) => { lista_productos = res })
        .catch(err => console.error(err))

    // OBTENEMOS EL PRODUCTO QUE SACAMOS DE LA COOKIE    
    let productos = Object.values(lista_productos)
    let identificador = getCookie('producto_buscado')
    let producto_elegido

    productos.forEach(producto => {
        if (producto.name == identificador){
            producto_elegido = producto
        }
    });
    
    // Obtenemos la img principal
    const mainIMG = document.getElementById('img_main')
    // Obtenemos el container de imagenes
    const contIMG = document.getElementById('container_img')

    // CARGARMOS LAS FOTOS
    for (i = 0; i < producto_elegido.img.length; i++) {
        let container = document.createElement('li')
        container.innerHTML = `<img class="img_opt" src="../assets/${producto_elegido.img[i]}" alt="producto_elegido.name">`
        if(i == 0){
            mainIMG.src = '../assets/'+ producto_elegido.img[i]
            container.classList.add('img_elegida')
        }
        contIMG.appendChild(container)
        
    }



    const optIMG = document.querySelectorAll(".img_opt")

    mainIMG.classList

    optIMG.forEach(element => {
        element.addEventListener('click', (e) => {
            let imgTarget = e.target.src
            let imgMain = mainIMG.src
            const elegida = document.querySelectorAll(".img_elegida")
            elegida.forEach(element => {
                element.classList.remove('img_elegida')
            });

            e.target.parentElement.classList.add('img_elegida')
            mainIMG.src = imgTarget

        })
    });

}

cargar_datos()





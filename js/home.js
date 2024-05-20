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

let lista_productos

// CARGAMOS PRODUCTOS EN LA PAGINA
function fetchQuestions(){
    fetch('./assets/productos.JSON') //Como estamos en el mismo servidor
    .then(resp => resp.json())
    .then((res)=>{productos = res})
    .catch(err => console.error(err))
}


async function cargar_datos(){
    await fetch('./assets/productos.JSON') //Como estamos en el mismo servidor
        .then(resp => resp.json())
        .then((res)=>{lista_productos = res})
        .catch(err => console.error(err))
    
    let productos = Object.values(lista_productos)
    productos.forEach(producto =>{

        let container = document.createElement('div')
        container.classList.add('card-container')
        container.innerHTML =`<article class="card-main"> <div class="header-card"> <img src="assets/${producto.img[0]}" alt="${producto.name}"> </div> <div class="body-card"> <h2>${producto.titulo}</h2> <h3>Descripcion</h3> <p>${producto.desc}</p> </div><div class="footer-card"> <button class='button-ver-mas' id='${producto.name}'>Ver producto</a> </div> </article>`
        let container_productos = document.getElementById('container_productos')
        container_productos.appendChild(container)
    });
    const botones_ver = document.querySelectorAll(".button-ver-mas")    
    botones_ver.forEach(boton =>{
        boton.addEventListener('click',(e)=>{
            e.preventDefault()
            let name_producto = e.target.id
            setCookie('producto_buscado',name_producto, {secure : true, 'max-age': 10000})
            setTimeout(() => {
                location.href = './pages/detalles.html' 
            }, 1000);
        })
    })


}

cargar_datos()



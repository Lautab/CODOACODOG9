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

    // CARGAMOS EL TTULO, LA DESCRIPCION Y EL PRECIO
    const formulario = document.getElementById('producto_formulario')

    const display_titulo = document.getElementById('producto_titulo')
    const display_desc = document.getElementById('producto_desc')
    const display_precio = document.getElementById('producto_precio')
    const form_precio = document.getElementById('producto_precio_inv')
    const form_nombre = document.createElement('input')
    
    
    display_titulo.innerText = producto_elegido.name
    display_desc.innerText = producto_elegido.desc  
    display_precio.innerHTML = producto_elegido.price[0]
    form_precio.setAttribute('value', producto_elegido.price[0])
    
    form_nombre.classList.add('oculto')
    form_nombre.setAttribute('value', producto_elegido.name)
    form_nombre.readOnly = true
    form_nombre.name = 'nombre'
    formulario.appendChild(form_nombre)

    // CARGAMOS LAS OPCIONES
    const display_opc = document.getElementById('producto_opc')
    const llaves = Object.keys(producto_elegido.opt)
    const valores = Object.values(producto_elegido.opt)
    
    for (i = 0; i < llaves.length; i++) {
        let opcion = llaves[i] == 'color' ? 'Color' : llaves[i] == 'size' ? 'Tamaño' : llaves[i] == 'kg' ? 'Cantidad' : llaves[i] == 'sabor' ? 'Sabor' : llaves[i]
        
        let container = document.createElement('div')
        container.classList.add('opciones-container')
        container.innerHTML = `<h3>${opcion}</h3>`

        let opc_container = document.createElement('div')
        opc_container.classList.add('opt-container')


        for(k = 0; k < valores.length; k++){
            if (k == 0){
                opc_container.innerHTML = opc_container.innerHTML + `<label class="boton-elegido boton-input boton-${llaves[i]}" for="${valores[i][k]}">${valores[i][k]} <input type="checkbox" ${llaves[i] == 'kg' ? 'price='+ producto_elegido.price[k] : ""} checked name="${llaves[i]}" value="${valores[i][k]}" id="${valores[i][k]}"></label>`

            }else{
                opc_container.innerHTML = opc_container.innerHTML + `<label class="boton-input boton-${llaves[i]}" for="${valores[i][k]}">${valores[i][k]} <input  type="checkbox"  ${llaves[i] == 'kg' ? 'price='+ producto_elegido.price[k] : ""}   name="${llaves[i]}" value="${valores[i][k]}" id="${valores[i][k]}"></label>`
            }
        }
        container.appendChild(opc_container)
        display_opc.appendChild(container)
    }

    
    // DAMOS FUNCIONALIDAD A LOS BOTONES DE OPCIONES
    let botones_posibles = document.querySelectorAll('.boton-input')

    botones_posibles.forEach(boton=>{
        boton.addEventListener('click',(e)=>{
            let identificador = e.target.name
            let botones_iguales = document.querySelectorAll(`.boton-${identificador}`)
            botones_iguales.forEach(btn =>{
                if (btn.getAttribute('for') != e.target.id){
                    btn.classList.remove('boton-elegido')
                    btn.children.checked = false
                }
                else if (btn.getAttribute('for') == e.target.id){
                    btn.classList.add('boton-elegido')
                    btn.children.checked = true
                    if (e.target.getAttribute('price') != null){
                        display_precio.innerText = e.target.getAttribute('price')
                        form_precio.setAttribute('value', e.target.getAttribute('price'))
                    }
                }
            })

        })
    })

    // DAMOS FUNCIONALIDAD AL BOTON DE  AGREGAR AL CARRITO
    formulario.addEventListener('submit', (e)=>{
        e.preventDefault()
        const data = new FormData(e.target);
        const dataObject = Object.fromEntries(data.entries());

        dataCookie = JSON.stringify(dataObject)
        
        //Obtener datos de las cookies
        let productos_carrito = getCookie('carrito')
        let carrito = productos_carrito
        //Subir datos a las cookies
        
        if(carrito == ''){
            carrito = `"producto1":${dataCookie}`
        }else if (carrito != ''){
            let rand = Math.ceil(Math.random()*20000)
            carrito += `,"producto${rand}":${dataCookie}` 
        }else{
            console.warn('Error ')
        }
        setCookie('carrito', carrito, {secure:true})
        console.log(getCookie('carrito'));

        // COMO VOLVER A OBTENER LOS DATOS
        // JSON.parse(`{${getCookie('carrito')}}`)
    })
    

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





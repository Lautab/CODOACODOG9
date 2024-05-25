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

function calcularPrecio() {
    const todos_precios = document.getElementsByName('todos_los_precios')
    const todas_cantidades = document.getElementsByName('todas_las_cantidades')
    const total_pagar = document.getElementById('totalPagar')
    let total = 0
    for (i = 0; i < todas_cantidades.length; i++) {

        let precio_formateado = parseInt(todos_precios[i].innerText.replace('.', '').replace('$', ''))
        precio_formateado = precio_formateado * parseInt(todas_cantidades[i].innerText)

        total += precio_formateado

        precio_formateado = new Intl.NumberFormat("de-DE").format(precio_formateado);

        todos_precios[i].innerText = '$ ' + precio_formateado
    }
    total = new Intl.NumberFormat("de-DE").format(total);
    total_pagar.innerHTML = '$ ' + total
}


function guardar_cantidad(identificador, cantidad) {
    let carrito = JSON.parse(`{${getCookie('carrito')}}`)
    carrito[identificador].cantidad = cantidad
    let dataCookie = JSON.stringify(carrito)
    dataCookie = dataCookie.split('')
    dataCookie.pop()
    dataCookie.shift()
    dataCookie = dataCookie.join('')
    setCookie('carrito', dataCookie, { secure: true, 'max-age': 200000 })
}

function eliminar_producto(identificador) {
    let carrito = JSON.parse(`{${getCookie('carrito')}}`)
    console.log(carrito);
    delete carrito[identificador]
    let dataCookie = JSON.stringify(carrito)
    dataCookie = dataCookie.split('')
    dataCookie.pop()
    dataCookie.shift()
    dataCookie = dataCookie.join('')
    setCookie('carrito', dataCookie, { secure: true, 'max-age': 200000 })
}

const productos_container = document.getElementById('productos_container')
const checkout_container = document.getElementById('checkout_container')


async function cargar_datos() {
    await fetch('../assets/productos.JSON')
        .then(resp => resp.json())
        .then((res) => { lista_productos = res })
        .catch(err => console.error(err))


    let carrito = JSON.parse(`{${getCookie('carrito')}}`)
    let valores = Object.values(carrito)
    var llaves = Object.keys(carrito)
    // CREAR DISPLAY PRODUCTO
    let carrito_buscado = []
    for (i = 0; i < llaves.length; i++) {
        let elemento_buscado
        Object.values(lista_productos).forEach(elemento => {
            if (valores[i].nombre == elemento.name) {
                elemento_buscado = elemento
            }
        })
        let elegido = [elemento_buscado, valores[i]]
        carrito_buscado.push(elegido)
    }
    if (carrito_buscado.length > 0) {
        let contador = 0
        carrito_buscado.forEach(elemento => {
            let producto = elemento[0]
            let detalles = elemento[1]
            let opciones = []
            let detalles_llaves = Object.keys(detalles)


            detalles_llaves.forEach(llave => {
                if ('kg size color sabor'.includes(llave)) {
                    opciones.push([llave, detalles[llave]])
                }

            })

            let opciones_formateadas = []
            opciones.forEach(opcion => {
                let opcion_formateada = opcion[0] == 'color' ? 'Color' : opcion[0] == 'size' ? 'Tamaño' : opcion[0] == 'kg' ? 'Cantidad' : opcion[0] == 'sabor' ? 'Sabor' : opcion[0]
                let output = `<li name="modelos_formatear">
                ${opcion_formateada}: ${opcion[1]}
                </li>`
                opciones_formateadas.push(output)
            })

            let container = document.createElement('div')
            container.classList.add('producto-carrito')
            container.innerHTML = `<div class="izq">
        <img src="../assets/${producto.img[0]}" alt="ejemplo">
        <div class="detalle">
          <div href="" id='${producto.name}' class="button-ver-mas"><h2 id='${producto.name}'>${producto.name}</h2></div>
          <h3>
          Detalle: <br>
          </h3>
          <ul>
          ${opciones_formateadas.join().replace(',', '')}
          <ul>
          </div>
          </div>
          <div class="cantidades">
          <div class="cant1">
          <button name="${llaves[contador]}" class="${contador}" id="restarCant">-</button>
          <input readOnly name="Cantidad" id="${contador}" class="cantidad" value="${detalles.cantidad}" type="number"
          max="10" min="1">
          <button name="${llaves[contador]}" class="${contador}" id="sumarCant">+</button>
          </div>
          <button class="delete ${contador}" name="${llaves[contador]}" id="delete">Eliminar</button>
          </div> `
            productos_container.appendChild(container)

            let container_check = document.createElement('li')
            container_check.setAttribute('name', 'productos_checkout')
            container_check.classList.add('prod-check')
            container_check.innerHTML = `<div class="prod-check-izq"><p>${producto.titulo}</p> x<span name="todas_las_cantidades">${detalles.cantidad}</span></div><span
        name="todos_los_precios">${detalles.precio}</span>`
            checkout_container.appendChild(container_check)
            contador += 1

            const botones_ver = document.querySelectorAll(".button-ver-mas")

            botones_ver.forEach(boton => {
                boton.addEventListener('click', (e) => {
                    e.preventDefault()
                    let name_producto = e.target.id
                    setCookie('producto_buscado', name_producto, { secure: true })
                    setTimeout(() => {
                        location.href = '../pages/detalles.html'
                    }, 100);
                })
            })
        })

        calcularPrecio()

        window.addEventListener('click', (e) => {
            if (e.target.id == 'delete') {
                eliminar_producto(e.target.name)
                location.reload()
            } else if (e.target.id == 'restarCant') {
                let input = document.getElementById(e.target.getAttribute('class'))
                if (input.value > 1) {
                    input.value = parseInt(input.value) - 1
                    guardar_cantidad(e.target.getAttribute('name'), input.value)
                    location.reload()
                }
            } else if (e.target.id == 'sumarCant') {
                let input = document.getElementById(e.target.getAttribute('class'))
                if (input.value < 10) {
                    input.value = parseInt(input.value) + 1
                    guardar_cantidad(e.target.getAttribute('name'), input.value)
                    location.reload()
                }
            }
        })
    } else {
        productos_container.innerHTML = productos_container.innerHTML + '<p class="no_productos">No hay productos en el carrito</p>'

        checkout_container.innerHTML = '<li class="prod-check" name="mensaje_no_productos">No hay productos en el carrito </li>'
    }

}

cargar_datos()

const inputPago = document.getElementsByName('pago')
const buttsCant = document.getElementsByClassName('000001')


inputPago[0].addEventListener('click', () => {
    if (inputPago[1].checked) {
        inputPago[1].checked = false
    } else if (inputPago[0].checked == false) {
        inputPago[0].checked = true
    }
})
inputPago[1].addEventListener('click', () => {
    if (inputPago[0].checked) {
        inputPago[0].checked = false
    } else if (inputPago[1].checked == false) {
        inputPago[1].checked = true
    }
})


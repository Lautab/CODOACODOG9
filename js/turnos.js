const butSig = document.getElementById('butSeguir')
const butVolver = document.getElementById('butVolver')
const butEnviar = document.getElementById('butEnviar')
const containerBtns = document.getElementById('containerButtons')

const divUno = document.getElementById('containerFormUno')
const divDos = document.getElementById('containerFormDos')
const divTres = document.getElementById('containerFormTres')
const divCuatro = document.getElementById('containerFormCuatro')

let datos_formulario = []

function mostrar(etiqueta) {
    etiqueta.classList.remove("ocultar")
    etiqueta.classList.add('mostrar')
}
function ocultar(etiqueta) {
    etiqueta.classList.add('ocultar')
    etiqueta.classList.remove("mostrar")
}

function cambiarA(aOcultar, aMostrar, aEtapa) {
    aOcultar.forEach(element => {
        ocultar(element)
    });
    setTimeout(() => {
        aMostrar.forEach(element => {
            sacarClass(element, 'oculto')
            mostrar(element)
        })
    }, 950);
    etapa = aEtapa
}

function sacarClass(etiqueta, clase) {
    etiqueta.classList.remove(clase)
}


function guardarDatos(datos_formulario) {

    const formData = new FormData(document.getElementById('formTurnos'));
    for (var pair of formData.entries()) {
        datos_formulario.push(pair[0] + '%%' + pair[1])
    }
    return datos_formulario
}

function mostrarDatos(datos_formulario) {
    const displays = [
        document.getElementById('form_tres_fecha'),
        document.getElementById('form_tres_hora'),
        document.getElementById('form_tres_tel'),
        document.getElementById('form_tres_mail')
    ]
    const info = [
        datos_formulario[6].split('%%')[1],
        datos_formulario[7].split('%%')[1] + ' hs',
        datos_formulario[2].split('%%')[1],
        datos_formulario[3].split('%%')[1]
    ]

    for (let i = 0; i < 4; i++) {
        displays[i].textContent = info[i]
    }
}


let etapa = 1

butSig.addEventListener('click', () => {
    if (etapa == 1) {
        cambiarA([divUno, butSig], [divDos, containerBtns], 2)
    }
})

butVolver.addEventListener('click', () => {
    if (etapa == 2) {
        cambiarA([divDos, containerBtns], [divUno, butSig], 1)
    }
    else if (etapa == 3) {
        cambiarA([divTres], [divDos], 2)
    }
})

butEnviar.addEventListener('click', (e) => {
    if (etapa == 2) {
        datos_formulario = []
        guardarDatos(datos_formulario)
        let form_verificado = true
        for (i = 0; i < 4; i++) {
            try {
                for (let index = 0; index < 8; index++) {
                    if (datos_formulario[index].split("%%").length == 2) {
                        form_verificado = true
                    }
                }
            } catch (error) {
                form_verificado = false
            }
        }
        if (!form_verificado) {
            alert('Faltan datos por completar para enviar la solicitud')
        } else if (form_verificado) {
            cambiarA([divDos], [divTres], 3)
            mostrarDatos(datos_formulario)
        }
    }
    else if (etapa == 3) {
        cambiarA([divTres, containerBtns], [divCuatro], 4)
    }
})

window.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        if (etapa == 1) {
            cambiarA([divUno, butSig], [divDos, containerBtns], 2)
        }
        else if (etapa == 2) {
            datos_formulario = []
            guardarDatos(datos_formulario)
            let form_verificado = true
            for (i = 0; i < 4; i++) {
                try {
                    for (let index = 0; index < 8; index++) {
                        if (datos_formulario[index].split("%%").length == 2) {
                            form_verificado = true
                        }
                    }
                } catch (error) {
                    form_verificado = false
                }
            }
            if (!form_verificado) {
                alert('Faltan datos por completar para enviar la solicitud')
            } else if (form_verificado) {
                cambiarA([divDos], [divTres], 3)
                mostrarDatos(datos_formulario)
            }
        }
        else if (etapa == 3) {
            cambiarA([divTres, containerBtns], [divCuatro], 4)
        }
    }
    if (e.key == 'Escape'){
        if (etapa == 2) {
            cambiarA([divDos, containerBtns], [divUno, butSig], 1)
        }
        else if (etapa == 3) {
            cambiarA([divTres], [divDos], 2)
        }
    }
})
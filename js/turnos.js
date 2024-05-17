const butSig = document.getElementById('butSeguir')
const butVolver = document.getElementById('butVolver')
const butEnviar = document.getElementById('butEnviar')
const containerBtns = document.getElementById('containerButtons')

const divUno = document.getElementById('containerFormUno')
const divDos = document.getElementById('containerFormDos')


let etapa = 1

butSig.addEventListener('click',()=>{
    divUno.classList.remove('mostrar')
    divUno.classList.add('ocultar')
    divDos.classList.remove('ocultar')
    butSig.classList.remove('mostrar')
    butSig.classList.add('ocultar')
    containerBtns.classList.remove('ocultar')

    setTimeout(() => {
        divDos.classList.add('mostrar')
        containerBtns.classList.add('mostrar')
    }, 950);
    etapa = 2
})

butVolver.addEventListener('click', ()=>{
    divDos.classList.remove('mostrar')
    divDos.classList.add('ocultar')
    containerBtns.classList.remove('mostrar')
    containerBtns.classList.add('ocultar')
    setTimeout(() => {
        divUno.classList.remove('ocultar')
        butSig.classList.remove('ocultar')
        divUno.classList.add('mostrar')
        butSig.classList.add('mostrar')
    }, 950);
    etapa = 1
})


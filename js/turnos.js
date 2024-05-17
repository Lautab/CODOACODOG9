const butSig = document.getElementById('butSeguir')

const divUno = document.getElementById('containerFormUno')
const divDos = document.getElementById('containerFormDos')


butSig.addEventListener('click',()=>{
    divUno.style.animation = 'none';
    divUno.style.animation = 'ocultar 1s linear 0s 1 forwards normal;'
})
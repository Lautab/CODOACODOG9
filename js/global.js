const menuBurguer = document.querySelector(".nav__burguer");

menuBurguer.addEventListener("click", () => {
	console.log("click menu");

	let navList = document.querySelector(".nav__container");
	navList.classList.toggle("nav__show");
});

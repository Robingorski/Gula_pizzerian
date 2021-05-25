var menyknapp = document.getElementById('menyknapp');
var gulapizzeria = document.getElementById('top-page');
var gulapizzeriamobile = document.getElementById('top-page_mobile');
var hittaknapp = document.getElementById('hittaknapp');
var lunchknapp = document.getElementById('lunch');
var pizzaknapp = document.getElementById('pizzor');
var grillknapp = document.getElementById('grillat');
var salladknapp = document.getElementById('sallader');
var tillbehörknapp = document.getElementById('tillbehör');


menyknapp.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".pizza-meny", offsetY: 175}});
});

gulapizzeria.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".landingpage"}});
});

gulapizzeriamobile.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".landingpage"}});
});

hittaknapp.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".footer"}});
});

lunchknapp.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".dagens_lunch-meny", offsetY: 60}});
});

pizzaknapp.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".pizza-meny", offsetY: 175}});
});

grillknapp.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".grill-meny", offsetY: 150}});
});

salladknapp.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".sallad-meny", offsetY: 175}});
});

tillbehörknapp.addEventListener("click", () => {
    gsap.to(window, {duration: 1, scrollTo:{y:".tillbehör-meny"}});
});
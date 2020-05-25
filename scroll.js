import jump from './node_modules/jump.js/dist/jump.module.js';

var menyknapp = document.getElementById('menyknapp');
var gulapizzeria = document.getElementById('top-page');
var gulapizzeriamobile = document.getElementById('top-page_mobile');
var hittaknapp = document.getElementById('hittaknapp');
var lunchknapp = document.getElementById('lunch');
var pizzaknapp = document.getElementById('pizzor');
var grillknapp = document.getElementById('grillat');
var salladknapp = document.getElementById('sallader');
var tillbehörknapp = document.getElementById('tillbehör');


menyknapp.addEventListener('click', () => {
    jump('.pizza-meny', {
        duration: 1000,
        offset: -90,
    });
})

gulapizzeria.addEventListener('click', () => {
    jump('.landingpage', {
        duration: 1000,
        offset: -90,
    });
})

gulapizzeriamobile.addEventListener('click', () => {
    jump('.landingpage', {
        duration: 1000,
        offset: -90,
    });
})

hittaknapp.addEventListener('click', () => {
    jump('.footer', {
        duration: 1000,
        offset: -90,
    });
})

lunchknapp.addEventListener('click', () => {
    jump('.dagens_lunch-meny', {
        duration: 1000,
        offset: -90,
    });
})

pizzaknapp.addEventListener('click', () => {
    jump('.pizza-meny', {
        duration: 1000,
        offset: -90,
    });
})

grillknapp.addEventListener('click', () => {
    jump('.grill-meny', {
        duration: 1000,
        offset: -90,
    });
})

salladknapp.addEventListener('click', () => {
    jump('.sallad-meny', {
        duration: 1000,
        offset: -90,
    });
})

tillbehörknapp.addEventListener('click', () => {
    jump('.tillbehör-meny', {
        duration: 1000,
        offset: -90,
    });
})
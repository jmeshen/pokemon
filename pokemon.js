// globals
const max = 151;
const pokeArray = Array.from(Array(max), (val, idx) => idx + 1).sort(
  () => Math.random() - 0.5,
);
const spriteEl = $('.pokesprite');
let firstCall = true;

// Pkmn Class
class Pokemon {
  constructor(name, sprite) {
    this.name = name;
    this.sprite = sprite;
  }
}

function lockButton() {
  document.getElementById('fn-wait').disabled = true;
}

function unlockButton() {
  document.getElementById('fn-wait').disabled = false;
}

function changeResults(name) {
  $('.fn-results').html(`<span> ${name} </span>`);
  $('.fn-results').css('visibility', 'hidden');
}

function revealPokemon() {
  $('.reveal').hide();
  spriteEl.toggleClass('revealSilh');
  $('.fn-results')
    .css({ opacity: '0', visibility: 'visible' })
    .animate({ opacity: 1 }, 1200);
  $('.play-again').show();

  if ($('#pokedexText').css('display') === 'none') {
    $('#pokedexText')
      .css({ opacity: '0', display: 'block' })
      .animate({ opacity: 1 }, 1200);
  }

  $('#pokeseen')
    .html(max - pokeArray.length)
    .css({ opacity: '0' })
    .animate({ opacity: 1 }, 1200);
}

function savePkmnLS(num, pkmn) {
  localStorage.setItem(num, JSON.stringify(pkmn));
}

function getLocalData(number) {
  const { name, sprite } = JSON.parse(localStorage.getItem(number));
  spriteEl.removeClass('pokeball');
  spriteEl
    .attr('src', sprite)
    .hide()
    .fadeIn();
  changeResults(name);
}

function fetchPokemon(number) {
  const nameURL = `https://pokeapi.co/api/v2/pokemon/${number}`;

  $.ajax({
    url: nameURL,
  }).done((pokemon) => {
    const name = pokemon.name.toUpperCase();
    const spriteURL = `./sprites/${number}.png`;
    const pkmn = new Pokemon(name, spriteURL);
    spriteEl.removeClass('pokeball');
    spriteEl
      .attr('src', spriteURL)
      .hide()
      .fadeIn();
    changeResults(name);
    savePkmnLS(number, pkmn);
  });
}

function firstCatch() {
  $('.play-first').hide();
  revealPokemon();
}

function getPkmn() {
  if (pokeArray.length === 0) {
    $('#buttons-result')
      .empty()
      .html('Your Kanto Pokedex is full!<br>Play again?<br>')
      .append('<a href="/pokemon"><button>YES!</button></a>');
    return;
  }
  if (spriteEl.attr('src') !== '') {
    spriteEl.removeAttr('src');
    spriteEl.attr('src', './sprites/pokeball.png');
    spriteEl.removeClass('revealSilh');
    spriteEl.addClass('pokeball');
  }

  const number = pokeArray.shift();

  if (localStorage.getItem(number)) {
    getLocalData(number);
  } else {
    fetchPokemon(number);
  }

  $('.play-again').hide();
  if (firstCall) {
    firstCall = false;
  } else {
    lockButton();
    $('.pokesprite').on('load', unlockButton);
    $('.reveal').show();
  }
}

$(document).ready(() => {
  getPkmn();
});

// click handlers
$('.play-first').on('click', firstCatch);
$('.play-again').on('click', getPkmn);
$('.reveal').on('click', revealPokemon);

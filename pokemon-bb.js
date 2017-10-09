function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// globals
var max = 151;
var pokeArray = Array.from(Array(max), function (val, idx) {
  return idx + 1;
}).sort(function () {
  return Math.random() - 0.5;
});
var spriteEl = $('.pokesprite');
var firstCall = true; // Pkmn Class

var Pokemon = function Pokemon(name, sprite) {
  _classCallCheck(this, Pokemon);

  this.name = name;
  this.sprite = sprite;
};

function lockButton() {
  document.getElementById('fn-wait').disabled = true;
}

function unlockButton() {
  document.getElementById('fn-wait').disabled = false;
}

function changeResults(name) {
  $('.fn-results').html("<span> ".concat(name, " </span>"));
  $('.fn-results').css('visibility', 'hidden');
}

function revealPokemon() {
  $('.reveal').hide();
  spriteEl.toggleClass('revealSilh');
  $('.fn-results').css({
    opacity: '0',
    visibility: 'visible'
  }).animate({
    opacity: 1
  }, 1200);
  $('.play-again').show();

  if ($('#pokedexText').css('display') === 'none') {
    $('#pokedexText').css({
      opacity: '0',
      display: 'block'
    }).animate({
      opacity: 1
    }, 1200);
  }

  $('#pokeseen').html(max - pokeArray.length).css({
    opacity: '0'
  }).animate({
    opacity: 1
  }, 1200);
}

function savePkmnLS(num, pkmn) {
  localStorage.setItem(num, JSON.stringify(pkmn));
}

function getLocalData(number) {
  var _JSON$parse = JSON.parse(localStorage.getItem(number)),
      name = _JSON$parse.name,
      sprite = _JSON$parse.sprite;

  spriteEl.removeClass('pokeball');
  spriteEl.attr('src', sprite).hide().fadeIn();
  changeResults(name);
}

function fetchPokemon(number) {
  var nameURL = "http://pokeapi.co/api/v1/pokemon/".concat(number);
  $.ajax({
    type: 'GET',
    url: nameURL,
    dataType: 'jsonp',
    success: function success(pokemon) {
      var name = pokemon.name.toUpperCase();
      var spriteURL = "./sprites/".concat(number, ".png");
      var pkmn = new Pokemon(name, spriteURL);
      spriteEl.removeClass('pokeball');
      spriteEl.attr('src', spriteURL).hide().fadeIn();
      changeResults(name);
      savePkmnLS(number, pkmn);
    }
  });
}

function firstCatch() {
  $('.play-first').hide();
  revealPokemon();
}

function getPkmn() {
  if (pokeArray.length === 0) {
    $('#buttons-result').empty().html('Your Kanto Pokedex is full!<br>Play again?<br>').append('<a href="/pokemon"><button>YES!</button></a>');
    return;
  }

  if (spriteEl.attr('src') !== '') {
    spriteEl.removeAttr('src');
    spriteEl.attr('src', './sprites/pokeball.png');
    spriteEl.removeClass('revealSilh');
    spriteEl.addClass('pokeball');
  }

  var number = pokeArray.shift();

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

$(document).ready(function () {
  getPkmn();
}); // click handlers

$('.play-first').on('click', firstCatch);
$('.play-again').on('click', getPkmn);
$('.reveal').on('click', revealPokemon);

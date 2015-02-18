// globals
var max = 151;
var pokeArray = [];
var sprite = $('.pokesprite');
var firstCall = true;

Array.prototype.shuffle = function () {
  var i = this.length, j, temp;
  if ( i == 0 ) return;
  while ( --i ) {
    j = Math.floor( Math.random() * ( i + 1 ) );
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
};

// Pkmn Class
function Pkmn(name, sprite) {
  this.name = name;
  this.sprite = sprite;
}

$(document).ready(function() {
  pokePool(max);
  getPkmn();
  //console.log(pokeArray);
});

$('.play-first').on('click', firstCatch);
$('.play-again').on('click', getPkmn);
$('.reveal').on('click', revealPokemon);

function pokePool(max) {
  for (i = 1; i <= max; i++) {
    pokeArray.push(i.toString());
  } 
  pokeArray.shuffle();
}

function firstCatch() {
  $('.play-first').hide();
  revealPokemon();
}

function getPkmn() {
  var number = pokeArray.shift();
  
  if (sprite.attr('src') != "") {
    sprite.removeAttr('src');
    sprite.removeClass('revealSilh');
  }
  
  if (pokeArray.length == 0) {
    $('#buttons-result').empty()
                        .html("Your Kanto Pokedex is full!<br>Play again?<br>")
                        .append('<a href="/pokemon"><button>YES!</button></a>'); 
    return;
  }
  //console.log(number);

  if (localStorage.getItem(number)) {
    getLocalData(number);
  } else {
    pkData(number, storeObj);
    //storePkmn(max);
  }
  
  $('.play-again').hide();
  
  if (firstCall) {
    firstCall = false;
    return;
  }

  $('.reveal').show();
}

function getLocalData(number) {
  var pkSprite = JSON.parse(localStorage.getItem(number)).sprite;
  var name = JSON.parse(localStorage.getItem(number)).name;
  sprite.attr('src', pkSprite).hide().fadeIn();
  //console.log("Got " + name + " from localStorage!");
  changeResults(name);
}

function changeResults(name) {
  $('.fn-results').html('<span> ' + name + ' </span>');
  $('.fn-results').css('visibility', 'hidden');
}

function revealPokemon() {
  $('.reveal').hide();
  sprite.toggleClass('revealSilh');
  $('.fn-results').css({'opacity': '0', 'visibility': 'visible'})
                  .animate({opacity: 1}, 1200);
  $('.play-again').show();
  
  if ($('#pokedexText').css('display') == 'none') {
    $('#pokedexText').css({'opacity': '0', 'display': 'block'})
                     .animate({opacity: 1}, 1200);

  }
  $('#pokeseen').html(max - pokeArray.length)
                .css({'opacity': '0'})
                .animate({opacity: 1}, 1200);
}

// store data into localStorage
//var pokeData = [];
function storeObj(num, pkmn) {
  //pokeData.push(pkmn);
  localStorage.setItem(num, JSON.stringify(pkmn));
  //console.log("Stored " + pkmn.name + " to localStorage");
}

function pkData(number, storeObj) {
  var nameURL = "http://pokeapi.co/api/v1/pokemon/" + number;

  $.ajax({     
    type: "GET",
    url: nameURL,
    dataType: 'jsonp',
    success: function(pokemon) {    
      var name = pokemon.name.toUpperCase();
      var spriteURL = "http://pokeapi.co/media/img/" + number + ".png"; 
      var pkmn = new Pkmn(name, spriteURL);
      sprite.attr('src', spriteURL).show(); 
      changeResults(name);
      storeObj(number, pkmn);
    }    
  });
}

function randPokemon() {
  return Math.floor((Math.random() * max) + 1).toString();
}
function storePkmn(max) {
  for (i = 1; i <= max; i++) {
    console.log(i);
    pkData(i, storeObj);
  }  
}


/** TODO --
  * track state of buttons
  * store functions as methods of Pkmn class
  * allow region selection at end of 151/region pokedex full
  * revisit memoization vs selection pool
  * store pkmn in the background during play
  */


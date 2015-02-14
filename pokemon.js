/* session storage

function Pkmn(name, number, sprite) {
  this.name = name;
  this.number = number;
  this.sprite = sprite;
};
*/
// var memo = [];

var max = 151;
var pokeArray = [];
var sprite = $('.pokesprite');
var firstCall = true;

Array.prototype.shuffle = function (){
  var i = this.length, j, temp;
  if ( i == 0 ) return;
  while ( --i ) {
    j = Math.floor( Math.random() * ( i + 1 ) );
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
};

$('.play-first').on('click', firstCatch);
$('.play-again').on('click', getPokemon);
$('.reveal').on('click', revealPokemon);

$(document).ready(function(){
  pokePool(max);
  console.log(pokeArray);
  getPokemon();
});
function pokePool(max) {
  
  for (i = 1; i <= max; i++) {
    pokeArray.push(i.toString());
  } 
  pokeArray.shuffle();
}

function firstCatch() {
  //firstCall = false;
  $('.play-first').hide();
  revealPokemon();
}

function randPokemon() {
  return Math.floor((Math.random() * 15) + 1).toString();
}

function getPokemon(){

  
  if (sprite.attr('src') != ""){
    sprite.removeAttr('src');
    sprite.removeClass('revealSilh');
  }
 
  if (pokeArray.length == 0) {
    $('#buttons-result').empty().html("Your Kanto Pokedex is full!<br>Play again?<br>").append('<a href="/pokemon"><button>YES!</button></a>'); // use refresh button href="/"
    return;
  }
  // i want to store the number of the pokemon that have appeared in the memo array
  // when i call getPokemon and generate a random number using randPokemon(); immediately check if number exists in memo
  // if exists, pick new number
  // var number = randPokemon();
  var number = pokeArray.shift();
  console.log(number);
  //pokeSeen.push(number);
  //console.log(pokeSeen);
  /*if (memo.indexOf(number) > -1) { 
    console.log("Hey this number already exists!")
    for (var i = 0; i <= memo.length; i++) {
      if (number == memo[i]) {
        number = randPokemon(); 
    console.log("New number: " + number);

      }
    }
    memo.push(number);
    console.log(memo);
 
  } else {
    memo.push(number);
    console.log(memo);
  }
  /*for (var i = 0; i <= memo.length; i++) {
    if (number == memo[i]) {
      number = randPokemon(); // select new number
      console.log(number); // log new number
    } else {
      memo.push(number);
    }
    memo.push(number);
  }*/
  /*for (var i = 0; i < memo.length; i++) {
    if (number == memo[i]) {
      var number = randPokemon();
      console.log(number);
    }
    memo.push(number);
    console.log(memo);
  }*/
  
  getNameAndSprite(number);

  $('.fn-results').css('visibility', 'hidden');
  // buttons
  $('.play-again').hide();
  // if not first play, then reveal
  // figure how to track using memoization
  if (firstCall) {
    firstCall = false;
    return;
  }
  $('.reveal').show();

}

function getNameAndSprite(number){
  var genURL = "http://pokeapi.co/api/v1/pokemon/" + number;

  $.ajax({     
    type: "GET",
    url: genURL,
    dataType: 'jsonp',
    success: function(pokemon){    
        var name = pokemon.name.toUpperCase();
        console.log(name);
        $('.fn-results').html('<span> ' + name + ' </span>');
        var spriteURL = "http://pokeapi.co" + pokemon.sprites[0].resource_uri;
        //pkmn.setItem('name', name);
        getSprite(spriteURL); // chaining ajax calls because national pokemon number doesn't correlate with the correct sprite
    }
  });
}

function getSprite(spriteURL){

  $.ajax({     
    type: "GET",
    url: spriteURL,
    dataType: 'jsonp',
    success: function(pokemon){    
      var imgURL = "http://pokeapi.co" + pokemon.image;
      //console.log(imgURL);
      sprite.attr('src', imgURL); // adding img src
    }
  });
}

function revealPokemon(){
  $('.reveal').hide();
  sprite.toggleClass('revealSilh');
  $('.fn-results').css({'opacity': '0', 'visibility': 'visible'}).animate({opacity: 1}, 1200);
  $('.play-again').show();
  
  if ($('#pokedexText').css('display') == 'none'){
    $('#pokedexText').css({'opacity': '0', 'display': 'block'}).animate({opacity: 1}, 1200);

  }
  $('#pokeseen').html(max - pokeArray.length).css({'opacity': '0'}).animate({opacity: 1}, 1200);

}


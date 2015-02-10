$('.play-first').on('click', firstCatch);
$('.play-again').on('click', getPokemon);
$('.reveal').on('click', revealPokemon);


var sprite = $('.pokesprite');

function firstCatch() {
  $('.play-first').hide();
  revealPokemon();
}

function randPokemon() {
  return Math.floor((Math.random() * 151) + 1).toString();
}

function getPokemon(){
  if (sprite.attr('src') != ""){
    sprite.removeAttr('src');
    sprite.removeClass('revealSilh');
  }
 
  var number = randPokemon();
  getNameAndSprite(number);

  $('.fn-results').css('visibility', 'hidden');
  // buttons
  $('.play-again').hide();
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
        //console.log(name);
        $('.fn-results').html('<span> ' + name + ' </span>');
        var spriteURL = "http://pokeapi.co" + pokemon.sprites[0].resource_uri;
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
  //$('.fn-results').show('slow');
  $('.fn-results').css({'opacity': '0', 'visibility': 'visible'}).animate({opacity: 1}, 1200);
  $('.play-again').show();
  
}


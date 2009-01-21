require 'rubygems'
require 'johnson'

@context = Johnson::Runtime.new

code = %q{
  
  var json = "{ welcome: \"intermission\"} cece"
  
  function extractJSON( string ) {
    if ( string.match(/^\{/) ) {
      var open = 1;
      var index = 1;
      
      while ( open > 0 && index < string.length ) {
        if ( string[index] === '}' ) {
          open--;
        }
        else if ( string[index] === '{' ) {
          open++;
        }
        index++;
      }
      return string.substring(0,index);
    }
    else {
      return "{}";
    }
  }
  
  
  extractJSON(json);
}

puts @context.evaluate( code )

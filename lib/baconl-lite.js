var baconl = (function(){
  function baconl( template ) {
    return baconl.html( baconl.parse(template) );
  }

  baconl.parse = function(template) {
      if ( template === undefined ) { return undefined; }
      var tokens = {
          id: undefined,
          classes:[],
          tag: undefined,
          innerHTML: "" 
      };

      var tagDefinition   = /^\s*%([A-Za-z][A-Za-z0-9]*)/;
      var idDefinition    = /^\#([A-Za-z][A-Za-z0-9:_\-]*)/;
      var classDefinition = /^\.([A-Za-z][A-Za-z0-9:_\-]*)/;

      var innerHTMLDefinition = /\s*\\?((.|[\n])+)/m;

      // Retrieve HTML tag
      var nextToken = template.match( tagDefinition );
      if ( !!nextToken ) {
          tokens.tag = nextToken[1];
      }

      template = template.replace( tagDefinition , "" );

      // Retrieve element ID
      nextToken = template.match( idDefinition );
      tokens.id = !!nextToken ? nextToken[1] : undefined;

      template = template.replace( idDefinition , "" );

      // Retrieve classes
      nextToken = template.match( classDefinition );

      while( !!nextToken ) {
          tokens.classes.push( nextToken[1] );
          template = template.replace( classDefinition , "" );
          nextToken = template.match( classDefinition );
      }

      if ( tokens.tag === undefined && ( tokens.id !== undefined || tokens.classes.length > 0 ) ) {
          tokens.tag = "div";
      }

      nextToken = template.match( innerHTMLDefinition );
      tokens.innerHTML = !!nextToken ? nextToken[1] : undefined;

      return tokens;
  }

  baconl.html = function( tokens ) {
    if ( tokens.tag === undefined ) return tokens.innerHTML || "";

    var element = "";
    element += "<"+tokens.tag;
    if ( tokens.id !== undefined ) {
        element += " id='" + tokens.id +"'";
    }
    if ( tokens.classes.length > 0 ) {
        element += " class='" + tokens.classes.join(" ") +"'";
    }
    element += tokens.innerHTML === undefined ?
      "/>" : ">" + tokens.innerHTML + "</" + tokens.tag + ">";

    return element;
  }

  if ( jQuery !== undefined ) {
      jQuery.baconl = function( template ) {
          return jQuery( baconl( template ) );
      }
  }
  return baconl;
})();
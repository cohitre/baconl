function baconlLite( template ) {
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

    // TODO: parse JSON and use it for the element attributes
    // var jsonDefinition = 

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

    // Retrieve inner content
    nextToken = template.match( innerHTMLDefinition );
    tokens.innerHTML = !!nextToken ? nextToken[1] : undefined;
    
    var element = "";
    element += "<"+tokens.tag;
    if ( tokens.id !== undefined ) {
        element += " id='" + tokens.id +"'";
    }
    if ( tokens.classes.length > 0 ) {
        element += " class='" + tokens.classes.join(" ") +"'";
    }
    element += "/>";
    return element;
}

if ( jQuery !== undefined ) {
    jQuery.baconl = function( template ) {
        return jQuery( baconl( template ) );
    }
}
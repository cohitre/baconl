var baconl = (function() {    
    var self = function( template ) {
        var tree;
        if ( template.isNode !== true ) {
            tree = baconl.baconize( template );
        }
        else {
            tree = template;
        }
        return tree.toHTML();
    }
    
    return self    
})();

baconl.map = function map( array , callb ) {
    var result = [];
    for (var i=0; i < array.length; i++) {
        result.push( callb( i , array[i] ) );
    };
    return result;
}


baconl.parse = function( template ) {
    if ( template === undefined ) { return undefined; }
    var tokens = {
        id: undefined,
        classes:[],
        tag: undefined,
        innerHTML: "" , 
        openTag: function() {
            if ( tokens.tag === undefined ) { return ""; }
            var result = "<" + tokens.tag;
            if ( tokens.id !== undefined ) { result += " id='" + tokens.id + "'"; }
            if ( tokens.classes.length > 0 ) { 
                result+=" class='" + tokens.classes.join(" ") + "'"; 
            }
            return result + ">";
        } , 
        closeTag: function() {
            if ( tokens.tag === undefined ) { return ""; }
            return "</" + tokens.tag + ">";
        }
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

    return tokens;

}

baconl.node = function( definition ) {
    if ( definition !== undefined && definition.isNode ) {
        return definition;
    }
    var self = {
        definition: definition||"" , 
        isNode: true, 
        depth: 0 , 
        childNodes: [] , 
        parentNode: undefined, 
        parent: function() { return self.parentNode; }
    };
    
    function makeChild( child ) {
        child = baconl.node( child );
        child.depth = self.depth + 1;
        child.parentNode = self;
        return child;
    }

    self.prepend = function() {
        for ( var i = 0 ; i < arguments.length ; i++ )
        {
            self.childNodes.splice(0,0, makeChild( arguments[i] ) );
        }
        return self;        
    }
    
    self.append = function() {
        for ( var i = 0 ; i < arguments.length ; i++ )
        {
            self.childNodes.push( makeChild( arguments[i] ) );
        }
        return self;
    }
    
    
    
    self.toHTML = function() {
        var node = self;
        var element = baconl.parse( node.definition );
        var result = element.openTag();

        if ( element.innerHTML !== undefined ) {
            result += element.innerHTML;
        } 

        result += baconl.map( node.childNodes , function(index , childNode ){
            return childNode.toHTML();
        } ).join("\n");

        result += element.closeTag();
        return result;        
    }
    
    return self;
}

baconl.baconize = function( unreadBuffer , parentNode ) {
    if ( unreadBuffer.constructor === String ) {
        unreadBuffer = unreadBuffer.split("\n");
    }
    
    if ( parentNode === undefined ) {
        parentNode = baconl.node();
    }
    function lineDepth( line ) {
        return line.match(/^\s*/)[0].length/2 + 1;
    }
    function isChild( line ) {
        return lineDepth(line) === parentNode.depth+1;
    }

    for ( var i = 0 ; i < unreadBuffer.length ; i++ ) {
        if ( isChild( unreadBuffer[i] ) ) {
            var child = baconl.node( unreadBuffer[i] ) ;
            parentNode.append( child );
            baconl.baconize( 
                unreadBuffer.slice( i+1 ) , 
                child 
            );
        }
        else if ( lineDepth(unreadBuffer[i]) <= parentNode.depth ) {
            return parentNode;            
        }
    }
    return parentNode;
}

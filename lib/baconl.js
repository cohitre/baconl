baconl.extend({
  haml: function( template , node , depth ) {
    node  = node  === undefined ? {} : node;
    depth = depth === undefined ? 0  : depth;
    var lines = template.split("\n");
  }
});

baconl.each = function( array , callb )  {
    for (var i=0; i < array.length; i++) {
        callb( i , array[i] );
    };
    return array;
}

baconl.grep = function( array , callb ) {
    var result = [];
    baconl.each( array , function(i,obj) {
        if ( callb( i , obj ) ) {
            result.push( obj );
        }
    } );
    return result;
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
    
    
    function htmlBody() {
        var node = self;
        var result = "";
        
        function openTag( tokens ) {
            if ( tokens.tag === undefined ) { return ""; }
            var result = "<" + tokens.tag;
            if ( tokens.id !== undefined ) { result += " id='" + tokens.id + "'"; }
            if ( tokens.classes.length > 0 ) { 
                result+=" class='" + tokens.classes.join(" ") + "'"; 
            }
            return result + ">";
        } 
        function closeTag( tokens ) {
            if ( tokens.tag === undefined ) { return ""; }
            return "</" + tokens.tag + ">";
        }

        result += openTag( node );

        if ( self.innerHTML !== undefined ) {
            result += self.innerHTML;
        } 

        result += baconl.map( node.childNodes , function(index , childNode ){
            return childNode.html();
        } ).join("\n");

        result += closeTag( node );
        
        return result;        
    }
    
    function toDOMObjects() {
        var element = parseDefintion();
        console.log( element );
        
    }
        
    function parseDefintion(){
        var element = baconl.parse( self.definition );
        self.id = element.id;
        self.classes = element.classes;
        self.tag = element.tag;
        self.innerHTML = element.innerHTML;
    }    
    
    function makeChild( child ) {
        child = baconl.node( child );
        child.depth = self.depth + 1;
        child.parentNode = self;
        return child;
    }
    
    self.html = function() {
        if ( arguments.length === 0 ) {
            return htmlBody();
        }
        self.empty();
        self.append.apply( self , arguments );
        return self;                
    }

    self.prepend = function() {
        for ( var i = 0 ; i < arguments.length ; i++ ) {
            self.childNodes.splice(0,0, makeChild( arguments[i] ) );
        }
        return self;        
    }
    
    self.append = function() {
        for ( var i = 0 ; i < arguments.length ; i++ ) {
            self.childNodes.push( makeChild( arguments[i] ) );
        }
        return self;
    }
    
    self.remove = function() {
        self.depth = 0;
        if ( self.parentNode === undefined ) { return self; }
        self.parentNode.childNodes = baconl.grep( self.parentNode.childNodes , function(i,node){
            return node !== self;
        } );
        self.parentNode = undefined;
        return self;
    }
    
    self.empty = function() {
        baconl.each( self.childNodes , function(i,node){
            node.remove();
        });
        return self;
    }
    
    self.hasClass = function( className ) {
        for (var i=0; i < self.classes.length; i++) {
            if ( self.classes[i] === className ) { return true; }
        };
        return false;
    }
    
    self.addClass = function( classes ) {
        baconl.each( classes.split(/\s+/) , function(i , className) {
            if ( !self.hasClass( className ) ) {
                self.classes.push( className );
            }
        });
        return self;
    }
    
    self.removeClass = function( classes ) {
        baconl.each( classes.split(/\s+/) , function(index, argClassName) {
            self.classes = baconl.grep( self.classes , function( index , ownClassName ) {
                return (ownClassName !== argClassName);
            } ) ;
        });
        return self;
    }
    
    parseDefintion();
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


if ( jQuery !== undefined ) {
    jQuery.baconl = function( template ) {
        return jQuery( baconl( template ) );
    }
}
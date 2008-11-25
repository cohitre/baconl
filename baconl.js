function baconl( template ) {
    var $ = jQuery;
    
    function toHTML( elements ) {
        var collectedElements = $.map( elements , function( element , index ) {            
            var parsedItems = baconl.parseTemplate( element.definition );

            function repeat( string , times ) {
                var result = "";
                for (var i=0; i < times; i++) {
                    result += string
                };
                return result;
            }

            if ( parsedItems.tag === undefined )
            {
                return "\n" + repeat( "  " , element.depth) + parsedItems.innerHTML;
            }

            var self = $("<" + parsedItems.tag + "/>");
            self.attr("id" , parsedItems.id);
            self.addClass( parsedItems.classes.join( " " ) );

            if ( parsedItems.innerHTML !== undefined )
            {
                self.html( parsedItems.innerHTML );
            }
            // console.log( element )
            // self.append( 
            //     baconl( element.definition ).append( toHTML( element.body ) )
            // );

            $.each( element.body , function( index, child) {
                self.append(
                    baconl(child.definition) , 
                    toHTML( child.body )
                )
                // var e = ;
                // $.each( child.body , function( i , c) {
                //     e.append( baconl( c.definition).append( toHTML( c.body ) ) );
                // });
                // self.append( e );
            });

            return self;            
        });
        
        var result;
        $.each( collectedElements , function( i , el ) {
            if ( result === undefined )
            {
                result = el;
            }
            else
            {
                result.add( el );
            }
        })
        return result;
    }
    return toHTML( baconl.splitElements(template) );
}

baconl.splitElements = function( template ) {
    var depth = 0;
    var lines = template.split( "\n" );

    function moveToDepth( lines , depth ) {
        while ( lines.length > 0 && lines[0].match( /^[ ]*/ )[0].length/2 > depth )
        {
            lines = lines.slice( 1 );
        }
        return lines;
    }
    
    function buildDepth( lines , depth ){
        var elements = [];

        while ( lines.length > 0 && lines[0].match( /^[ ]*/ )[0].length/2 === depth )
        {
            var el = {
                definition: $.trim( lines[0] ) , 
                body: buildDepth( lines.slice( 1 ) , depth+1 ) || [],
                depth: depth
            };
            elements.push( el );
            
            lines = moveToDepth( lines.slice(1) , depth );
        }
        return elements;
    }    
    
    return buildDepth( lines , 0);
}

baconl.parseTemplate = function( template ) {    
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
    if ( !!nextToken )
    {
        tokens.tag = nextToken[1];
    }
    

    template = template.replace( tagDefinition , "" );

    // Retrieve element ID
    nextToken = template.match( idDefinition );
    tokens.id = !!nextToken ? nextToken[1] : undefined;
    
    template = template.replace( idDefinition , "" );
    
    // Retrieve classes
    nextToken = template.match( classDefinition );
    
    while( !!nextToken )
    {
        tokens.classes.push( nextToken[1] );
        template = template.replace( classDefinition , "" );
        nextToken = template.match( classDefinition );
    }
    
    if ( tokens.tag === undefined && ( tokens.id !== undefined || tokens.classes.length > 0 ) ) 
    {
        tokens.tag = "div";
    }
        
    // Retrieve inner content
    nextToken = template.match( innerHTMLDefinition );
    tokens.innerHTML = !!nextToken ? nextToken[1] : undefined;
    
    return tokens;
}


function baconl( template ) {
    var $ = jQuery;
    
    function toHTML( element ) {
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
            
        $.each( element.body , function( index, child) {
            self.append( toHTML( child ) );
        });
        
        return self;

    }
        
    return toHTML( baconl.splitElements(template)[0] );
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


baconl.test = function() {
    var assertions = $("<ul />").attr("id", "assertions" )
    $(document.body).prepend( assertions );
    
    function assert( should , is  ){
        var item = $("<li />");
        item.text( is );

        if ( should === is )
        {
            item.css({
                "background-color": "#BFFFBF",
                "border" : "1px solid #008F00"
            });
        }
        else
        {
            item.css({
                "background-color": "#B30000",
                "border" : "1px solid #FFBFBF"
            });            
        }
        
        if ( is === undefined )
        {
            item.text("undefined").css("font-style" , "italic");
        }
        else if ( is.length === 0 )
        {
            item.text("\"\"").css("color" , "#24006B");
        }
        
        console.log( should === is , is );
        assertions.append( item );
    }
    
    function testParseTemplate() {
        assert( "div" , baconl.parseTemplate( "%div#id.class.class" ).tag );
        assert( "div" , baconl.parseTemplate( "#id.class.class" ).tag );
        assert( "span" , baconl.parseTemplate( "%span#id.class.class" ).tag ); 

        assert( "fun-id" , baconl.parseTemplate( "%span#fun-id.class.class" ).id );
        assert( "serious_id" , baconl.parseTemplate( "%span#serious_id.class.class" ).id );    

        assert( ["class-1","class-2"].join(",") , baconl.parseTemplate( "%span#fun-id.class-1.class-2" ).classes.join(",") );
        assert( [].join("") , baconl.parseTemplate( "%span#fun-id" ).classes.join(",") );

        assert( "hello world" , baconl.parseTemplate( "#id.class hello world" ).innerHTML );
        assert( "#1. hello world" , baconl.parseTemplate( "#id.class \#1. hello world" ).innerHTML );
        assert( undefined , baconl.parseTemplate( "#id.class" ).innerHTML );
        assert( "%p hello" , baconl.parseTemplate( "#id.class %p hello" ).innerHTML );        
    }
    
    function testBuildNode() {
        assert( '<div class="class-1 class-2" id="hello"></div>' , $("<div/>").append( baconl("#hello.class-1.class-2") ).html() );
        assert( '<div class="class-1 class-2" id="hello">?</div>' , $("<div/>").append(baconl("#hello.class-1.class-2 ?")).html() );
        assert( '<div class="class-1 class-2" id="hello">?\n  !</div>' , $("<div/>").append(baconl("#hello.class-1.class-2 ?\n  !")).html() );        
    }

    testParseTemplate();
    testBuildNode();
}
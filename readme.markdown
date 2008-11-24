# baconl

Haml for javascript

## Why?

jQuery traverses the DOM like a graceful swan dancing ballet in a giant marshmellow. Since css selectors describe html markup so well they are very good for not only traversing documents, but also for generating markup. This is what makes haml so fun to use.

The jQuery syntax for creating objects does not take advantage of CSS selectors. Baconl fixes this.

To generate this:

    <div class="example code" id="example-1">Hello world!</div>

You do this:

    jQuery( "<div />").addClass("example code").attr("id" , "example-1").text( "Hello world!" );

or this:

    jQuery('<div class="example code" id="example-1">Hello world!</div>');

But with baconl, you do this:

    baconl( "#example-1.code.example Hello world!" );

## Examples

### Building a blogpost


        baconl(".post").append(
            baconl("%h2.title On why some animals are more equal than others") , 
            baconl("%p There was once a list of 7 commandments to be followed by all animals.") , 
            baconl("%p There was also a list of 7 condiments to be put into chicken")
        );

### Building a list

    var list = baconl("%ul");
    $.each( [ "gato" , "perro" , "perico"] , function( index, animal ){
        list.append( baconl("%li").text( animal ) );
    });

### Working from haml

    var haml = [
        "%div"
        "  %h1 This is the document that eats babies." , 
        "  %p There are many documents that have the capacity to eat things.",
        "  %p This one in particular can eat babies."
    ].join("\n");

    $(document.body).append( baconl( haml ) );
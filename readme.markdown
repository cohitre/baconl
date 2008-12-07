# baconl

Haml for Javascript

## Why?

[jQuery](http://jquery.com) traverses the DOM like a graceful swan dancing ballet in a giant marshmallow. However, using it to *create* HTML is not so graceful. The same thing that makes traversing the DOM with jQuery so poetic is what makes [HAML](http://haml.hamptoncatlin.com/) so fun: *CSS selectors*.

CSS Selectors are great at describing HTML markup. Being able to create and navigate HTML with CSS Selectors is the *greatest poetic license ever*. 

To generate this:

    <div class="example code" id="example-1">Hello world!</div>

You do this:

    $( "<div />").addClass("example code").attr("id" , "example-1").text("Hello world!");

or this:

    $('<div class="example code" id="example-1">Hello world!</div>');

But with baconl, you do this:

    $.baconl( "#example-1.code.example Hello world!" );

Great!

## Flavors

baconl parses a subset of Haml. It doesn't include filters or setting attributes yet. It can also do some simple manipulation on the nodes without the aid of the browsers DOM. This makes it useful in Server Side Javascript.

baconl-lite is a lighter version of baconl that only parses css selectors (tags need to be prepended with a %). It favors hooking up to jQuery early to better take advantage of the jQuery library.

## Examples

### Building a blogpost

        $.baconl(".post").append(
            $.baconl("%h2.title On why some animals are more equal than others") , 
            $.baconl("%p There was once a list of 7 commandments to be followed by all animals.") , 
            $.baconl("%p There was also a list of 7 condiments to be put into chicken")
        );

### Building a list

    var list = $.baconl("%ul");
    $.each( [ "gato" , "perro" , "perico"] , function( index, animal ){
        list.append( $.baconl("%li").text( animal ) );
    });

### Working with haml

    var haml = [
        "%div"
        "  %h1 This is the document that eats babies." , 
        "  %p There are many documents that have the capacity to eat things.",
        "  %p This one in particular can eat babies."
    ].join("\n");

    $(document.body).append( $.baconl( haml ) );
    
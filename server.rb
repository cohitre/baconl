require "rubygems"
require "perro"

s = Perro::Server.new( 3005 )
s.get( "/baconl.js" , :javascript ) { open("./baconl.js").read }
s.get( "/jquery.js" , :javascript ) { open("./jquery.js").read }
s.haml( "/" , "./index.haml" )
s.start
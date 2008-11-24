require "rubygems"
require "perro"

server = Perro::Server.new( 3000 )

server.get( "/jquery.js" , "text/javascript" ) do |params|
  open( "/Users/carlos/libs/javascript/jquery.js" ).read
end

server.get( "/baconl.js" , "text/javascript" ) do |params|
  open( "./baconl.js" ).read
end

server.haml( "/" , "./index.haml")

server.start
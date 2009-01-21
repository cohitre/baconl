#!/usr/bin/env ruby -wKU

require "rubygems"
require "perro"

s = Perro::Server.new( 3005 )
s.get( "/:file.js" , :javascript ) { |p| open("./#{p[:file]}.js").read }
s.get( "/:file.css" , :stylesheet ) { |p| open("./#{p[:file]}.css").read }
s.haml("/json","./json.haml")
s.haml( "/" , "./index.haml" )
s.start
#!/usr/bin/env ruby -wKU

require "rubygems"
require "sinatra"

APP_ROOT = File.expand_path("#{File.dirname( __FILE__ )}/..")
set :haml, {:format => :html5 }

set :views , "#{APP_ROOT}/test"
set :public, "#{APP_ROOT}/test"

get( "/javascript/*" ) do
  send_file("#{APP_ROOT}/lib/#{params[:splat].join("/")}")
end
get("/tests/*") do
  haml params[:splat].join("/").split(".").first.to_sym
end
get( "/" ) { haml :index }


# get( "/:file.js" , :javascript ) { |p| open("./#{p[:file]}.js").read }
# get( "/:file.css" , :stylesheet ) { |p| open("./#{p[:file]}.css").read }
# s.haml("/json","./json.haml")
# s.haml( "/" , "./index.haml" )
# s.start

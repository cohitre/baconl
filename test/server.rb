#!/usr/bin/env ruby -wKU

require "rubygems"
require "sinatra"

APP_ROOT = File.expand_path("#{File.dirname( __FILE__ )}/..")
set :haml, {:format => :html5 }

def qunit_setup( title )
  %Q{<h1>#{title}</h1>
  <h2 id="banner"></h2>
  <h2 id="userAgent"></h2>
  <ol id="tests"></ol>
  <div id="main"></div>}
end

set :views , "#{APP_ROOT}/test"
set :public, "#{APP_ROOT}/test"

get( "/javascript/*" ) do
  send_file("#{APP_ROOT}/lib/#{params[:splat].join("/")}")
end
get("/tests/*") do
  haml params[:splat].join("/").split(".").first.to_sym
end
get( "/" ) { haml :index }

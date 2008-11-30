require 'rubygems'
require 'johnson'
require 'test/unit'

class BaconlTest < Test::Unit::TestCase
  def setup
    @context = Johnson::Runtime.new
    @context.evaluate( open("./baconl.js").read )
  end

  def eval( val )
    @context.evaluate( val )
  end

  def baconl( val )
    eval( "baconl(\"#{val}\");" )
  end

  def node( definition )
    eval( "baconl.node(\"#{definition}\"); ")
  end

  def test_simple_strings
    assert_equal( "welcome mr. pope"   , baconl('welcome mr. pope')  )
    assert_equal( "welcome\nmr. pope"  , baconl('welcome\nmr. pope') )
    assert_equal( "welcome\nmr.\npope" , baconl('welcome\nmr.\npope'))
  end

  def test_markup
    assert_equal("<h1>The cat in the hat</h1>" ,  baconl('%h1 The cat in the hat') )
    assert_equal("<h1>The cat in the hat</h1>\n<h2>by <span>Dr. Seuss</span></h2>" ,  baconl('%h1 The cat in the hat\n%h2 by \n  %span Dr. Seuss') )
  end

  def test_attributes
    assert_equal( "<h1 class='header'>The itinerant earthworm</h1>" , baconl("%h1.header The itinerant earthworm") )
    assert_equal( "<h1 id='best-header' class='header'>The itinerant earthworm</h1>" , baconl("%h1#best-header.header The itinerant earthworm") )
    assert_equal( "<h1 id='best-header' class='header'>The itinerant earthworm</h1>\n<h2 id='second-best-header'>I wish i was best</h2>" , baconl("%h1#best-header.header The itinerant earthworm\\n%h2#second-best-header I wish i was best") )
  end

  def test_construct_node
    assert_equal( "<div></div>" , eval('baconl.node( "%div" ).toHTML();') )
    assert_equal( "<div></div>" , eval('baconl.node(baconl.node( "%div" )).toHTML();') )    
    assert_equal( "<div>body</div>" , eval('baconl.node( "%div body" ).toHTML();') )
    assert_equal( "<div class='home'>body</div>" , eval('baconl.node( "%div.home body" ).toHTML();') )    
  end
    
  def test_prepend_node
    doc = eval(%Q[
      baconl.node( "%div" )
      .prepend( baconl.node("%h1 Welcome!") )
    .toHTML();])
    assert_equal( "<div><h1>Welcome!</h1></div>" , doc )    
    doc = eval(%Q[
      baconl.node( "%div" )
      .prepend( baconl.node("%h1 Second") )
      .prepend( baconl.node("%h2 first") )      
    .toHTML();])
    assert_equal( "<div><h2>first</h2>\n<h1>Second</h1></div>" , doc )    
  end

  def test_append_node
    doc = eval(%Q[
      baconl.node( "%div" )
      .append( baconl.node("%h1 Welcome!") )
    .toHTML();])
    assert_equal( "<div><h1>Welcome!</h1></div>" , doc )
  end

  def test_append_template
    doc = eval(%Q[
      baconl.node( "%div" ).append( "%h1 Welcome!" ).toHTML();
    ])
    assert_equal( "<div><h1>Welcome!</h1></div>" , doc )
  end

end

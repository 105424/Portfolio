$(document).ready(init);

var width;
var height;
function init()
{
    console.log('init');
    
    width = $('body').width();
    height = $('body').height();
    console.log(width);
    console.log(height);
    
    //getXML();
    getPreset();
    
    
    $('.test').mousedown(startMove);
}
function startMove(event)
{
    var type = $(this).attr('id');
    target = divs[type];
    
    $('body').mouseup(function(event){
       $('body').unbind('mousemove'); 
    });
    
    $('body').bind('mousemove',function(event){        
        target.x = event.pageX;
        target.y = event.pageY;
        
        target.update();
    });
}
var div = function(type)
{
    console.log(type);
    var cord = preset1[type].split(',');
    
    this.x = cord[0];
    this.y = cord[1];
    
    this.canMove = false;
    
    
    $('body').append('<div class="test" id="'+type+'">');
    this.dom = $('body').children('#'+type);
    $(this.dom).css('top',this.y)
    $(this.dom).css('left',this.x)
}
div.prototype.update = function()
{
    $(this.dom).css('top',this.y)
    $(this.dom).css('left',this.x)    
}

var divs = {};

function getPreset()
{
    console.log(preset1);   
    for(var type in preset1)
    {
        divs[type] = new div(type);
    }
    
}

/*  begin van het probeeren van het ophalen van de preset data met xml. maar met objects leek em makelijker
function getXML()
{
    $.ajax({
        url: "presets.xml",
        success: parseXML,
        dataType: "xml"
    });    
}
function parseXML(xml)
{
    console.log(xml);  
} */
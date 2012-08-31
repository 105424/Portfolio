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
}
var div = function(type)
{
    console.log(type);
    var cord = preset1[type].split(',');
    this.x = cord[0];
    this.y = cord[1];
    $('body').append('<div class="test" id="'+type+'">');
    this.dom = $('body').children('#'+type);
    $(this.dom).css('top',this.y)
    $(this.dom).css('left',this.x)
}


var divs = {};

function getPreset()
{
    console.log(preset1);   
    for(var i in preset1)
    {
        divs[i] = new div(i);
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
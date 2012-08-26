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
    
    getXML();
}

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
}
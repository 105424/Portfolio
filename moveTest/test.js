$(document).ready(init);
var width;
var height;
function init()
{
    console.log('--init--');
    
    width = $('body').width();
    height = $('body').height();
    console.log(width);
    console.log(height);
    
    if (typeof config != 'undefined') parseDivs(config);
    else console.log('config not found');

    $('.movable').live('mousedown', startMove); //did worth uiteindelijk gebruikt
    $('#save').live('click', save); //de save functie die het object met de cordinaten gaat opslaan;
    $('#load').live('click', load ); //de save functie die het object met de cordinaten gaat opslaan;
    
}
function save(event)
{   
    console.log('---save----');
    var _save = {};
    
    for(var i in divs)
    {
        _save[i] = divs[i].x+','+divs[i].y;
    }

    localStorage.setItem('save', JSON.stringify(_save));
}
function load(event)
{
    console.log('----load----');
    var _load = JSON.parse(localStorage.getItem('save'));
    
    if(_load ===null) return;
    
    parseDivs(_load);
}
function startMove(event)
{
    $('html').css('cursor','move');
   
    console.log('----startmove----');
    var type = $(this).attr('id');
    target = divs[type];
    
    $('html').mouseup(function(event){
        $('html').css('cursor','auto');
        $('html').unbind('mousemove'); 
    });
    
    $('html').bind('mousemove',function(event){        
        target.x = event.pageX;
        target.y = event.pageY;
        
        target.update();
    });
}
var div = function(type,cordinates)
{
    console.log('----div: '+type+'----');
    console.log($('body').find('#'+type)[0]);
    if($('body').find('#'+type)[0]===undefined) 
    {
        console.log('   div does not exist');
        return;
    }
    
    this.dom = $('body').find('#'+type);
    
    if(cordinates==='')
    {
        console.log('   no preset');
        console.log('   off-top: '+$(this.dom).offset().top);
        console.log('   off-left: '+$(this.dom).offset().left);
        
        this.x = $(this.dom).offset().left;
        this.y = $(this.dom).offset().top;
    }
    else
    {
        console.log('   cordinates defined');
        
        var cords = cordinates.split(',');
        var calc;
    
        if(isNaN(Number(cords[0]))===false) this.x = cords[0];
        else
        {  
            var cordX = cords[0].split('+');
            if (cordX[1] !== undefined) calc = '+';
            else
            {
                cordX = cords[0].split('-');
                calc = '-';
            }
            if(cordX[0]=='width')
            {
                if(calc=='-') this.x = width-cordX[1];
                else if(calc=='+') this.x = width+cordX[1];           
            }
        }
     
        if(isNaN(Number(cords[1]))===false) this.y = cords[1];
        else
        {
            var cordY = cords[1].split('+');
            if (cordY[1] !== undefined) calc = '+';
            else
            {
                cordY = cords[1].split('-');
                calc = '-';
            }
            if(cordY[0]=='height')
            {
                if(calc=='-') this.y = height-cordY[1];
                else if(calc=='+') this.y = height+cordY[1];
            }
        }
    }
    
    $(this.dom).remove();
    $('body').append(this.dom);
    $(this.dom).addClass('movable');
    
    $(this.dom).css('top',this.y);
    $(this.dom).css('left',this.x);
};
div.prototype.update = function()
{
    console.log('----update----');
    $(this.dom).css('top',this.y);
    $(this.dom).css('left',this.x) ;
};

var divs = {};

function parseDivs(toParse)
{
    console.log('-----toPare------');
    for(var type in toParse)
    {
        divs[type] = new div(type,toParse[type]);
    }   
}
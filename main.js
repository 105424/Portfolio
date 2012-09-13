$(document).ready(init);
var width;
var height;
var mouseX;
var mouseY;

function init()
{    
    console.log('--init--');
    
    setInterval(function(){
        width = $(window).width();
        height = $(window).height();            
    },10);
    
    if (typeof config != 'undefined') parseDivs(config);
    else console.log('config not found');

    $('html').live('mousemove',function(event){
        mouseX = event.clientX;
        mouseY = event.clientY;
        
        for(var i in divs)
        {
            var div = divs[i];           
            if(mouseX>div.x-3 && mouseX<div.x+3 && mouseY>div.y && mouseY<div.y+$(div.dom).height())
            {
                $('html').css('cursor','e-resize');
            }
            else
            {
                $('html').css('cursor','auto'); 
            }
        }
    });
    
    $('.movable').live('mousedown', startMove);
    $('#save').live('click', save); //de save functie die het object met de cordinaten gaat opslaan;
    $('#load').live('click', load ); //de save functie die het object met de cordinaten gaat opslaan;       
    
    sideMenu(); // de code van het zij menutje zoveel de animatie als de positionering (jammer genoeg kreeg ik dit niet in css voor elkaar);
    
    console.log(divs);
    
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
    var type = $(this).attr('id');
    var target = divs[type]; 
    
    xOffSet = event.clientX-target.x;
    yOffSet = event.clientY-target.y;       
    
    $('html').css('cursor','move');
   
    console.log('----startmove----');
    
    $('html').bind('mousemove',function(event){
        target.x = event.pageX-xOffSet;
        target.y = event.pageY-yOffSet;
        
        if(target.y<37) target.y = 37;
        if(target.x<0) target.x = 0;
        if(target.y>(height-target.height)) target.y = height-target.height;
        if(target.x>(width-target.width)) target.x = width-target.width;
        
        target.update();
    });
    
    $('html').mouseup(function(event){
        $('html').css('cursor','auto');
        $('html').unbind('mousemove'); 
    });
}
var div = function(type,cordinates)
{
    console.log('----div: '+type+'----');
    console.log($('body').find('#'+type)[0]);
    if($('body').find('#'+type)[0]===undefined) 
    {
        console.log('   div does not exist');
        delete divs[type];
        console.log(divs);
        return;
    }
    
    this.dom = $('body').find('#'+type);
    this.width = $(this.dom).width();
    this.height = $(this.dom).height();
    
    
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
        console.log('   split:'+cords); 
        if(isNaN(Number(cords[0]))===false) this.x = cords[0];
        else
        {  
            console.log('   calculating width');
            
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
    
    console.log('this,x:'+this.x);
    console.log('this.y:'+this.y);
    
    $(this.dom).css('top',Number(this.y));
    $(this.dom).css('left',Number(this.x));
    
    console.log($('body').find('#'+type)[0]);
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

function sideMenu()
{
    var dom = $('body').find('#sideMenu');
    var top = (height/2)-$(dom).height()+$('#topBar').height();
    var left = (width)-$(dom).width();
    var mWidth = $('#sideMenu').width()+2;
    var offSet = mWidth;
    
    $('#sideMenuToggle').css('right', $('#sideMenu').width());
    
    $('#sideMenuToggle').click(function(){
        console.log('sideMenuToggle Click');
        if(offSet==mWidth)
        {
            console.log('offset=72');
            var temp = setInterval(function(){
                offSet -= 2;
                if(offSet===0) clearInterval(temp);
            },10);
        }
        if(offSet===0)
        {
            var temp2 = setInterval(function(){
                offSet += 2;
                if(offSet==mWidth) clearInterval(temp2);
            },10);            
        }
    });
    
    setInterval(function(){   
        top = (height/2)-$(dom).height()+$('#topBar').height()+37; //37 is de hoogte van de header bar
        left = (width)-$(dom).width()+offSet; // 
        $(dom).css('top', top);
        $(dom).css('left', left);
    },10);
    
}


























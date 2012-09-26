$(document).ready(init);
var width;
var height;
var mouseX;
var mouseY;
var mouseAtBorder = false;
var border = 'none';
function init()
{    
    console.log('--init--');
    
    setInterval(function(){
        width = $(window).width();
        height = $(window).height();            
    },10);
    
    if (typeof config != 'undefined') parseDivs(config); // deze variable zit in config.js
    else console.log('config not found');
    
    $('html').live('mousemove', mouseTrace);        // zorgt ervoor dat de muis op het juiste moment van sprite verandert.
    $('.movable').live('mousedown', mouseDown);     // zorgt voor het resize/verplaatsen van de div's
    $('#save').live('click', save);                 // de save functie die het object met de cordinaten gaat opslaan;
    $('#load').live('click', load );                // de save functie die het object met de cordinaten gaat opslaan;       
    
    sideMenu(); // de code van het zij menutje zoveel de animatie als de positionering (jammer genoeg kreeg ik dit niet in css voor elkaar);
    
    console.log(divs);
 //   load();
}
function mouseTrace(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;
    if(mouseAtBorder === true)
    {
        $('body').css('cursor','auto');
        $('body>*').css('cursor','auto');
        mouseAtBorder = false;
    }
    for(var i in divs)
    {          
        var target = divs[i];     
        var _x = target.x;
        var _y = target.y;
        var _width = target.width;
        var _height = target.height;
        
        if(mouseX>_x-1 && mouseX<_x+4 && mouseY>_y && mouseY<_y+_height)
        {
            border = 'left';
            mouseAtBorder = true;
            $('body>*').css('cursor','e-resize');
            $('body').css('cursor','e-resize');
        }
        if(mouseX>_x+_width-1 && mouseX<_x+_width+6 && mouseY>_y && mouseY<_y+_height)
        {
            border = 'right';
            mouseAtBorder = true;
            $('body>*').css('cursor','e-resize');
            $('body').css('cursor','e-resize');
        }
        if(mouseX>_x && mouseX<_x+_width && mouseY>_y-2 && mouseY<_y+2)
        {
            border = 'top';
            mouseAtBorder = true;
            $('body>*').css('cursor','s-resize');
            $('body').css('cursor','s-resize');           
        }
        if(mouseX>_x && mouseX<_x+_width && mouseY>_y+_height-2 && mouseY<_y+height+2)
        {
            border = 'bottom';
            mouseAtBorder = true;
            $('body>*').css('cursor','s-resize');
            $('body').css('cursor','s-resize');           
        }
    }   
}
function mouseDown(event)
{
    console.log('----mouseDown----');
    
    var type = $(this).attr('id');
    var target = divs[type];   
    
    if(mouseAtBorder===true)
    {
        console.log('   --rezise '+border+'--');   
        var xRight = target.x + target.width;
        var yBottom = target.y + target.height;
        $('html').bind('mousemove',function(event){

            if(border=='left' || border=='right')
            {
                $('body>*').css('cursor','e-resize');
                $('body').css('cursor','e-resize');
                if(border=='left')
                {
                    target.x = mouseX; 
                    target.width = xRight - mouseX;   
                }
                if(border=='right') target.width = mouseX - target.x;
            }
            if(border=='top' || border=='bottom')
            {
                $('body>*').css('cursor','s-resize');
                $('body').css('cursor','s-resize');      
                
                if(border=='top')
                {
                   target.y = mouseY;
                   target.height = yBottom - mouseY;
                }
                if(border=='bottom') target.height = mouseY - target.y;
            } 
            target.update();
        });
        
        $('html').mouseup(function(event){
            $('body>*').css('cursor','auto');
            $('body').css('cursor','auto');
            $('html').unbind('mousemove'); 
        });     
    }
    else
    {          
        
        var xOffSet = event.clientX-target.x;
        var yOffSet = event.clientY-target.y; 
        
        console.log('   --startMove--');
        $('body').css('cursor','move');
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
            $('body').css('cursor','auto');
            $('html').unbind('mousemove'); 
        });
    }
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
        
        console.log('   split:'+cords); 
        
        if(isNaN(Number(cords[0]))===false) this.x = Number(cords[0]);
        if(isNaN(Number(cords[1]))===false) this.y = Number(cords[1]);
        if(isNaN(Number(cords[2]))===false) this.width = Number(cords[2]);
        if(isNaN(Number(cords[3]))===false) this.height = Number(cords[3]);
    }
    if($(this.dom).hasClass('movable')===false)
    {
        console.log('   re-place');
        
        $(this.dom).remove();
        $('body').append(this.dom);
        $(this.dom).addClass('movable');
    }
    
    console.log('this.x:'+this.x);
    console.log('this.y:'+this.y);
 
    this.update();
    
    console.log(this.width);
    console.log(this.height);
    
    console.log($('body').find('#'+type)[0]);
};
div.prototype.update = function()
{
    console.log('----update----');
    $(this.dom).css('top',this.y);
    $(this.dom).css('left',this.x);
    $(this.dom).css('width',this.width);
    $(this.dom).css('height',this.height);
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
function save(event)
{   
    console.log('---save----');
    var _save = {};
    
    for(var i in divs)
    {
        _save[i] = divs[i].x+','+divs[i].y+','+divs[i].width+','+divs[i].height;
    }

    localStorage.setItem('save', JSON.stringify(_save));
}
function load(event)
{
    console.log('----load----');
    var _load = JSON.parse(localStorage.getItem('save'));
    
    if(_load ===null) return;
    
//    divs = null;
 
//    for(var type in _load)
 //   {
 //       console.log(type)
        
 //       var cord;
//        cord = _load[type];
//        console.log(type);
//    }   
 
 
 
    parseDivs(_load);
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


























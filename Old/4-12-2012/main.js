$(document).ready(init);
var width;
var height;
var mouseX;
var mouseY;
var mouseAtBorder = false;
var border = 'none';
var borderLock = false;
var config = config;

function init()
{        
    console.log('--init--');
    
    width = $(window).width();
    height = $(window).height(); 
    
    window.onresize=function()
    {
        console.log('resize')
        width = $(window).width();
        height = $(window).height();
        for(var i in divs){divs[i].update()}
    };
    
    if (typeof config != 'undefined') parseDivs(config); // deze variable zit in config.js
    else console.log('config not found');
    
//    $('.mini').live('click', mini);
//    $('.titleMini').live('click', reverse);
    $('html').live('mousemove', mouseTrace);        // zorgt ervoor dat de muis op het juiste moment van sprite verandert.
    $('.movable').live('mousedown', mouseDown);     // zorgt voor het resize/verplaatsen van de div's
    $('#save').live('click', save);                 // de save functie die het object met de cordinaten gaat opslaan;
    $('#load').live('click', load );                // de save functie die het object met de cordinaten gaat opslaan;    
    
    sideMenu(); // de code van het zij menutje zoveel de animatie als de positionering (jammer genoeg kreeg ik dit niet in css voor elkaar);
    
    console.log(divs);
 //   load();
}
function reverse(event)
{
    var _target = divs[$(this).parent().attr("id")];
    var _dom = _target.dom;   
    $(_dom).children().show();
    $(_dom).children('p').remove();
    $(_dom).attr('class', 'movable')
    $(_dom).animate({
        height: '450px',
        width:  '1000px'
    }, 1000, function() {
        _target.height = (height/100)*450;
        _target.width = (width/100)*1000;
    });
}
function mini(event)
{
    var _target = divs[$(this).parent().attr("id")];
    var _dom = _target.dom;
    console.log(_dom);
    $(_dom).animate({
        height: '20px',
        width:  '100px',
        left: '-='+(width/100)*_target.x
    }, 1000, function() {
        _target.height = (height/100)*20;
        _target.width = (width/100)*100;
        _target.x = 0;
        $(_dom).children().hide();
        $(_dom).append('<p class="titleMini">'+_target.titleMini+'</p>');
        $(_dom).removeAttr('class');
    });
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
        var _x = (width/100)*target.x;
        var _y = (height/100)*target.y;
        var _width = (width/100)*target.width+target.padHorz;
        var _height = (height/100)*target.height+target.padVert;

        if(mouseX>_x-1 && mouseX<_x+4 && mouseY>_y && mouseY<_y+_height)
        {
            //left
            $('body>*').css('cursor','e-resize');
            $('body').css('cursor','e-resize');
            mouseAtBorder = true;
            if(borderLock === true)return;
            border = 'left';
        }
        if(mouseX>_x+_width-1 && mouseX<_x+_width+6 && mouseY>_y && mouseY<_y+_height)
        {      
            //right
            $('body>*').css('cursor','e-resize');
            $('body').css('cursor','e-resize');
            mouseAtBorder = true;
            if(borderLock === true)return;
            border = 'right';
        }
        if(mouseX>_x && mouseX<_x+_width && mouseY>_y-2 && mouseY<_y+2)
        {
            //top
            $('body>*').css('cursor','s-resize');
            $('body').css('cursor','s-resize');
            mouseAtBorder = true;
            if(borderLock === true)return;
            border = 'top';
        }
        if(mouseX>_x && mouseX<_x+_width && mouseY>_y+_height-2 && mouseY<_y+_height+2)
        {
            //bottom
            $('body>*').css('cursor','s-resize');
            $('body').css('cursor','s-resize');   
            mouseAtBorder = true;
            if(borderLock === true)return;
            border = 'bottom';
        }
    }   
}
function mouseDown(event)
{
    console.log('----mouseDown----');
    
    var type = $(this).attr('id');
    var target = divs[type];   
    console.log('target: '+type);
    if(target.z != 1000)
    {
        target.z = 1000+1;
        for(var i in divs)
        {
            divs[i].z -= 1;
            divs[i].update();
        }
    }    
    console.log('Z: '+target.z);
    
    if(mouseAtBorder===true)
    {
        console.log('   --rezise '+border+'--');   
        var xRight = (width/100)*target.x + (width/100)*target.width;
        var yBottom = (height/100)*target.y + (height/100)*target.height;
        borderLock = true;
        $('html').bind('mousemove',function(event){
            if(mouseY > height-10)
            {
                console.log("mouseY: " +mouseY)
                mouseY = height-10;
            }
            if(mouseY < 37)
            {
                console.log("mouseY: " +mouseY)
                mouseY = 37;   
            }
            
            if(border =='left' || border=='right')
            {
                $('body>*').css('cursor','e-resize');
                $('body').css('cursor','e-resize');
                if(border=='left')
                {
                    target.x = 100/(width/mouseX); 
                    target.width = 100/(width/(xRight - mouseX));   
                }
                if(border=='right') target.width = 100/(width/(mouseX - (width/100)*target.x - target.padHorz));
            }
            if(border=='top' || border=='bottom')
            {
                $('body>*').css('cursor','s-resize');
                $('body').css('cursor','s-resize');      
                
                if(border=='top')
                {
                   target.y = 100/(height/mouseY);
                   target.height = 100/(height/(yBottom - mouseY));
                }
                if(border=='bottom') target.height = 100/(height/(mouseY - (height/100)*target.y - target.padVert));
            } 
            target.update();
        });
        
        $('html').mouseup(function(event){
            borderLock = false;
            $('body>*').css('cursor','auto');
            $('body').css('cursor','auto');
            $('html').unbind('mousemove'); 
        });     
    }
    else
    {          
        var xOffSet = event.clientX-((width/100)*target.x);  //cordinates of space between mousey and y of the div
        var yOffSet = event.clientY-((height/100)*target.y); //cordinates of space between mousec and c of the div
        
        console.log('   --startMove--');
        console.log('       target.x: '+target.x);
        console.log('       target.y: '+target.y);
        console.log('       event.x: '+event.clientX);
        console.log('       event.y: '+event.clientY);
        console.log('       ofset.x: '+xOffSet);
        console.log('       offset.y: '+yOffSet); 
        
        $('body>*').css('cursor','move');
        $('body').css('cursor','move');
        $('html').bind('mousemove',function(event){        
            
            target.x = 100/(width/(event.pageX-xOffSet));
            target.y = 100/(height/(event.pageY-yOffSet));
            
            if((height/100)*target.y<37) target.y = 100/(height/37);
            if(target.x<0) target.x = 0;
            if((height/100)*target.y>(height-(height/100)*target.height-10-target.padVert)) target.y = 100/(height/(height-(height/100)*target.height-10-target.padVert));
            if((width/100)*target.x>(width-(width/100)*target.width-target.padHorz)) target.x = 100/(width/(width-(width/100)*target.width-target.padHorz));
            
            target.update();
        });
        
        $('html').mouseup(function(event){
            $('body').css('cursor','auto');
            $('body>*').css('cursor','auto');
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
    this.titleMini = type;
    this.dom = $('body').find('#'+type);
    console.log(width);
    this.width = 100/(width/$(this.dom).width());
    this.height = 100/(height/$(this.dom).height());
    this.padHorz = parseInt($(this.dom).css("padding-right")) + parseInt($(this.dom).css("padding-left"));
    this.padVert = parseInt($(this.dom).css("padding-top")) + parseInt($(this.dom).css("padding-bottom"));
    this.z='auto';
    
    if(cordinates==='')
    {
        console.log('   no preset');
        console.log('   off-top: '+$(this.dom).offset().top);
        console.log('   off-left: '+$(this.dom).offset().left);
        
        
        this.x = 100/(width/$(this.dom).offset().left);
        this.y = 100/(height/$(this.dom).offset().top);
    }
    else
    { ///wordt niet meer gebrukt als functionalitiet
        console.log('   cordinates defined');
        
        var cords = cordinates.split(',');
        
        console.log('   split:'+cords); 
        
        if(isNaN(Number(cords[0]))===false) this.x = Number(cords[0]);
        if(isNaN(Number(cords[1]))===false) this.y = Number(cords[1]);
        if(isNaN(Number(cords[2]))===false) this.width = Number(cords[2]);
        if(isNaN(Number(cords[3]))===false) this.height = Number(cords[3]);
        if(isNaN(Number(cords[4]))===false) this.z = Number(cords[4]);
    }
    if($(this.dom).hasClass('movable')===false)
    {
        console.log('   re-place');
        
        $(this.dom).remove();
        $('body').append(this.dom);
        $(this.dom).addClass('movable');
    }
    
    $(this.dom).append('<span class="mini">mini</span>');
    
    console.log('this.x:'+this.x);
    console.log('this.y:'+this.y);
 
    this.update();
    
    console.log("width: "+this.width);
    console.log("height: "+this.height); 
    console.log($('body').find('#'+type)[0]);
};
div.prototype.update = function()
{
    console.log('update()');
    $(this.dom).css('top',(height/100)*this.y);
    $(this.dom).css('left',(width/100)*this.x);
    $(this.dom).css('width',(width/100)*this.width);
    $(this.dom).css('height',(height/100)*this.height);
    $(this.dom).css('z-index',this.z);
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
        _save[i] = divs[i].x+','+divs[i].y+','+divs[i].width+','+divs[i].height+','+divs[i].z;
    }
    console.log(_save);
    localStorage.setItem('save', JSON.stringify(_save));
}
function load(event)
{
    console.log('----load----');
    var _load = JSON.parse(localStorage.getItem('save'));
    
    if(_load ===null) return;
 
 
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


























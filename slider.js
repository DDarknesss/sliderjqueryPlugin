(function($){

 
    $.fn.pluginJQ  = function (options) {
        
        
    var settings = $.extend({
        dotsExist : true,
        arrowsExist : true,
        autoslide : true,
        width: 400,
        animationSpeed : 250,
        durationOfSlide: 3000,
    }, options);
 
    function Glob(slider, settings){
        
        this.settings = settings;
        this.width = this.settings.width;
        this.slider = slider;
        this.localContainer = this.slider.parent();
        this.slidesQuantity = $(this.slider).find('li').length;
        this.video = $(this.slider).find('video');
        this.lastSliderWidth = (this.width*this.slidesQuantity) - this.width;
        this.currentSlide = 1;
        
        
        Glob.prototype.init = function (){
            var that = this;

            that.slider.wrap('<div class="container"/>');
            that.slider.find('li').css('width', that.width);
            that.localContainer.css('width', that.width);
            that.localContainer.find('img').css('max-width', that.width)

            if ( that.settings.dotsExist){
                that.createDots();
            }

            if ( that.settings.arrowsExist){
                that.addArrows();           
            }

            if ( that.settings.autoslide){

                that.arrows = that.localContainer.find('.arrows');
                that.startSlide(); 
                
                that.arrows
                    .on('click', that.stopSlide)
                    .on('click', that.stopVideo)
                    .on('mouseleave', that.startSlide);
                
                this.video
                    .on('play',that.stopSlide)
                    .on('ended', that.startSlide);
                
                that.localContainer
                    .on('click', '.dots', that.stopSlide)
                    .on('mouseleave','.dot', that.startSlide);
            }
        };

        Glob.prototype.addArrows = function (){
            var that = this;

            localPrev =  $("<div class='arrows prev' />").insertBefore(that.slider);
            localNext = $("<div class='arrows next'/>").insertAfter(that.slider);
            localNext.css('margin-left',that.width+10)

            localPrev.on('click',  function(){
                that.moveSlide('left');
            });
            
            localNext.on('click', function(){
                that.moveSlide('right');
            });
        };

        Glob.prototype.createDots = function (){    
            var that = this;                    
            that.dots = $("<div class='dots'/>").insertAfter(that.slider);
        
            for(var i = 1; i < that.slidesQuantity+1; i++){
                $('<span/>').attr('class','dot').attr('data-tag', 'd'+i).appendTo(that.dots);
            }

            that.dot = $(that.dots).find('.dot');

            that.localContainer
            .on('click', that.stopVideo)
            .on('click', '.dot', function(event){
                that.changeSlide(parseInt(event.target.attributes.getNamedItem('data-tag').value.split('')[1]));
            });
        };

        Glob.prototype.updateSliderCss = function (value){
            var that = this;
            that.slider
            .stop(true,true)
            .animate({'margin-left' : value}, that.settings.animationSpeed);
        };

        Glob.prototype.changeSlide = function (number){
            var that = this;
            that.currentSlide = number;
            that.updateSliderCss(-(number*that.width -that.width));
            that.dotColorChange(number);       
        };

        Glob.prototype.stopVideo = function (){
            var that = this;
            this.video.trigger('pause');
        };

        Glob.prototype.startSlide = function  () {
            var that = this;
            that.stopSlide();
            that.interval = setInterval(function(){
                that.moveSlide('right');
            }, that.settings.durationOfSlide);
        };

        Glob.prototype.stopSlide =  function (){
            var that = this;
            clearInterval(that.interval);
        };

        Glob.prototype.dotColorChange = function (e){
            var that = this;
            --e;
            that.dot.css('background-color', '#bbb');
            $(that.dots.children()[e]).css('background-color', 'black');  
        };

        Glob.prototype.dotChanges = function (currentSlide,way){
            var that = this;
            if ( way === 'left'){
                if ( currentSlide === 1){
                    that.dotColorChange(that.slidesQuantity);
                } else {
                    currentSlide--;                      
                    that.dotColorChange(currentSlide);
                }

            } else if( way === 'right'){
                that.dotColorChange(currentSlide);
                if ( currentSlide > that.slidesQuantity ){
                    that.dotColorChange(1);
                } 

            } else{
                throw new Error('No such way: '+way);
            }
        },

        Glob.prototype.moveSlide = function (way){
            var that = this;
            if ( way === 'left'){
                if (that.currentSlide === 1){
                    that.updateSliderCss('-='+that.lastSliderWidth)
                    if( that.settings.dotsExist){
                        that.dotChanges(that.currentSlide, way);
                    }
                    that.currentSlide = that.slidesQuantity;

                } else {
                    that.updateSliderCss('+='+that.width);
                    if( that.settings.dotsExist){
                        that.dotChanges(that.currentSlide, way);
                    }
                    that.currentSlide--;
                }

            } else if (way === 'right'){
                
                if ( ++that.currentSlide > that.slidesQuantity) {
                    that.currentSlide = 1;
                    that.updateSliderCss('0');
                    if( that.settings.dotsExist){
                        that.dotChanges(that.currentSlide, way);
                    }

                } else {
                    that.updateSliderCss('-='+that.width);
                    if( that.settings.dotsExist){
                        that.dotChanges(that.currentSlide, way);
                    }
                }

            } else {
                throw new Error('No such way: '+way);
            }
        };

    };
    


    return this.each(function() {
       
        var slider = $(this);
        var start = new Glob(slider,settings);
        start.init();

        return this;
    });

 };
}( jQuery ));
    



$(document).ready(function(){
    $('ul.slider').pluginJQ({
        dotsExist : true,
        arrowsExist :true,
        autoslide : true,
        durationOfSlide: 1000,
        width: 1000,
    });

    $('ul.slider1').pluginJQ({
        dotsExist : true,
        arrowsExist :true,
        autoslide : false,
        width: 700
    });
    
    
    $('ul.slider2').pluginJQ({
        dotsExist : false,
        arrowsExist :true,
        autoslide : false,
        animationSpeed: 500
    });  
});
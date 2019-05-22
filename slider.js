(function($){
    
    originCss = $.fn.css;
    
    $.fn.css = function() {
        var result = originCss.apply(this, arguments);
        $(this).trigger('stylechanged');
        return result;
    } 

    
    $.fn.pluginJQ  = function (options ) {   
    
        var settings = $.extend({
            durationOfSlide: 3000,
            animationSpeed : 250,
            width: 400,
            dotsExist : true,
            arrowsExist : true,
            autoslide : true,
        }, options);


        return this.each(function() {
            
            var slider = $(this);
            var slidesQuantity = $(slider).find('li').length;
            var video = $(slider).find('video');
            var localContainer = slider.parent();

            var width = settings.width;
            var lastSliderWidth = (width*slidesQuantity) - width;
            var currentSlide = 1;
            var interval,dots,dot;

            function init(){

                slider.wrap('<div class="container"/>');
                slider.find('li').css('width', settings.width);
                localContainer.css('width', settings.width);

                localContainer.on('stylechanged', function () {
                    stopVideo();
                });

                if ( settings.dotsExist){
                    createDots();
                }

                if ( settings.arrowsExist){
                    addArrows();           
                }

                if ( settings.autoslide){
                    
                    startSlide(); 

                    $('.arrows')
                        .on('click', stopSlide)
                        .on('click', stopVideo)
                        .on('mouseleave',  startSlide);
                    
                    video
                        .on('play',stopSlide)
                        .on('ended',startSlide);
                    
                    localContainer
                        .on('click', '.dots', stopSlide)
                        .on('mouseleave','.dot', startSlide);
                }
            }
            
          
            function addArrows(){

                localPrev =  $("<div class='arrows prev' />").insertBefore(slider);
                localNext = $("<div class='arrows next'/>").insertAfter(slider);

                localPrev.on('click',  function(){
                    moveSlide('left');
                });
                
                localNext.on('click', function(){
                    moveSlide('right');
                });

                localNext.css('margin-left',settings.width+10)

            }

            function createDots(){    
                
                dots = $("<div class='dots'/>").insertAfter(slider);
              
                for(var i = 1; i < slidesQuantity+1; i++){
                    $('<span/>').attr('class','dot').attr('data-tag', 'd'+i).appendTo(dots);
                }

                dot = $(dots).find('.dot');

                localContainer.on('click', '.dot', function(event){
                    changeSlide(parseInt(event.target.attributes.getNamedItem('data-tag').value.split('')[1]));
                });
            }
        
            function dotChanges(currentSlide,way){
                if ( way === 'left'){
                    if ( currentSlide === 1){
                        dotColorChange(slidesQuantity);
                    } else {
                        currentSlide--;                      
                        dotColorChange(currentSlide);
                    }
                } else if( way === 'right'){
                    dotColorChange(currentSlide);
                    if ( currentSlide > slidesQuantity ){
                        dotColorChange(1);
                    } 
                } else{
                    throw new Error('No such way: '+way);
                }
            }

            function dotColorChange(e){
                --e;
                dot.css('background-color', '#bbb');
                $(dots.children()[e]).css('background-color', 'black');  
            }

            function startSlide () {
                stopSlide();
                interval = setInterval(function(){
                    moveSlide('right');
                }, settings.durationOfSlide);
            }

            function stopSlide(){
                clearInterval(interval);
            }

            function updateSliderCss(value){
                slider
                    .stop(true,true)
                    .animate({'margin-left' : value}, settings.animationSpeed);
            }

            function changeSlide(number){
                currentSlide = number;
                updateSliderCss(-(number*width - width));
                dotColorChange(number);       
            }
            
            function moveSlide(way){
                 if ( way === 'left'){
                    if (currentSlide === 1){
                        updateSliderCss('-='+lastSliderWidth)
                        if( settings.dotsExist){
                            dotChanges(currentSlide, way);
                        }
                        currentSlide = slidesQuantity;
                    } else {
                        updateSliderCss('+='+width);
                        if( settings.dotsExist){
                            dotChanges(currentSlide, way);
                        }
                        currentSlide--;
                    }
                } else if(way === 'right'){
                    if ( ++currentSlide > slidesQuantity) {
                        currentSlide = 1;
                        updateSliderCss('0');
                        if( settings.dotsExist){
                            dotChanges(currentSlide, way);
                        }
                    } else {
                        updateSliderCss('-='+width);
                        if( settings.dotsExist){
                            dotChanges(currentSlide, way);
                        }
                    }
                }else{
                    throw new Error('No such way: '+way);
                }
            }
    
            function stopVideo(){
                if( !video.paused){                        
                    video.trigger('pause');
                }
            }


            init();
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
        autoslide : true,
    });

    
});

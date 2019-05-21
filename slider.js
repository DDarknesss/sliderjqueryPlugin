(function($){
    
    $.fn.pluginJQ  = function (options ) {   
    
        var settings =$.extend({
            durationOfSlide: 3000,
            animationSpeed : 500,
            dotsExist : true,
            arrowsExist :  true,
            autoslide : true,
        }, options);


        return this.each(function() {
            
            var slider = $(this);
            var slidesQuantity = $(this)[0].children.length;
            var video = $('li video');
            var wrapper = slider.wrap('<div class="container"/>');
            var localContainer = slider.parent();

            var width = 400;
            var lastSliderWidth = (width*slidesQuantity) - width;
            var currentSlide = 1;
            var localPrev = localContainer.prev();
            var localNext = localContainer.next();
            var interval, dots,dot;

            function init(){

                wrapper;

                if ( settings.dotsExist){
                    createDots();
                }

                if ( settings.arrowsExist){
                    addArrows();           
                }

                if ( settings.autoslide){
                    
                    startSlide();

                    $('.arrows')
                        .on('mouseenter', stopSlide)
                        .on('mouseleave',  startSlide);
                    video
                        .on('play',stopSlide)
                        .on('ended',startSlide);
                    localContainer
                        .on('click', '.dots', stopSlide)
                        .on('mouseleave',  '.dot', startSlide);
                }
            }
            
            function createDots(){    
                
                dotInsertion = $("<div class='dots'/>").insertAfter(slider);
                dots =  slider.next();

                dots.each( function (){
                    for(var i = 1; i < slidesQuantity+1; i++){
                        $('<span/>').attr('class',"dot").attr('id','d'+i).appendTo(this);
                    }
                });

                dot = $(dots).find('.dot');

                localContainer.on('click', '.dot', function(){
                    changeSlide(parseInt(event.target.id.split('')[1]));                
                });
            }

            function addArrows(){

                prevArrowInsertion =  $("<div class='arrows prev' />").insertBefore(slider);
                nextArrowInsertion = $("<div class='arrows next'/>").insertAfter(slider);
                localPrev = slider.prev();
                localNext = slider.next();

                localPrev.on('click', $.debounce(10, function(){
                    moveSlide('left');
                }));
                
                localNext.on('click', $.debounce(10,function(){
                    moveSlide('right');
                }));
            }
        
            function dotChanges(currentSlide,way){
                if ( way === 'left'){
                    if ( currentSlide === 1){
                        dotColorChange(slidesQuantity);
                    } else {
                        currentSlide--;                      
                        dotColorChange(currentSlide);
                    }
                    
                } else{
                    dotColorChange(currentSlide);
                    if ( currentSlide > slidesQuantity ){
                        dotColorChange(1);
                    } 
                }
            }

            function dotColorChange(e){
                --e;
                dot.css('background-color', '#bbb');
                $(dots.children()[e]).css('background-color', 'black');  
            }

            function startSlide () {
                clearInterval(interval);
                interval = setInterval(function(){
                    moveSlide('right');
                }, settings.durationOfSlide);
            }

            function stopSlide(){
                clearInterval(interval);
            }

            function updateSliderCss(value){
                slider.animate({'margin-left' : value}, settings.animationSpeed);
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
                } else {
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
        autoslide : false,
    });

    $('ul.slider1').pluginJQ({
        dotsExist : true,
        arrowsExist :false,
        autoslide : true,
    });

    $('ul.slider2').pluginJQ({
        dotsExist : false,
        arrowsExist :true,
        autoslide : false,
    });

    
});

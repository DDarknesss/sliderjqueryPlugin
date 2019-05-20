(function($){
    
    $.fn.pluginJQ  = function (options ) {   
    
        var settings =$.extend({
            durationOfSlide: 3000,
            animationSpeed : 500,
            dotsExist : true,
            arrowsExist :  true,
            autoslide : true,
        }, $.fn.pluginJQ.defaults, options);

        return this.each(function() {
            
            var slider = $(this);
            var context = slider.attr('class');
            var slidesQuantity = $(this)[0].children.length;
            var video = $('.' +context + 'li video');
            var img = $('.' +context + 'li img');

            var wrapper = slider.wrap('<div class="container"/>');
            var localContainer = slider.parent();
            var prevArrowInsertion = $("<div class='arrows prev' />").insertBefore(localContainer);
            var nextArrowInsertion = $("<div class='arrows next'/>").insertAfter(localContainer);
            var localPrev = localContainer.prev();
            var localNext = localContainer.next();

            var dotInsertion = $("<div class='dots'/>").insertAfter($(this));
            var dots =  $(this).next();
            var dot;

            var width = 400;
            var lastSliderWidth = (width*slidesQuantity) - width;
            var currentSlide = 1;
            
            var interval;


            function init(){

                wrapper; 

                video
                    .on('play',stopSlide)
                    .on('ended',startSlide);
    
                img
                    .on('mouseleave',startSlide)
                    .on('mouseover',stopSlide);
    
                if ( settings.dotsExist){
                    createDots();
                }
    
                if ( settings.arrowsExist){
                    addArrows();           
                }
    
                if ( settings.autoslide){
                    startSlide();
                }   
            }

            function createDots(){    
                
                dotInsertion;
                dots.each( function (){
                    for(var i = 1; i < slidesQuantity+1; i++){
                        $('<span/>').attr('class',"dot").attr('id','d'+i).appendTo(this);
                    }
                });

                dot = $(dots).find('.dot');
   
                localContainer
                    .on('mouseover',dots, stopSlide)
                    .on('mouseleave', dots, startSlide)
                    .on('click', '.dots', function(){
                        changeSlide(parseInt(event.target.id.split('')[1]));                
                    });
            }

            function addArrows(){

                prevArrowInsertion;
                nextArrowInsertion;
    
                localPrev
                    .on('mouseover',dots, stopSlide)
                    .on('mouseleave', dots, startSlide)
                    .on('click', $.throttle(1000, function(){
                        moveSlide('left');
                    }));
            
                localNext
                    .on('mouseover',dots, stopSlide)
                    .on('mouseleave', dots, startSlide)
                    .on('click', $.throttle(1000,function(){
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
                    currentSlide++;
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
                interval = setInterval(function(){
                    moveSlide('right');
                }, settings.durationOfSlide);
            }
    
            function stopSlide(){
                clearInterval(interval);
            }

            function updateSliderCss(margin, value){
                slider.css(margin,value);
            }
    
            function changeSlide(number){
                currentSlide = number;
                updateSliderCss('margin-left', -(number*width - width));
                dotColorChange(number);       
            }

  
            function moveSlide(way){
    
                if ( way === 'left'){
                    if (currentSlide === 1){
                        updateSliderCss('margin-left', '-='+lastSliderWidth);
                        dotChanges(currentSlide, way);
                        currentSlide = slidesQuantity;
                    }else {
                        slider.animate({'margin-left': '+='+width},settings.animationSpeed);
                        dotChanges(currentSlide, way);
                        currentSlide--;
                    }
                } else {
                    
                    slider.animate({'margin-left': '-='+width},settings.animationSpeed, function () {
                        if ( ++currentSlide > slidesQuantity) {
                            currentSlide = 1;
                            updateSliderCss('margin-left', '0');
                        }
                    });
                    dotChanges(currentSlide, way);
                }
            }
   
        init();
        return this;
        });
    };
}( jQuery ));
    
    

$(document).ready(function(){
    $('ul').pluginJQ({
        dotsExist : true,
        arrowsExist :true,
        autoslide : true,
    });
});

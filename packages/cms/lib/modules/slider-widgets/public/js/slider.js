(function () {
    $(document).ready(function () {
        if ($('.slider').length) {
            $('.slider').each(function () {
                var $ul = $(this).find('.slide-items');
                var afterFirst = $ul.find('li:not(:first)');
                afterFirst.hide();
                
                var $slides = $(this).find('li.slide-item');
                
                if ($slides.length < 2) {
                    $(this).find('.button').hide();
                } else {
                    $(this).find('.button-left').on('click', goToPreviousSlide);
                    $(this).find('.button-right').on('click', goToNextSlide);
                }
                
            });
            
            function goToPreviousSlide () {
                var $ul = $(this).closest('.slide-items');
                var $currLi = $ul.find('li:visible');
                $currLi.hide();
                var $prevLi = $currLi.prev('li');
                
                if ($prevLi.length) {
                    $prevLi.show();
                } else {
                    $ul.find('li:last').show();
                }
            }
            
            function goToNextSlide () {
                var $ul = $(this).closest('.slide-items');
                var $currLi = $ul.find('li:visible');
                $currLi.hide();
                var $nextLi = $currLi.next('li');
                
                if ($nextLi.length) {
                    $nextLi.show();
                } else {
                    $ul.find('li:first').show();
                }
            }
        }

        if ($('.automatic-slider').length) {
            $('.automatic-slider').each(function () {
                var $slider = $(this);
                var $slides = $slider.find('.slide-item');
                var currentSlide = 0;
                var autoPlayInterval;
                var $pauseButton = $slider.find('.rotation');
                var $nextButton = $slider.find('.next');
                var $prevButton = $slider.find('.previous');
                var $skipButton = $slider.find('.a11y-slider-sr-only');

                if ($slides.length < 2) {
                    $slider.find('.button').hide();
                } else {
                    $nextButton.on('click', goToNextSlide);
                    $prevButton.on('click', goToPreviousSlide);
                    $pauseButton.on('click', toggleAutoPlay);

                    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (prefersReducedMotion) {
                        enableOrDisableAutoRotation(true);
                    } else {
                        enableOrDisableAutoRotation(false);
                        autoPlay();
                    }

                    setAccessibleStyling(true);

                    $slider.on('focusin', stopAutoPlay).on('focusout', autoPlay);
                    $slider.on('mouseenter', stopAutoPlay).on('mouseleave', autoPlay);
                }

                $skipButton.on('click', function () {
                    var target = $slider.nextAll(':focusable').first();

                    if (target.length === 0) {
                        target = $slider.parent().nextAll(':focusable').first();
                    }

                    if (target.length > 0) {
                        target.focus();
                    }
                });

                function goToPreviousSlide() {
                    $slides.eq(currentSlide).removeClass('active');
                    currentSlide = (currentSlide === 0) ? $slides.length - 1 : currentSlide - 1;
                    $slides.eq(currentSlide).addClass('active');
                }

                function goToNextSlide() {
                    $slides.eq(currentSlide).removeClass('active');
                    currentSlide = (currentSlide === $slides.length - 1) ? 0 : currentSlide + 1;
                    $slides.eq(currentSlide).addClass('active');
                }

                function autoPlay() {
                    autoPlayInterval = setInterval(goToNextSlide, 3000);
                }

                function stopAutoPlay() {
                    clearInterval(autoPlayInterval);
                }

                function toggleAutoPlay() {
                    if ($pauseButton.hasClass('pause')) {
                        $pauseButton.removeClass('pause');
                        $pauseButton.addClass('play');
                        $pauseButton.attr('aria-label', 'Start automatische slide show');
                        $pauseButton.attr('aria-live', 'polite');
                        autoPlay();
                    } else {
                        $pauseButton.removeClass('play');
                        $pauseButton.addClass('pause');
                        $pauseButton.attr('aria-label', 'Stop automatische slide show');
                        $pauseButton.attr('aria-live', 'off');
                        stopAutoPlay();
                    }
                }

                function enableOrDisableAutoRotation(disable) {
                    if (disable) {
                        $pauseButton.hide();
                    } else {
                        $pauseButton.show();
                    }
                }

                function setAccessibleStyling(accessible) {
                    if (accessible) {
                        $slider.addClass('carousel-moreaccessible');
                    } else {
                        $slider.removeClass('carousel-moreaccessible');
                    }
                }
            });
        }
    });
})();
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
                $slides.eq(0).addClass('active');
                var $slidesContainer = $slider.find('.slide-items');
                var currentSlide = 0;
                var autoPlayInterval;
                var $pauseButton = $slider.find('.rotation.pause');
                var $startButton = $slider.find('.rotation.play');
                var $nextButton = $slider.find('.next');
                var $prevButton = $slider.find('.previous');
                var $skipButton = $slider.find('.a11y-slider-sr-only');
                var isAutoPlayEnabled = false;

                if ($slides.length < 2) {
                    $slider.find('.button').hide();
                } else {
                    $nextButton.on('click', goToNextSlide);
                    $prevButton.on('click', goToPreviousSlide);
                    $pauseButton.on('click', pauseAutoPlay);
                    $startButton.on('click', startAutoPlay);

                    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (prefersReducedMotion) {
                        enableOrDisableAutoRotation(true);
                    } else {
                        enableOrDisableAutoRotation(false);
                        startAutoPlay();
                    }

                    setAccessibleStyling(true);

                    $slider.on('mouseenter', pauseSlides).on('mouseleave', startSlides);
                }

                $skipButton.on('click', function () {
                    $slider.parentsUntil(':focusable').nextAll(':focusable').first().focus();
                });

                function pauseSlides() {
                    if (isAutoPlayEnabled) {
                        clearInterval(autoPlayInterval);
                        $slidesContainer.attr('aria-live', 'off');
                    }
                }

                function startSlides() {
                    if (isAutoPlayEnabled) {
                        autoPlayInterval = setInterval(goToNextSlide, 3000);
                        $slidesContainer.attr('aria-live', 'polite');
                    }
                }

                function startAutoPlay() {
                    if (!isAutoPlayEnabled) {
                        isAutoPlayEnabled = true;
                        autoPlayInterval = setInterval(goToNextSlide, 3000);
                        $slidesContainer.attr('aria-live', 'polite');
                        $pauseButton.hide();
                        $startButton.show();
                    }
                }

                function pauseAutoPlay() {
                    if (isAutoPlayEnabled) {
                        isAutoPlayEnabled = false;
                        clearInterval(autoPlayInterval);
                        $slidesContainer.attr('aria-live', 'off');
                        $startButton.hide();
                        $pauseButton.show();
                    }
                }

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

                function enableOrDisableAutoRotation(disable) {
                    if (disable) {
                        $pauseButton.hide();
                        $startButton.hide();
                    } else {
                        $pauseButton.show();
                        $startButton.show();
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
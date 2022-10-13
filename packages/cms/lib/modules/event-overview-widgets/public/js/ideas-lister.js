function initGridder() {
  if ( !document.querySelector('#events-overview') ) return;

	$('.gridder').gridderExpander({
    scroll: true,
    scrollOffset: 100,
    scrollTo: "panel",                  // panel or listitem
    animationSpeed: 300,
    animationEasing: "easeInOutExpo",
    showNav: true,                      // Show Navigation
    nextText: "<span></span>", // Next button text
    prevText: "<span></span>", // Previous button text
    closeText: "", // Close button text                // Close button text
    onStart: function(target) {
			var isPhone = document.querySelector('body').offsetWidth < 700; // isPhone - todo: betere afvanging
			this.scrollOffset = isPhone ? -40: 100;
		},
    onContent: function(args){

			var element = args[0];
			var eventId =  element && element.querySelector('.this-event-id') ? element.querySelector('.this-event-id').innerHTML : false;
			window.history.replaceState({}, '', '#eventId-' + eventId);

			initImagesGallery();

			return false;
		},
    onClosed: function(){
			window.history.replaceState({}, '', '#');
		}
  });
}

(function($) {
	// Call Gridder
  initGridder();

  $(document).on('openstadAjaxRefresh', function () {
    initGridder();
  });

})(jQuery);

var currentOverlay;
function eventListClick(event) {
	// search for the element clicked
  var target = event.target;
	var mouseOverLayer;
	var eventElement;
	var button;


  while ( target.tagName != 'HTML' ) {
    if ( target.className.match(/gridder-mouse-over|info/) ) {
      mouseOverLayer = target;
    }
    if ( target.className.match(/button-more-info|button-vote/) ) {
      button = target;
    }
    if ( target.className.match('gridder-list') ) {
      eventElement = target;
      break;
    }
    target = target.parentNode || target.parentElement;
  }

	var isPhone = document.querySelector('body').offsetWidth < 700; // isPhone - todo: betere afvanging
	// on phone first click shows moseover, second acually shows something
	if (isPhone && mouseOverLayer) {
		if (mouseOverLayer.className.match(/ showFirst/)) {
			mouseOverLayer.className = mouseOverLayer.className.replace(' showFirst', '');
			mouseOverLayer.style.display = 'none';
		} else {
			mouseOverLayer.className += ' showFirst';
			event.stopPropagation()
			event.stopImmediatePropagation()
			return;
		}
	}

  if ( eventElement && button ) {

		// if button == 'more info' use gridder
		// if (button.className == 'button-more-info') {
		//  	return;
		// }

		// if button == 'stem'
		if (button.className == 'button-vote') {
			var match = eventElement.id.match(/event-(\d+)/)

			if (match) {
				// TODO: wat je hier moet doen moet niet hardcoded zijn
		//		selectIdea(match[1])

				// cancel gridder
				if (mouseOverLayer) {
					event.stopPropagation()
					event.stopImmediatePropagation()
				}

			}
		}

	}

	// cancel gridder
	// if (mouseOverLayer) {
	//  	event.stopPropagation()
	//  	event.stopImmediatePropagation()
	// }

}

function scrollToIdeas() {
  scrollToResolver(document.getElementById('events-anchor'));
}

function scrollToResolver(elem) {
	if (elem) {
	  var jump = parseInt(elem.getBoundingClientRect().top * .2);
	  document.body.scrollTop += jump;
	  document.documentElement.scrollTop += jump;
	  if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
	    elem.lastjump = Math.abs(jump);
	    setTimeout(function() { scrollToResolver(elem);}, 25);
	  } else {
	    elem.lastjump = null;
	  }
	}
}

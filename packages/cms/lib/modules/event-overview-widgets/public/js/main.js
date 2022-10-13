$(document).ready(function () {
	eventsOverviewDisplayIdeaOnHash();
});

$(document).on('click', '.current-budget-images a', function (ev) {
	setTimeout(function() {
		eventsOverviewDisplayIdeaOnHash();
	}, 1);
});

function eventsOverviewDisplayIdeaOnHash () {
	var showIdeaId;
	var match = window.location.search.match(/eventId=(\d+)/);

	if (match) {
		showIdeaId = match[1];
	};

	var match = window.location.hash.match(/eventId-(\d+)/);
	if (match) {
		showIdeaId = match[1];
	};

	var isOpen =  $('#event-' + showIdeaId).hasClass('selectedItem');

	var scrollToTop;
	var stickyHeight = $(window).width() > 767 ? 76 : 109;

	if (isOpen) {
		scrollToTop = $('.gridder-show').offset().top - stickyHeight - 12;

		$([document.documentElement, document.body]).animate({
        scrollTop: scrollToTop
    }, 200);
	} else {
		if (showIdeaId && document.querySelector('#event-' + showIdeaId) && document.querySelector('#event-' + showIdeaId).querySelector('.button-more-info')) {
		//	document.querySelector('#event-' + showIdeaId).querySelector('.button-more-info').click();
			$('#event-' + showIdeaId).find('.button-more-info').click();
			setTimeout(function() {
				scrollToTop = $('.gridder-show').offset().top - stickyHeight - 12;
				$([document.documentElement, document.body]).stop().animate({
						scrollTop: scrollToTop
				}, 100);

			})
		}
	}
//	return false;
}

$(document).ready(function () {
	if (window.eventId) {
		showVoteCreator();
		selectIdea(window.eventId, true);
	}
	
	if ($('#eventList li').length) {
		// Make sure the gridder-mouse-over is visible when tabbing through the buttons
		$('li.gridder-list .gridder-mouse-over a').on('focus', function () {
			$(this).closest('.gridder-mouse-over').addClass('hovered');
		});
		$('li.gridder-list .gridder-mouse-over a').on('blur', function () {
			$(this).closest('.gridder-mouse-over').removeClass('hovered');
		})
	}
});

$(document).on('openstadAjaxRefresh', function () {
	if (window.voteBlockIdentifier) {
		var eventId = openstadGetCookie('eventId' + voteBlockIdentifier);
		showVoteCreator();

		if (eventId) {
			selectIdea(eventId, true);
		}
	}
});

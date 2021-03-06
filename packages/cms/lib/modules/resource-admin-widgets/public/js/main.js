$(document).ready(function() {
  initVoteToggleForms();
});

function initVoteToggleForms () {
    $('.vote-toggle-form').animate({opacity:1}, 500);

    $('.vote-toggle-form').on('submit', function (ev) {
    ev.preventDefault();
    var $form = $(this);
    var $tr = $(this).closest('tr');

    $.ajax({
       url: $form.attr('action'),
     //  context: document.body,
       type: $form.attr('method'),
       data: $form.serialize(),
       dataType: 'json',
       success:function(response) {
         if (response.checked) {
           $form.find(".vote-approved-text").show();
           $form.find(".vote-unapproved-text").hide();
           $tr.removeClass('rejected');
         } else {
           $form.find(".vote-approved-text").hide();
           $form.find(".vote-unapproved-text").show();
           $tr.addClass('rejected');
         }
       },
       error:function(response) {
         alert('Er gaat iets mis: ' + response.responseJSON.error.message);
       },
     });

  });
}

$(document).ready(function() {
  
  $('#new-tweet textarea').on('keyup', function() {
    const charsUsed = $(this).val().length;
    const counter = $(this).nextAll('.counter');
    counter.text(140 - charsUsed);
    if (counter.text() < 0) {
      counter.addClass('invalid');
    } 
    if (counter.text() >= 0) {
      counter.removeClass('invalid');
    }
  });

});

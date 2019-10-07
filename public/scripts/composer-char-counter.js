$('.new-tweet textarea').on('keyup', function() {
  $(this).nextAll('.counter').text(140 - $(this).val().length);
});
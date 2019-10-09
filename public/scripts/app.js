/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function(obj) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const today = Date.now();
  const createdAt = new Date(obj.created_at);
  const diffDays = Math.round(Math.abs((today - createdAt) / oneDay));
  let timestamp;
  
  (diffDays === 1) ? timestamp = `${diffDays} day ago` : timestamp = `${diffDays} days ago`;
  
  return `
  <article class='tweet'>
    <header>
      <img class='avatars' src='${obj.user.avatars}'>
      <div class='name'>${obj.user.name}</div>
      <div class='handle'>${obj.user.handle}</div>
    </header>
      <div class='content-text'>
      ${escape(obj.content.text)}
      </div>
    <footer>
      <div class='timestamp'>${timestamp}</div>
      <div class='tweet-buttons'>
        <img src='/images/heart.png'>
        <img src='/images/retweet.png'>
        <img src='/images/flag.png'>
      </div>
    </footer>
  </article>
  `;
};

const renderTweets = function(tweets) {
  let renderedTweetsArray = [];
  for (let tweet of tweets) {
    renderedTweetsArray.unshift(createTweetElement(tweet));
  }
  $('#tweets-container').append(renderedTweetsArray.join(''));
};

const loadTweets = function() {
  $.get('/tweets', function(data) {
    renderTweets(data);
  });
};

$(document).ready(function() {

  loadTweets();
  
  $('#new-tweet form').submit(function(event) {
    event.preventDefault();
    // Input Validation
    if (!$('textarea').val()) {
      alert('There is nothing to submit!');
      return;
    } else if ($('textarea').val().length > 140) {
      alert('This tweet has exceeded maximum character length!');
      return;
    } else { // Submit tweet if all validation has passed
      $.ajax({
        method: 'POST',
        url: '/tweets',
        data: $(this).serialize()
      }).done(function() {
        $('#tweets-container').empty();
        loadTweets();
        $('textarea').val('');
        $('.counter').text('140');
      }).fail(function(error) {
        console.log('An error has occured', error);
      });
    }
  });

  $('#navbar .toggle').click(function() {
    $('#new-tweet').slideToggle('slow', function() {
      if ($(this).is(':visible')) {
        $('#new-tweet textarea').focus();
      }
    });
  });

  $('#scroll-to-top').hide();

  $(window).scroll(function() {
    $('#scroll-to-top').show();
    $('#navbar .toggle').hide();
    if ($(window).scrollTop() === 0) {
      $('#scroll-to-top').hide();
      $('#navbar .toggle').show();
    }
  })

  $('#scroll-to-top').click(function() {
    window.scrollTo(0, 0);
      if ($('#new-tweet').is(':hidden')) {
        $('#new-tweet').slideDown();
      }
    $('#new-tweet textarea').focus();
  })

});

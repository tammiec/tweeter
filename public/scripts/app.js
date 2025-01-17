const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// creates HTML for each Tweet
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
      <img class='avatars' src='${obj.user.avatars}' alt='User avatar'>
      <div class='name'>${obj.user.name}</div>
      <div class='handle'>${obj.user.handle}</div>
    </header>
      <div class='content-text'>
      ${escape(obj.content.text)}
      </div>
    <footer>
      <div class='timestamp'>${timestamp}</div>
      <div class='tweet-buttons'>
        <img src='/images/heart.png' alt='Heart symbol' title='Like'>
        <img src='/images/retweet.png' alt='Retween symbol' title='Retweet'>
        <img src='/images/flag.png' alt='Flag symbol' title='Flag'>
      </div>
    </footer>
  </article>
  `;
};

// renders tweets in descending order
const renderTweets = function(tweets) {
  let renderedTweetsArray = [];
  for (let tweet of tweets) {
    renderedTweetsArray.unshift(createTweetElement(tweet));
  }
  $('#tweets-container').append(renderedTweetsArray.join(''));
};

// loads all tweets from server
const loadTweets = function() {
  $.get('/tweets', function(data) {
    renderTweets(data);
  });
};


$(document).ready(function() {

  loadTweets();
  
  // hidden elements on load
  $('#new-tweet').hide();
  $('#error-message').hide();
  $('#scroll-to-top').hide();

  // slides new tweet into view
  $('#navbar .toggle').click(function() {
    $('#new-tweet').slideToggle('slow', function() {
      if ($(this).is(':visible')) {
        $('#new-tweet textarea').focus();
      }
      $('#error-message').hide();
    });
  });

  // shows & hides scroll-to-top button
  $(window).scroll(function() {
    $('#error-message').slideUp();
    $('#scroll-to-top').show();
    $('#navbar .toggle').hide();
    if ($(window).scrollTop() === 0) {
      $('#scroll-to-top').hide();
      $('#navbar .toggle').show();
    }
  });

  // scrolls to top of the page on click
  $('#scroll-to-top').click(function() {
    window.scrollTo(0, 0);
    if ($('#new-tweet').is(':hidden')) {
      $('#new-tweet').slideDown();
    }
    $('#new-tweet textarea').focus();
  });

  // submits new tweet to server
  $('#new-tweet form').submit(function(event) {
    let self = this;
    event.preventDefault();
    $.when($('#error-message').slideUp()).then(function() {
      const input = $('textarea').val();
      let errorMessage = '';
      // Input Validation
      if (input.length === 0 || input.length > 140) {
        errorMessage = '&#10006; There is nothing to submit...please give us some food for thought! &#10006;';
        if (input.length > 140) {
          errorMessage = '&#10006; Whoa...way too much information...keep it under 140 characters please! &#10006;';
        }
        $('#error-message').empty();
        $('#error-message').append(errorMessage);
        $('#error-message').slideDown();
        return;
      }
      // Submit tweet if all validation has passed
      $.ajax({
        method: 'POST',
        url: '/tweets',
        data: $(self).serialize()
      }).done(function() { // reload tweets and form after tweet has been submitted
        $('#tweets-container').empty();
        loadTweets();
        $('textarea').val('');
        $('.counter').text('140');
      }).fail(function(error) {
        console.log('An error has occured', error);
      });
    });
  });

});

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  
  
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
    ${obj.content.text}
    </div>
    <footer>
    <div class='timestamp'>${timestamp}</div>
    <img src='/images/heart.png'>
    <img src='/images/retweet.png'>
    <img src='/images/flag.png'>
    </footer>
    </article>
    `;
  };
  
  const renderTweets = function(tweets) {
    // loops through tweets
    for (let tweet of tweets) {
      // calls createTweetElement for each tweet
      let $tweet = createTweetElement(tweet);
      // takes return value and appends it to the tweets container
      $('#tweets-container').append($tweet);
    }
  };
  
  const loadTweets = function() {
    $.get('/tweets', function(data) {
      renderTweets(data);
    });
  };

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
        data: $(this).serialize(),
        success: function() {
          console.log('Submission was successful.');
          console.log(this.data);
        },
      })
        .done(function() {
          location.reload();
        });
    }
  });
});

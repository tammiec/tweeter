/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const createTweetElement = function(obj) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const today = Date.now();
  const createdAt = new Date(obj.created_at * 1000);
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
  $(document).ready(function() {
    for (let tweet of tweets) {
      // calls createTweetElement for each tweet
      let $tweet = createTweetElement(tweet);
      // takes return value and appends it to the tweets container
      $('#tweets-container').append($tweet);
    }
  });
};

// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1569951091
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1570123891
  }
];

renderTweets(data);

$(function() {
  $('#new-tweet form').submit(function(event) {
    console.log('a new tweet has emerged!');
    event.preventDefault();

    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: $(this).serialize(),
      success: function () {
        console.log('Submission was successful.');
        console.log(this.data);
      },
      error: function () {
          console.log('An error occurred.');
          console.log(this.data);
      },
    })
  })

})
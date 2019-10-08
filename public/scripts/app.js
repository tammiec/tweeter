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

  if (diffDays === 1) {
    timestamp = `${diffDays} day ago`
  } else {
    timestamp = `${diffDays} days ago`
  }

  return tweet = `
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
}

// Test / driver code (temporary). Eventually will get this from the server.
const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": "https://i.imgur.com/73hZDYK.png",
    "handle": "@SirIsaac"
    },
  "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
  "created_at": 1569951091
}

const $tweet = createTweetElement(tweetData);

// Test / driver code (temporary)
console.log($tweet); // to see what it looks like
$('#tweets-container').append($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.


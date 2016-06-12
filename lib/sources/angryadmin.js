"use strict";

const request = require("request");

const regex = /Deny from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2})/g;

function grab(feed) {
  request("https://www.angryadmin.co.uk/?page_id=55", (error, response, body) => {
    if(!error && response.statusCode === 200) {
      let match;
      while(match = regex.exec(body)) {
        feed({ network: match[1] });
      }
    }
  });
}

module.exports = (feed) => {
  grab(feed);
  setInterval(() => {
    grab(feed);
  }, 1000 * 3600 * 48);
};

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */

var yt = require('./lib/yt'),
    vimeo = require('./lib/vimeo'),
    parser = require('./lib/parser'),
    vcr;

// (function() {

//     vcr = {
//         set: function(url) {
//             // First we'll parse the data properly, then see if it's a youtube/ vimeo/html5 video. 
//             parser.parse(url);
//         }

//     };

// }());

function vcr() {
    console.log('waiting for the VCR to turn on...');
}

vcr.prototype = {
    set: function(url) {
        // First we'll parse the data properly, then see if it's a youtube/ vimeo/html5 video. 
        parser.parse(url);
    }

};

window.vcr = vcr;

module.exports = vcr;
},{"./lib/parser":2,"./lib/vimeo":3,"./lib/yt":4}],2:[function(require,module,exports){
'use strict';

var parser = {

    parse: function(url) {
        var type = null;

        this.parsePlainUrl(url);

        if (RegExp && RegExp.$3 && RegExp.$3.indexOf('youtu') > -1) {
            type = 'youtube';
        } else if (RegExp && RegExp.$3 && RegExp.$3.indexOf('vimeo') > -1) {
            type = 'vimeo';
        }

        return {
            type: type || '',
            id: RegExp.$6 || ''
        };

    },

    isValidUrl: function(url) {
        var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        if (regex.test(url)) {
            return true;
        } else {
            return false;
        }
    },

    parsePlainUrl: function(url) {
        if (this.isValidUrl(url)) {
            return (url) ? url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/) : '';
        } else {
            return false;
            console.log('url is not valid');
        }
    }
};

module.exports = parser;
},{}],3:[function(require,module,exports){
 /* global document */
 'use strict';

 module.exports = {

     player: '',

     iframe_id: '',

     play: function() {
         this.post('play');
     },

     pause: function() {
         this.post('pause');
     },

     seek: function(timeInVideo) {
         this.post('seek', timeInVideo);
     },

     setPlayer: function(videoId, iframe_id) {
         var iframe = document.getElementById(iframe_id);
         iframe.src = this.setURL(videoId);

         // Set things!
         this.iframeId = '#' + iframe_id;
         this.playerId = iframe_id;
     },


     addEventListeners: function() {
         this.post('addEventListener', 'play');
         this.post('addEventListener', 'pause');
         this.post('addEventListener', 'finish');
         this.post('addEventListener', 'seek');
     },

     post: function(action, value) {
         var data = {
                 method: action
             },
             $player = document.querySelector(this.iframeId);

         if (value) {
             data.value = value;
         }
         var url = $player.src,
             message = JSON.stringify(data);

         document.getElementById(this.playerId).contentWindow.postMessage(message, url);
     },

     setURL: function(videoId) {
         var videoUrl = '//player.vimeo.com/video/' + videoId + '?byline=0&portrait=0&title=0&autoplay=0&badge=0&api=1&player_id=' + this.playerId;
         return videoUrl;
     }
 }
},{}],4:[function(require,module,exports){
// demo: http://jsfiddle.net/x0nvpbgs/

/* global document, YT */
'use strict';

module.exports = {

    player: null,

    ready: false,

    iframeId: '',

    playerId: '',

    play: function() {
        if (this.player) {
            this.player.playVideo();
        }
    },

    pause: function() {
        if (this.player) {
            this.player.pauseVideo();
        }
    },

    seek: function(timeInVideo) {
        if (this.player) {
            this.player.seekTo(timeInVideo);
        }
    },

    setPlayer: function(videoId, iframe_id) {
        // First we add the API
        this.addAPI();
        // Then we get the proper URL
        var url = this.setURL(videoId, iframe_id),
            iframe = document.querySelector('#' + iframe_id);
        iframe.src = url;
    },

    onPlayerReady: function(event) {
        var eEvent = new CustomEvent('media:videoReady');

        youtube.ready = true;
        youtube.player = event.target;

        document.dispatchEvent(eEvent);
    },

    onReady: function(playerId, vId) {
        var self = this;

        new YT.Player('testPlayer', {
            'videoId': vId,
            events: {
                'onReady': self.onPlayerReady
            }
        });
    },

    addAPI: function() {
        // Remove the existing script because YouTube API is weird like that and resets each time you use a new video "on the fly"
        var firstScriptTag,
            apiScript,
            existingScriptMatch = 'script[src="https://www.youtube.com/iframe_api"]',
            ytAPI = 'https://www.youtube.com/iframe_api',
            existingScript = document.querySelector(existingScriptMatch);
        // Create the script itself; modified version of what Youtube/Google suggest
        if (!existingScript) {
            apiScript = document.createElement('script');
            apiScript.src = ytAPI;
            firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(apiScript, firstScriptTag);
        }

    },

    setURL: function(videoID, iframe_id) {
        var self = this,
            playerId,
            videoUrl;

        this.iframeId = '#' + iframe_id;
        this.playerId = iframe_id;

        window.onYouTubeIframeAPIReady = function() {
            self.onReady(self.playerId, videoID);
        };
        // NOTE: This can cause a mismatch of protocols; to be safe, you
        // should just implement HTTPS on your site because youtube will do
        // this on their embedded videos by default. Also HTTPS should be on
        // your site anyway..

        videoUrl = '//www.youtube.com/embed/' + videoID + '?enablejsapi=1&color=white&modestbranding=1&playerapiid=' + playerId + '&rel=0&wmode=opaque';

        return videoUrl;
    }
};
},{}]},{},[1]);

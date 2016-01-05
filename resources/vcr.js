(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
 /* global document, window, CustomEvent */
 'use strict';

 var vcr = function(config, options) {
     this.set(config, options);
 };

 vcr.prototype = {

     vimeo: require('./lib/vimeo'),

     youtube: require('./lib/yt'),

     parser: require('./lib/parser'),

     parsedData: null,

     videoData: null,

     el: null,

     player: null,

     config: '',

     setVideoType: function() {
         if (this.parsedData !== undefined) {
             this.videoData = (this.parsedData.type === 'vimeo') ? new this.vimeo() : (this.parsedData.type === 'youtube') ? new this.youtube() : '';
         }
     },


     setListeners: function() {
         var self = this,
             events = ['play', 'pause', 'seek', 'volume', 'mute', 'stop'];

         for (var i = 0; i < events.length; i++) {
             makeListener(events[i]);
         }

         function makeListener(arg1) {
             self.player.addEventListener('vcr:' + arg1, function() {
                 self[arg1]();
             });
         }

         //Event listener to start playing
         this.player.addEventListener('vcr:play', function() {
             self.play();
         });

         this.player.addEventListener('vcr:pause', function() {
             self.pause();
         });

         this.player.addEventListener('vcr:stop', function() {
             self.stop();
         });

         this.player.addEventListener('vcr:seek', function(e) {
             self.seek(e.detail.seek);
         });

         this.player.addEventListener('vcr:volume', function(e) {
             self.seek(e.detail.volume);
         });

         this.player.addEventListener('vcr:currentTime', function(e) {
             return self.currentTime();
         });

         this.player.addEventListener('vcr:duration', function(e) {
             return self.duration();
         });
     },

     set: function(config, options) {
         var url, element;
         this.config = config;
         // if it's an object, then we know it doesn't have 
         if (config instanceof Object) {
             // If an element is given, then keep it, otherwise make up a vcr name and create the element!
             element = (config.el) ? config.el : 'vcrPlayer' + Math.floor(Math.random() * 6000) + 1;
             url = (config.url) ? config.url : '';
             if (element && config.url && document.querySelector('#' + config.el) === null) {
                 this.whereToPut(element, config);
             } else if (element && !config.url) {
                 element = config.el;
                 url = document.getElementById(element).src;
             } else {
                 console.error('Hmm, I don\'t think you added an element id or url...');
             }
             this.el = element;

             // If the user inputted a URL, that means we want to create an iframe, otherwise, config is just an element ID that we can use
         } else {
             element = config;
             url = document.getElementById(element).src;
             this.el = element;
         }

         var self = this,
             playerParams = (options && options.parameters) ? options.parameters : {};

         // First we'll parse the data properly, then see if it's a youtube/ vimeo/html5 video. 
         this.parsedData = this.parser.parse(url);

         this.setVideoType();

         var type = this.videoData,
             id = this.parsedData.id;

         if (options && options.autoplay) {
             playerParams.autoplay = 1;
         }
         if (type !== '') {

             this.player = document.getElementById(this.el);
             // Initial viewport check

             this.player.addEventListener('vcr:ready',
                 function() {
                     if (options && options.scrollStop) {
                         self.throttleVideo();
                         var throttler = self.debounce(self.throttleVideo, 250);
                         window.addEventListener('scroll', throttler);
                     }
                 });
             playerParams = this.setOptions(playerParams);

             this.videoData.setPlayer(id, element, playerParams);
             this.setListeners();
             this.setConfigDimensions();

         }
     },

     setConfigDimensions: function() {
         if (this.player) {
             var iframe = this.player,
                 config = this.config;
             iframe.width = (config.width && !iframe.width) ? config.width : iframe.width;
             iframe.height = (config.height && !iframe.height) ? config.height : iframe.height;
         }
     },

     whereToPut: function(el, config) {

         var c = config,
             // Create a new iframe!
             frame = document.createElement('iframe');

         frame.id = el;
         frame = frame.outerHTML;
         // Probably could be refactored somehow. Suggestions welcome!
         if (c.insertBefore) {
             document.querySelector(c.insertBefore).insertAdjacentHTML('beforebegin', frame);
         } else if (c.insertAfter) {
             document.querySelector(c.insertAfter).insertAdjacentHTML('afterEnd', frame);
         } else if (c.appendTo) {
             document.querySelector(c.appendTo).insertAdjacentHTML('beforeend', frame);
         } else if (c.prependTo) {
             document.querySelector(c.prependTo).insertAdjacentHTML('afterbegin', frame);
         } else {
             document.body.insertAdjacentHTML('afterbegin', frame);
         }
     },

     setOptions: function(params) {
         var queso = require('queso');
         return queso.stringify(params, true);
     },

     play: function() {
         // Event emitted when played
         this.fireEvent('playing');
         this.videoData.play();
     },

     pause: function() {
         this.fireEvent('paused');
         this.videoData.pause();
     },

     seek: function(duration) {
         this.fireEvent('sought');
         this.videoData.seek(duration);
     },

     volume: function(value) {
         this.fireEvent('volumeChanged');
         this.videoData.setVolume(value);
     },

     currentTime: function() {
         this.fireEvent('currentTime');
         return this.videoData.getCurrentTime();
     },

     duration: function() {
         this.fireEvent('durationTime');
         return this.videoData.getDuration();
     },

     mute: function() {
         this.fireEvent('muted');
         this.volume(0);
     },

     stop: function() {
         this.fireEvent('stopped');
         var self = this;
         self.videoData.stop();
     },

     customFn: function(functionName, argArray) {
         argArray = (argArray.length > 0) ? argArray : [];
         this.videoData.customFn(functionName, argArray);
     },

     fireEvent: function(arg) {
         var e = new CustomEvent('vcr:' + arg);
         this.player.dispatchEvent(e);
     },

     // MIGHT PUT IN SEPARATE UTIL FOLDER

     throttleVideo: function() {
         if (this.withinViewport(this.el) === false) {
             this.pause();
         } else {
             this.play();
         }

     },

     debounce: function(func, wait, immediate) {
         var timeout, context = this;
         return function() {
             var args = arguments;
             var later = function() {
                 timeout = null;
                 if (!immediate) {
                     func.apply(context, args);
                 }
             };
             var callNow = immediate && !timeout;
             clearTimeout(timeout);
             timeout = setTimeout(later, wait);
             if (callNow) {
                 func.apply(context, args);
             }
         };
     },

     // TODO: FIX THIS FOR SMALLER SCREENS
     withinViewport: function(el) {
         var element = document.getElementById(el),
             rect = element.getBoundingClientRect(),
             oneThird = element.offsetHeight / 3,
             leftover = window.innerHeight - rect.top;
         return (rect.top > 0 && leftover > (element.offsetHeight / 2) || (rect.top < (element.offsetHeight - oneThird) && rect.bottom >= oneThird));
     }

     // TODO: Implement this at some other time
     // rewind: function(value){},

     // fastForward: function(value) {
     //     var self = this;

     //     this.pause();

     //     this.currentTime();

     //     document.addEventListener('vcr:getCurrentTime', function(event) {
     //         self.seek(event.detail.time + value);
     //     });

     //     // document.addEventListener('vcr:fastForward', function(e) {
     //     //     console.log(e.detail);
     //     // });
     //     //});
     //     // In second

     // }
 };

 window.vcr = vcr;


 module.exports = vcr;

},{"./lib/parser":2,"./lib/vimeo":3,"./lib/yt":4,"queso":5}],2:[function(require,module,exports){
'use strict';
// ytParams = [
// 'autohide',
// 'autoplay',
// 'cc_load_policy',
// 'color',
// 'controls',
// 'disablekb',
// 'enablejsapi',
// 'end',
// 'fs',
// 'h1',
// 'iv_load_policy',
// 'list',
// 'listType',
// 'loop',
// 'modestbranding',
// 'origin',
// 'playerapiid',
// 'playsinline',
// 'rel',
// 'showinfo',
// 'start',
// 'theme' ],
// vimParams = ['autoplay',
// 'autopause',
// 'badge',
// 'byline',
// 'color',
// 'loop',
// 'player_id',
// 'portrait',
// 'title'];

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
        }
    }

};

module.exports = parser;
},{}],3:[function(require,module,exports){
 /* global document, CustomEvent, window */
 'use strict';

 var vimeo = function() {},
     addedListeners = false;

 vimeo.prototype = {

     playerId: '',

     iframeId: '',

     state: null,

     ready: false,

     listenersAdded: false,

     duration: '',

     currentTime: '',

     customFn: function(fnName, arrayOfArgs) {
         this.post(fnName, arrayOfArgs.join());
     },

     play: function() {
         this.post('play');
     },

     pause: function() {
         this.post('pause');
     },

     seek: function(timeInVideo) {
         this.post('seekTo', timeInVideo);
     },

     stop: function() {
         this.post('unload');
     },

     setVolume: function(value) {
         // This is some weird bug I reported to vimeo. More Here:
         // https://vimeo.com/forums/api/topic:278411
         var time = (value <= 0) ? 0 : value,
             actualValue = time / 100;
         this.post('setVolume', actualValue.toString());
     },

     getDuration: function() {
         return this.duration;
     },

     getCurrentTime: function() {
         var self = this;
         // TODO: Add a better solution than a setTimeout for this. Seconds matter in video.
         setTimeout(function() {
             self.post('getCurrentTime', '');
         }, 500);

         return this.currentTime;
     },

     addAllListeners: function() {
         // Don't need these yet: 'loadProgress', 'playProgress'
         var self = this,
             vEvents = ['play', 'pause', 'finish', 'seek', 'playProgress'];

         for (var i = 0; i < vEvents.length; i++) {
             this.post('addEventListener', vEvents[i]);
         }

         this.listenersAdded = true;

         document.querySelector(this.iframeId).addEventListener('vcr:getCurrentData', function(e) {
             self.currentTime = e.detail.time;
             self.duration = e.detail.duration;
         });

     },

     onMessageReceived: function(event, instance) {
         var stuff = JSON.parse(event.data),
             eEvent;

         this.state = stuff.event;
         this.ready = true;
         if (stuff.event === 'ready') {
             this.addAllListeners();
             eEvent = new CustomEvent('vcr:ready', {
                 detail: {
                     instance: instance
                 }
             });

             // setting a timeout here to make SURE the video is loaded because vimeo's API can be finicky/buggy
             setTimeout(function() {
                 document.getElementById(stuff.player_id).dispatchEvent(eEvent);
             }, 1000);

             this.listenersAdded = true;
         } else if (stuff.event === 'playProgress') {
             eEvent = new CustomEvent('vcr:getCurrentData', {
                 detail: {
                     time: stuff.data.seconds,
                     duration: stuff.data.duration
                 }
             });
             document.getElementById(stuff.player_id).dispatchEvent(eEvent);
         }
     },

     setPlayer: function(videoId, iframe_id, options) {
         var iframe = document.getElementById(iframe_id),
             self = this;
         // Set things!
         this.iframeId = '#' + iframe_id;
         this.playerId = iframe_id;

         iframe.src = this.setURL(videoId, options);

         // We only want to declare this once ever.
         if (window.addEventListener && addedListeners === false) {
             window.addEventListener('message', function(event) {
                 self.onMessageReceived.call(self, event);
             }, false);
             addedListeners = true;
         }

     },

     post: function(action, value) {
         var data = {
                 method: action
             },
             $player = document.querySelector(this.iframeId);

         if (value) {
             data.value = value.toString();
         }
         var url = $player.src,
             message = JSON.stringify(data);

         document.getElementById(this.playerId).contentWindow.postMessage(message, url);
     },

     setURL: function(videoId, options) {
         var videoUrl = 'https://player.vimeo.com/video/' + videoId + '?api=1&player_id=' + this.playerId + options;
         return videoUrl;
     }
 };

 module.exports = vimeo;

},{}],4:[function(require,module,exports){
// demo: http://jsfiddle.net/x0nvpbgs/
/* global document, YT, CustomEvent, window */
'use strict';

var youtube = function() {};

youtube.prototype = {

    player: '',

    ready: false,

    iframeId: '',

    playerId: '',

    customFn: function(fnName, arrayOfArgs){
        this.player[fnName](arrayOfArgs.join());
    },

    play: function() {
        this.player.playVideo();
    },

    pause: function() {
        this.player.pauseVideo();
    },

    seek: function(timeInVideo) {
        this.player.seekTo(timeInVideo);
    },

    stop: function() {
        this.player.stopVideo();
    },

    setVolume: function(value) {
        this.player.setVolume(value);
    },

    getCurrentTime: function() {
        return this.player.getCurrentTime();
    },

    getDuration: function(){
        return this.player.getDuration();
    },

    setPlayer: function(videoId, iframe_id, options) {
        // First we add the API
        this.addAPI();
        // Then we get the proper URL
        var url = this.setURL(videoId, iframe_id, options),
            iframe = document.querySelector('#' + iframe_id);
        iframe.src = url;
    },

    setInstance: function() {
        var self = this;
        document.addEventListener('vcr:ytReady', function(e) {
            self.player = e.detail.instance;
        });
    },

    onPlayerReady: function(event) {
        var eEvent = new CustomEvent('vcr:ready'),
            yEvent = new CustomEvent('vcr:ytReady', {
                detail: {
                    instance: event.target
                }
            });
        document.dispatchEvent(yEvent);
        document.getElementById(event.target.h.h.instance).dispatchEvent(eEvent);
    },

    // TODO: when state changes, fire event!
    onStateChange: function(t){
        var instance = document.getElementById(t.target.h.h.instance);

    },

    onReady: function(vId) {
        var self = this;
        this.player = new YT.Player(this.playerId, {
            'videoId': vId,
            'instance': this.playerId,
            events: {
                'onReady': self.onPlayerReady,
                'onStateChange': self.onStateChange
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
            document.body.insertBefore(apiScript, firstScriptTag);
        }

    },

    setURL: function(videoID, iframe_id, options) {
        var self = this,
            videoUrl;

        this.iframeId = '#' + iframe_id;
        this.playerId = iframe_id;

        document.addEventListener('vcr:ytLoaded', function() {
            self.onReady(videoID);
        });

        window.onYouTubeIframeAPIReady = function() {
            // YT only does this once, but we want to make sure we get ALL our videos loaded properly.
            var eEvent = new CustomEvent('vcr:ytLoaded');
            document.dispatchEvent(eEvent);
        };
        // NOTE: This can cause a mismatch of protocols; to be safe, you
        // should just implement HTTPS on your site because youtube will do
        // this on their embedded videos by default. Also HTTPS should be on
        // your site anyway..

        videoUrl = 'http://www.youtube.com/embed/' + videoID + '?enablejsapi=1&playerapiid=' + this.playerId + options;
        return videoUrl;
    }
};

module.exports = youtube;

},{}],5:[function(require,module,exports){
'use strict';

function stringify (query, amp) {
  return Object.keys(query).reduce(pairs, '');
  function pairs (q, key) {
    var prefix = amp !== true && q.length === 0 ? '?' : '&';
    var left = q + prefix + key;
    var value = query[key];
    if (value === true) {
      return left;
    }
    var encoded = encodeURIComponent(value);
    return left + '=' + encoded;
  }
}

module.exports = {
  stringify: stringify
};

},{}]},{},[1]);

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

     videoType: null,

     el: null,

     videoInstance: '',

     setVideoType: function() {
         if (this.parsedData !== undefined) {
             this.videoInstance = (this.parsedData.type === 'vimeo') ? new this.vimeo() : (this.parsedData.type === 'youtube') ? new this.youtube() : '';
         }

         return this.videoInstance;
     },

     player: null,

     setListeners: function() {

     },

     set: function(config, options) {
         var url, element;

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

         this.videoType = this.setVideoType();

         var type = this.videoType,
             id = this.parsedData.id;

         if (options && options.autoplay) {
             playerParams.autoplay = 1;
         }
         if (type !== '') {

             this.player = document.getElementById(this.el);
             // Initial viewport check

             this.player.addEventListener('vcr:ready', function() {
                 console.log('video ready!');
                 if (options && options.scrollStop) {
                     self.throttleVideo();
                     var throttler = self.debounce(self.throttleVideo, 250);
                     window.addEventListener('scroll', throttler);
                 }
             });
             playerParams = this.setOptions(playerParams);

             this.videoType.setPlayer(id, element, playerParams);
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
         var e = new CustomEvent('vcr:play');
         document.getElementById(this.el).dispatchEvent(e);
         this.videoType.play();
     },

     pause: function() {
         this.videoType.pause();
     },

     seek: function(duration) {
         this.videoType.seek(duration);
     },

     volume: function(value) {
         this.videoType.setVolume(value);
     },

     currentTime: function() {
         return this.videoType.getCurrentTime();
     },

     duration: function() {
         return this.videoType.getDuration();
     },

     mute: function() {
         this.volume(0);
     },

     stop: function() {
         var self = this;
         self.videoType.stop();
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
         console.log('el:', el, 'top:', rect.top, 'bottom:', rect.bottom);
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

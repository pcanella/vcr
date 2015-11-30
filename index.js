 /* global document, window */
 'use strict';

 var vcr = function(url, element, options) {
     this.set(url, element, options);
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
             this.videoInstance = (this.parsedData.type === 'vimeo') ? new this.vimeo : (this.parsedData.type === 'youtube') ? new this.youtube : '';
         }

         return this.videoInstance;
     },

     player: null,

     set: function(url, element, options) {

         var self = this,
             playerParams = (options && options.parameters) ? options.parameters : {};
         // First we'll parse the data properly, then see if it's a youtube/ vimeo/html5 video. 
         this.parsedData = this.parser.parse(url);
         this.videoType = this.setVideoType();

         this.el = element;
         this.player = document.getElementById(this.el);

         var type = this.videoType,
             id = this.parsedData.id;

         if (options.autoplay) {
             playerParams.autoplay = 1;
         }
         if (type !== '') {
             playerParams = this.setOptions(playerParams);
             console.log(playerParams);
             this.videoType.setPlayer(id, element, playerParams);
         }
         if (options.scrollStop) {
             // Initial viewport check
             this.player.addEventListener('vcr:videoReady', function() {
                 self.throttleVideo();
             });
             // Viewport check on scrolling
             var throttler = this.debounce(this.throttleVideo, 250);
             window.addEventListener('scroll', throttler);
         }

     },

     setOptions: function(params) {
         var queso = require('queso');
         return queso.stringify(params, true);
     },

     play: function() {
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
         debugger;
         if (this.withinViewport(this.el) === false) {
             this.pause();
         } else {
             this.play();
         }

     },

     debounce: function(func, wait, immediate) {
         debugger;

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

     withinViewport: function(el) {
         var element = document.getElementById(el);
         //special bonus for those using jQuery
         var rect = element.getBoundingClientRect();
         debugger;
         return (rect.top <=  window.innerHeight/2 /*|| rect.bottom >= 100*/ );
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

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

     setVideoType: function() {
         return (this.parsedData !== undefined) ? this[this.parsedData.type] : '';
     },

     player: null,

     set: function(url, element, options) {
         var playerParams = (options && options.parameters) ? this.setOptions(options.parameters) : '';
         // First we'll parse the data properly, then see if it's a youtube/ vimeo/html5 video. 
         this.parsedData = this.parser.parse(url);
         this.videoType = this.setVideoType();
         this.player = document.getElementById(element);

         var type = this.videoType,
             id = this.parsedData.id;

         if (type !== '') {
             this.videoType.setPlayer(id, element, playerParams);
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

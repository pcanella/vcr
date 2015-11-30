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
         return this.post('getDuration', '');
     },

     getCurrentTime: function() {
         var self = this;
         // TODO: Add a better solution than a setTimeout for this. Seconds matter in video.
         setTimeout(function() {
             self.post('getCurrentTime', '');
         }, 500);
     },

     addAllListeners: function() {
         // Don't need these yet: 'loadProgress', 'playProgress'
         var vEvents = ['play', 'pause', 'finish', 'seek'];

         for (var i = 0; i < vEvents.length; i++) {
             this.post('addEventListener', vEvents[i]);
         }

         this.listenersAdded = true;
     },

     onMessageReceived: function(event, instance) {
         var stuff = JSON.parse(event.data),
             eEvent;
         this.state = stuff.event;
         this.ready = true;
         if (stuff.event === 'ready') {
             this.addAllListeners();
             eEvent = new CustomEvent('vcr:ready');

             // setting a timeout here to make SURE the video is loaded because vimeo's API can be finicky/buggy
             setTimeout(function() {
                 document.getElementById(stuff.player_id).dispatchEvent(eEvent);
             }, 500);

             this.listenersAdded = true;
         }
         if (stuff && stuff.method === 'getCurrentTime') {
             eEvent = new CustomEvent('vcr:getCurrentTime', {
                 detail: {
                     time: stuff.value
                 }
             });
             document.dispatchEvent(eEvent);
         }
     },

     setPlayer: function(videoId, iframe_id, options) {
         var iframe = document.getElementById(iframe_id),
             self = this;
         // Set things!
         this.iframeId = '#' + iframe_id;
         this.playerId = iframe_id;

         iframe.style.filter = 'url("sepia.svg#sepiatone")';


         iframe.src = this.setURL(videoId, options);
         // We only want to declare this once ever.
         if (window.addEventListener && addedListeners === false) {
             window.addEventListener('message', function(event) {
                 self.onMessageReceived(event, self);
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

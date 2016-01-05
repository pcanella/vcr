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

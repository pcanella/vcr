 /* global document, CustomEvent, window */
 'use strict';

 var vimeo = {

     playerId: '',

     iframeId: '',

     state: null,

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

     stop: function(){
        this.post('unload');
     },

     setVolume: function(value) {
         this.post('setVolume', value / 100);
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
         instance.state = stuff.event;

         if (stuff.event === 'ready') {
             if (instance.listenersAdded === false) {
                 instance.addAllListeners();
             }
             eEvent = new CustomEvent('vcr:videoReady');
             document.getElementById(instance.playerId).dispatchEvent(eEvent);
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

         iframe.src = this.setURL(videoId, options);

         if (window.addEventListener) {
             window.addEventListener('message', function(event) {
                 self.onMessageReceived(event, self);
             }, false);
         }

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

     setURL: function(videoId, options) {
         var videoUrl = 'https://player.vimeo.com/video/' + videoId + '?api=1&player_id=' + this.playerId + options;
         return videoUrl;
     }
 };

 module.exports = vimeo;

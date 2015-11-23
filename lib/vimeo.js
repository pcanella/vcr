 /* global document */
 'use strict';

var vimeo = {

     playerId: '',

     iframeId: '',

     play: function() {
         this.post('play');
     },

     pause: function() {
         this.post('pause');
     },

     seek: function(timeInVideo) {
         this.post('seekTo', timeInVideo);
     },

     setVolume: function(value) {
         this.post('setVolume', value);
     },

     onMessageReceived: function(event, test){
        var data = JSON.parse(event.data);
        debugger;
        if (data.event === 'ready') {
        var eEvent = new CustomEvent('vcr:videoReady');
        document.dispatchEvent(eEvent);

        }
     },

     setPlayer: function(videoId, iframe_id, options) {
         var iframe = document.getElementById(iframe_id);
         // Set things!
         this.iframeId = '#' + iframe_id;
         this.playerId = iframe_id;

         if (window.addEventListener) {
             window.addEventListener('message',  this.onMessageReceived, false);
         }

         //this.post('addEventListener', 'ready');

         // document.querySelector(this.iframeId).addEventListener('ready', function(){
         //    debugger
         // });

         iframe.src = this.setURL(videoId, options);


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
 }

module.exports = vimeo;
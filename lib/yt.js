// demo: http://jsfiddle.net/x0nvpbgs/
/* global document, YT, CustomEvent, window */
'use strict';

var youtube = function() {};

youtube.prototype = {

    player: '',

    ready: false,

    iframeId: '',

    playerId: '',

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
            firstScriptTag.parentNode.insertBefore(apiScript, firstScriptTag);
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

        videoUrl = '//www.youtube.com/embed/' + videoID + '?enablejsapi=1&playerapiid=' + this.playerId + options;
        return videoUrl;
    }
};

module.exports = youtube;

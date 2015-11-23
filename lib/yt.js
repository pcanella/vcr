// demo: http://jsfiddle.net/x0nvpbgs/

/* global document, YT, CustomEvent, window */
'use strict';

var youtube = {

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

    setVolume: function(value) {
        if (this.player) {
            this.player.setVolume(value);
        }
    },

    setPlayer: function(videoId, iframe_id, options) {
        // First we add the API
        this.addAPI();
        // Then we get the proper URL
        var url = this.setURL(videoId, iframe_id, options),
            iframe = document.querySelector('#' + iframe_id);
        iframe.src = url;
    },

    onPlayerReady: function(event) {
        var eEvent = new CustomEvent('vcr:videoReady');

        youtube.ready = true;
        youtube.player = event.target;
        // TODO: MAKE THIS scoped!
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

    setURL: function(videoID, iframe_id, options) {
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

        // videoUrl = '//www.youtube.com/embed/' + videoID + '?&color=white&modestbranding=1enablejsapi=1&playerapiid=' + playerId + '&rel=0&wmode=opaque';

        videoUrl = '//www.youtube.com/embed/' + videoID + '?enablejsapi=1&playerapiid=' + playerId + options;

        return videoUrl;
    }
};

module.exports = youtube;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */

'use strict';
var vcr = function() {

};

vcr.prototype = {

    vimeo: require('./lib/vimeo'),

    youtube: require('./lib/yt'),

    parser: require('./lib/parser'),

    parsedData: null,

    videoType: null,

    setVideoType: function() {
        return (this.parsedData !== undefined) ? this[this.parsedData.type]: ''
    },

    set: function(url, element, options) {
        var opts = (options) ? this.setOptions(options) : '';
        // First we'll parse the data properly, then see if it's a youtube/ vimeo/html5 video. 
        this.parsedData = this.parser.parse(url);
        this.videoType = this.setVideoType();

        var type = this.videoType,
            id = this.parsedData.id;

        if (type !== '') {
            this.videoType.setPlayer(id, element, opts);
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
    }
};

window.vcr = vcr;


module.exports = vcr;

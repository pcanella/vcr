'use strict';
var queso = require('queso'),
ytParams = [
'autohide',
'autoplay',
'cc_load_policy',
'color',
'controls',
'disablekb',
'enablejsapi',
'end',
'fs',
'h1',
'iv_load_policy',
'list',
'listType',
'loop',
'modestbranding',
'origin',
'playerapiid',
'playsinline',
'rel',
'showinfo',
'start',
'theme' ],
vimParams = ['autoplay',
'autopause',
'badge',
'byline',
'color',
'loop',
'player_id',
'portrait',
'title'];

var parser = {

    parse: function(url) {
        var type = null;

        this.parsePlainUrl(url);

        if (RegExp && RegExp.$3 && RegExp.$3.indexOf('youtu') > -1) {
            type = 'youtube';
        } else if (RegExp && RegExp.$3 && RegExp.$3.indexOf('vimeo') > -1) {
            type = 'vimeo';
        }

        return {
            type: type || '',
            id: RegExp.$6 || ''
        };

    },

    isValidUrl: function(url) {
        var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        if (regex.test(url)) {
            return true;
        } else {
            return false;
        }
    },

    parsePlainUrl: function(url) {
        if (this.isValidUrl(url)) {
            return (url) ? url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/) : '';
        } else {
            return false;
            console.log('url is not valid');
        }
    }

};

module.exports = parser;
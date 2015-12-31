# Javascript API

# VCR Constructor

```javascript
// Constructor Basic example
var vcr = new vcr(config, options);
```
***

### Config

Type: Object or String (id selector)
* 
A String containing **only** iframe ID can be used if the embed `<iframe>` already exists. 

Otherwise, a config object is used with the following parameters:


* 
`el` (String) - The selector (ID only) of the iframe. No # beforehand (i.e. getElementById)

    **Required:** if the iframe already exists. 
    
    **Optional:** if user is injecting/instantiating a new iframe.

    *NOTE: If injecting and left blank, an ID will be created for you.* 
    

* `url` (String) - The URL of the youtube or vimeo video. 

    **Optional:** if the iframe already exists.
    
    **Required:** if user is injecting/instantiating a new iframe.

* `insertBefore, insertAfter, appendTo, prependTo` (String [Selector]) - These are all individual properties, but you will only need one.

    **Optional (but strongly recommended)**: If you are instantiating a new iframe from scratch, and you wish to append to a selector or element. 
    
    *Note: (must have # or . if an ID or class)*
    
*  `width` (Integer) - The width of the video. Will be a `width` attribute set inside the HTML of the iframe code.
*  `height` (Integer) - The height of the video. Will be a `width` attribute set inside the HTML of the iframe code.
    
***
### Options

Options are any player URL parameter supplied by YouTube and Vimeo's embed APIs. It is a JS object that looks like the full example below. 

####Parameters:
* [YouTube URL Parameters](https://developers.google.com/youtube/player_parameters?hl=en#Parameters)
* [Vimeo URL Parameters](https://developer.vimeo.com/player/embedding#universal-parameters)

####Other Options:
*More coming soon!*

* `scrollStop`: This option allows you to get that Facebook or Twitter effect where the video pauses/plays depending on if the majority of the video is in the viewport.
 
*Note: This is still experimental and may need some tweaks on VCR's end! Pull requests appreciated!*

```javascript
// Full example
var options = {
    parameters:{
        'autoplay':1,
        'rel': 1
    }
};

var config = {
    'el': 'selector', // Name of selector; current or new
    'url': 'url of yt/vimeo vimeo',
    'insertBefore': '.selectorName'
};

var example = new vcr(config, options);
```

*Note: Once you instantiate successfully, the video will load via iframe from youtube or vimeo. After that a vcr:ready event will be fired when the video is fully loaded and ready to accept commands.*

***
### Player Properties

The VCR API has several available properties you can use to make your code easier to manage, here are the properties available:


* **el**: the initial element selector string ( ex: "videoPlayer" as an ID). NOT the instance of the video player itself (which is vcr.player)
* **player:** the instance of the vcr player's iframe. Used for event listeners on the VCR object. Example: `vcr.player.addEventListener`
* **videoData:** Instance data for video. Response data depends on whether it is YouTube or Vimeo.




```javascript
var vcr = new vcr(config, options);

```



#API functionality

Note: For all examples we are going to assume this is the iframe being used (assuming it's already appended to the DOM):

```html
<iframe id="testPlayer" width="560" height="315"
src="https://www.youtube.com/embed/bwS0d-lAWUA" 
frameborder="0" allowfullscreen></iframe>

```

Also our VCR object is instantiated like so:
```javascript
var video = new vcr('testPlayer');
```



## play()

No arguments; simply plays the video after video is ready. 

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.play();
});
```

## pause()

Again, no arguments, just pause after the video is ready

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.pause();
});
```

## stop()
Completely stops the video; sets it back 0:00 and pauses.

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.stop();
});
```

##seek(number)

Move the video forward or backward.

arguments:
*  `number` (Integer) - The amount of seconds you'd like to move the video forward. 


```javascript
video.player.addEventListener('vcr:ready', function(){
    video.seek(157); // moves the player to the 157th second
});
```
**Note: ** *In the future, this will allow both seconds and time notation (such as '1:45'). *


##volume(level)

arguments:
*  `level` (Integer) - The level of volume that should be reflected in the video. 

*The volume levels go from 0 (muted) to 100 (maximum) and are normalized amongst Vimeo/YouTube's APIs. *


**Note: ** *This will change the user's volume in EVERY YouTube or Vimeo video, not just the current instance. This is part of YouTube and Vimeo's settings in their respective APIs. Why? I have no idea...*

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.volume(50);
});
```

##mute()
Mutes the video. Equivalent to setting volume() to 0.

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.mute(); // mutes the video/sets the volume to 0
});
```


##currentTime()

Returns the current time of the video. 

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.currentTime(); // returns 48.4 or similar
});
```

**Note: ** *In the future, this will allow both seconds and time notation (such as '1:45'). *


##duration()

Returns the duration of the video in seconds as a whole.

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.duration(); // returns 100.5 or similar
});
```

**Note: ** *In the future, this will allow both seconds and time notation (such as '14:45'). *

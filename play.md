#Base functionality

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

##duration()

Returns the duration of the video in seconds as a whole.

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.duration(); // returns 100.5 or similar
});
```

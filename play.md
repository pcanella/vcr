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

##volume(level)

arguments:
*  `level` (Integer) - The level of volume that should be reflected in the video. 

**Note: ** This will change the user's volume in EVERY YouTube or Vimeo video, not just the current instance. This is part of YouTube and Vimeo's settings in their respective APIs. Why? I have no idea...

```javascript
video.player.addEventListener('vcr:ready', function(){
    video.volume(50);
});
```
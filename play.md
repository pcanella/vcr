# play()

No arguments; simply plays the video after video is ready. 

```html
<iframe id="testPlayer" width="560" height="315"
src="https://www.youtube.com/embed/bwS0d-lAWUA" 
frameborder="0" allowfullscreen></iframe>

```

```javascript
var video = new vcr('testPlayer');

video.player.addEventListener('vcr:ready', function(){
    video.play();
});
```
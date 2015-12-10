# Getting Started

First things first, you'll definitely need to download the VCR Javascript file. It's important to note here that this is pure Javascript, NOT jQuery (a jQuery plugin is forthcoming). 

Head on over to the [resources folder of the Github project](https://github.com/pcanella/vcr/tree/master/resources) and choose either the minified (recommended) version or the unminified. Then, include it into your page either using your favorite JS bundler (if using Node) or include it directly into your page:

```html
<script type="text/javascript" src="vcr.min.js"></script>
```


# Basic Examples

For basic examples that actually produce video output, [check out the main VCR page](http://pcanella.github.io/vcr/demo). For our purposes here, we'll just provide the code for a couple of base use cases.

## Case 1: Basic YouTube Embed API with <iframe>

If we want to just grab an embed iframe from YouTube, simply go to YouTube, grab your favorite video embed ([not sure how?](https://support.google.com/youtube/answer/171780?hl=en)) and paste it into your document. 

```html
<iframe id="vcrPlayer" width="560" height="315"
src="https://www.youtube.com/embed/IyuUWOnS9BY"
frameborder="0" allowfullscreen></iframe>
```

Then, using the power of your new VCR library, add an ID to your iframe (I've already done it above) and instantiate a new VCR object like so:

```
var vcr = new vcr('vcrPlayer');

// Then, let's play the video!
vcr.player.addEventListener('vcr:ready', function(){
    vcr.play();
});


```

and there! That's the really simple example. 


#I am too lazy to get the embed code, or don't want to embed an iframe myself, is there another way?

There SURE IS! With VCR, you can do something like 

```javascript
var vcr = new vcr({
// if you leave el blank, we generate an ID for you!
    'el': 'customId', 
    'url': 'https://www.youtube.com/watch?v=OQBMQ_2x8Pc',
    'appendTo': '.whateverDiv'
})

```


##Wait a second, what about YouTube's URL parameters?




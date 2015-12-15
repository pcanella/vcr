# Getting Started

First things first, you'll definitely need to download the VCR Javascript file. It's important to note here that this is pure Javascript, NOT jQuery (a jQuery plugin is forthcoming). 

Head on over to the [resources folder of the Github project](https://github.com/pcanella/vcr/tree/master/resources) and choose either the minified (recommended) version or the unminified. Then, include it into your page either using your favorite JS bundler (if using Node) or include it directly into your page:

```html
<script type="text/javascript" src="vcr.min.js"></script>
```


# Basic Examples

For basic examples that actually produce video output, [check out the main VCR page](http://pcanella.github.io/vcr/demo). For our purposes here, we'll just provide the code for a couple of base use cases.

## Case 1: Basic YouTube Embed API with `<iframe>`

If we want to just grab an embed iframe from YouTube, simply go to YouTube, grab your favorite video embed ([not sure how?](https://support.google.com/youtube/answer/171780?hl=en)) and paste it into your document. 

```html
<iframe id="vcrPlayer" width="560" height="315"
src="https://www.youtube.com/embed/IyuUWOnS9BY"
frameborder="0" allowfullscreen></iframe>
```

Then, using the power of your new VCR library, add an ID to your iframe (I've already done it above) and instantiate a new VCR object like so:

```javascript
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
    'appendTo': '.whateverSelectorYouWant'
})

```

and it will append to your desired selector. There are also `prependTo` `insertBefore` and `insertAfter` properties. 

Note: This will work with vimeo and youtube URLs only.


##Wait a second, I want autoplay, can't I enable that with YouTube/Vimeo's URL parameters?

Glad you asked! Of course you can. VCR accepts two objects, a config object and an options object. In order words:
```javascript
// first object is configs: el, url and append/prepend functions 
// (check the docs for more information)

// The second is options; feel free to put your URL parameters here!
var vcr = new vcr({el:'testPlayer'}, {parameters:{'autoplay': 1, rel:1}});
```

*For reference:*
* [YouTube URL Parameters](https://developers.google.com/youtube/player_parameters?hl=en#Parameters)
* [Vimeo URL Parameters](https://developer.vimeo.com/player/embedding#universal-parameters)
* Complete list of valid config and options properties


**NOTE:** When instantiating a VCR instance, we will automatically add the correct url parameter to enable the proper JS API and add it to your site as necessary.


**Need more? Check out our full API.**

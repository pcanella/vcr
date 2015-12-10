# VCR Constructor

```
// Constructor
new vcr(config, options);
```


### Config

Type: Object or String (id selector)
* 
A String containing **only** iframe ID can be used if the embed `<iframe>` already exists. 

*
Otherwise, a config object is used with the following parameters:


* 
`el` - The selector (ID only) of the iframe.

    **Required:** if the iframe already exists. 
    
    **Optional:** if user is injecting/instantiating a new iframe.

    *NOTE: If injecting and left blank, an ID will be created for you.* 
    

* `url` - The URL of the youtube or vimeo video. 

    **Optional:** if the iframe already exists.
    
    **Required:** if user is injecting/instantiating a new iframe.


```
var config = {
    'el': 'selector' // Name of selector; current or new
    'url': 'url of yt/vimeo vimeo'
    '

}
```

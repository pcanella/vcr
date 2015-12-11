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

```
// Full example
var options = {
    'autoplay':1,
    'rel': 1
};

var config = {
    'el': 'selector', // Name of selector; current or new
    'url': 'url of yt/vimeo vimeo',
    'insertBefore': '.selectorName'
};

var example = new vcr(config, options);
```

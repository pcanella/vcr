 var plainBtn = document.querySelector('.btn'),
     injectBtn = document.querySelector('.injectBtn'),
     plainReady = false,
     injectReady = false,
     plainYoutube = new vcr({
         el: 'plainYoutube'
     }),
     injectEmbed = new vcr({
         //el: '' // el is optional, we'll generate one
         url: 'https://vimeo.com/60821380',
         appendTo: '.embed_here',
         width: '560',
         height: '315'
     });


 injectEmbed.player.addEventListener('vcr:ready', function() {
     injectReady = true;
 });

 injectBtn.addEventListener('click', function() {
     if (injectReady === true) {
         injectEmbed.play();
         // pause after ~5 seconds
         setTimeout(function() {
            injectEmbed.pause();
         }, 6000);
     }
 });


 plainYoutube.player.addEventListener('vcr:ready', function() {
     plainReady = true;
 });

 plainBtn.addEventListener('click', function() {
     if (plainReady === true) {
        plainYoutube.play();
     }
 });

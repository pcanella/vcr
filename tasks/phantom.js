var page = require('webpage').create();

page.open('http://0.0.0.0:8282/', function(status) {
    if (status === "success") {
        console.log('running phantomJS successfully...');

        page.onConsoleMessage = function(msg, lineNum, sourceId) {
            console.log(msg, 'test!');

            setTimeout(function() {
                phantom.exit();
            }, 3000);

        }
    }

});

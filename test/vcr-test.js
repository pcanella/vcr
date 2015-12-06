'use strict';

var test = require('tape');
var vcr = require('../index');

test('timing test', function(t) {
    t.plan(1);


    var p = document.createElement('iframe');
    p.src = 'http://google.com/';

    t.equal(p.src, 'http://google.com/');
    t.end();
});


test('add a vimeo video and append it to the "test" class div. Also, play it!', function(t) {
    t.plan(2);

    var div = document.createElement('div');
    div.classList.add('test');
    document.body.appendChild(div);


    var tv = new vcr({
        el: 'testPlayer',
        url: 'https://vimeo.com/8273634',
        appendTo: '.test'
    });

    tv.player.addEventListener('vcr:ready', function() {
        window.addEventListener('message', function(event) {
            var p = JSON.parse(event.data);
            // console.log('--------------');
            // console.log(p);
            // console.log('--------------');
            if (p.event === 'play') {

                t.equal(p.player_id, 'testPlayerxczxczz');
                t.end()
            }
        });
        tv.play();
    });


    t.equal(div.childNodes[0], document.querySelector('#testPlayer'));
});


test('add a youtube video and append it to the "test2" class div. Then play it!', function(t) {
    t.plan(1);

    var div = document.createElement('div');
    div.classList.add('test2');
    document.body.appendChild(div);


    var tv = new vcr({
        el: 'testPlayer2',
        url: 'https://www.youtube.com/watch?v=oL9zfU4U1Fc',
        appendTo: '.test2'
    });

    t.equal(div.childNodes[0], document.querySelector('#testPlayer2'));
    t.end();
});

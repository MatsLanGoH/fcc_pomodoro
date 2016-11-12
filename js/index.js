// TODO: Need to include a check what happens when the timer runs out.
// How to update view when controller var gets to zero?

$(document).ready(function($) {
    let lengthSession = 25;
    let lengthBreak = 5;
    let finishedSession = false;
    let t = new CountDownTimer(lengthSession);


    $('.breakTimer').html(lengthBreak);
    $('.sessionTimer').html(lengthSession);

    // TODO: The below needs to be refactored desperately.
    // DRY up this code.
    // Decrease Break Length
    $('#decreaseBreakButton').click(function(event) {
        if (lengthBreak > 0) {
            lengthBreak -= 1;
        }
        $('.breakTimer').html(lengthBreak);
    });

    // Increase Break Length
    $('#increaseBreakButton').click(function(event) {
        if (lengthBreak < lengthSession) {
            lengthBreak += 1;
        }
        $('.breakTimer').html(lengthBreak);
    });

    // Decrease Session Length
    $('#decreaseSessionButton').click(function(event) {
        if (lengthSession > 0) {
            lengthSession -= 1;
        }
        $('.sessionTimer').html(lengthSession);
    });

    // Increase Session Length
    $('#increaseSessionButton').click(function(event) {
        if (lengthSession < 60) {
            lengthSession += 1;
        }
        $('.sessionTimer').html(lengthSession);
    });


    // Start timer
    $('.clock').click(function(event) {

        if (!t.running) {
            $('body').removeClass('green-screen');
            $(this).removeClass('blue-pattern');
            $('.clockTimeDisplay').html('<p>Clicked</p>');
            // Get duration from setting button
            // TODO: Implement setter/getters.
            t.duration = (finishedSession ? lengthBreak : lengthSession) * 60;
            t.start();
            finishedSession = !finishedSession;

            // Set color according to state.
            $(this).addClass('green-pattern');
        } else {
            $('.clockTimeDisplay').html('<p>Paused</p>');

            // Remove colors from clock.
            $(this).addClass('red-pattern');
            $(this).children().removeClass('animated pulse pulse-timing');

            t.toggle();
        }
        if (!t.paused) {
            $(this).removeClass('red-pattern');

        }
    });

    // Reset timer
    // TODO: This doesn't work correctly yet.
    //       Timer seems to keep going, or multiple timers are going.
    $('.btn--reset').click(function(event) {
        if (t.paused) {
            finishedSession = !finishedSession;
            t.duration = finishedSession ? lengthBreak : lengthSession;
            $('.clock').removeClass('red-pattern');

        };
        if (t.running) {
            $('.clock').removeClass('red-pattern');
            $('.clockTimeDisplay').html('<p>Reset</p>');
            // t.duration = finishedSession ? lengthBreak : lengthSession;
            t.reset();
        };
    });
});

//
// CountDownTimer function
//
function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
    this.paused = false;
    this.timeoutID;
    this.diff;
}

CountDownTimer.prototype.start = function() {
    if (this.running) {
        // TODO: Is this check still needed here?
    }
    this.running = true;
    var start = Date.now(),
        that = this,
        obj;

    (function timer() {
        diff = that.duration - (((Date.now() - start) / 1000) | 0);

        if (diff > 0) {
            timeoutID = window.setTimeout(timer, that.granularity);
        } else {
            diff = 0;
            that.finished = true;
            that.running = false;
            // Audio file downloaded from
            // http://soundbible.com/1252-Bleep.html
            let alarmSound = new Audio("../audio/bleep.mp3");

            alarmSound.play();
            $('.clockTimeDisplay').html('<p>0:00</p>')
                                .removeClass('animated pulse pulse-timing');
            $('.clock').addClass('blue-pattern');

            $('body').addClass('green-screen');
            return false;
        }

        obj = CountDownTimer.parse(diff);
        let secondString = obj.seconds > 9 ? obj.seconds : '0' + obj.seconds;
        $('.clockTimeDisplay').addClass('animated pulse pulse-timing')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $('.clockTimeDisplay').removeClass('animated pulse pulse-timing');
            });
        $('.clockTimeDisplay').html('<p>' + obj.minutes + ':' + secondString + '</p>');
        that.tickFtns.forEach(function(ftn) {
            ftn.call(this, obj.minutes, obj.seconds);
        }, that);
    }());
};

CountDownTimer.prototype.onTick = function(ftn) {
    if (typeof ftn === 'function') {
        this.tickFtns.push(ftn);
    }
    return this;
};

CountDownTimer.prototype.expired = function() {
    return !this.running;
};

CountDownTimer.parse = function(seconds) {
    return {
        'minutes': (seconds / 60) | 0,
        'seconds': (seconds % 60) | 0
    };
};

CountDownTimer.prototype.reset = function() {
    // Reset pause state to prevent multiple timers from spawning.
    if (this.paused) {
        this.paused = !this.paused;
    }
    window.clearTimeout(timeoutID);
    this.start();
}

CountDownTimer.prototype.toggle = function() {
    if (this.paused) {
        this.duration = diff;
        this.start();
    } else {
        window.clearTimeout(timeoutID);
    }
    this.paused = !this.paused;
    return;
}

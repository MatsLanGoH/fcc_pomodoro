// TODO: Need to include a check what happens when the timer runs out.
// How to update view when controller var gets to zero?

$(document).ready(function($) {
    let lengthSession = 1500;
    let lengthBreak = 300;
    let finishedSession = false;
    let t = new CountDownTimer(lengthSession);


    $('.breakTimer').html(parseSecondsToString(lengthBreak));
    $('.sessionTimer').html(parseSecondsToString(lengthSession));

    // TODO: The below needs to be refactored desperately.
    // DRY up this code.
    // Decrease Break Length
    $('#decreaseBreakButton').click(function() {
        if (lengthBreak > 60) {
            lengthBreak -= 1 * 60;
        }
        $('.breakTimer').html(parseSecondsToString(lengthBreak));
    });

    // Increase Break Length
    $('#increaseBreakButton').click(function() {
        if (lengthBreak < lengthSession) {
            lengthBreak += 1 * 60;
        }
        $('.breakTimer').html(parseSecondsToString(lengthBreak));
    });

    // Decrease Session Length
    $('#decreaseSessionButton').click(function() {
        if (lengthSession > 60) {
            lengthSession -= 1 * 60;
        }
        $('.sessionTimer').html(parseSecondsToString(lengthSession));
    });

    // Increase Session Length
    $('#increaseSessionButton').click(function() {
        if (lengthSession < 3600) {
            lengthSession += 1 * 60;
        }
        $('.sessionTimer').html(parseSecondsToString(lengthSession));
    });


    // Start timer
    $('.clock').click(function(event) {

        if (!t.running) {
            $('body').removeClass('green-screen');
            $(this).removeClass('blue-pattern');
            // Get duration from setting button
            // TODO: Implement setter/getters.
            t.duration = finishedSession ? lengthBreak : lengthSession;
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

    /*
     * Reset timer
     */
    $('.btn--reset').click(function(event) {
        // Unpause clock
        if (t.paused) {
            t.paused = !t.paused;
        };

        // Reset clock state and color
        t.reset();
        $('.clock').removeClass('red-pattern');

        // Resets colors if clock has run around.
        // TODO: Should probably disable reset button instead.
        if (!t.running) {
          $('.clock').removeClass('blue-pattern');
          $('body').removeClass('green-screen');
        }
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


/*
* Parse time for output
*/
function parseSecondsToString(seconds) {
  var timeString  = '',
      minuteCount     = Math.floor(seconds / 60),
      secondCount     = seconds % 60;

  secondCount = secondCount > 9 ? secondCount : '0' + secondCount;
  timeString = minuteCount + ':' + secondCount;

  return timeString;
}

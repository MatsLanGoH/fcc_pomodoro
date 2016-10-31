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
        /* Act on the event */

        // $('.clock').removeClass('green-pattern');
        // $('.clock').addClass('green-pattern');

        if (!t.running) {
            $('.clockTimeDisplay').html('<p>Clicked</p>');
            // Get duration from setting button
            // TODO: Implement setter/getters.
            t.duration = finishedSession ? lengthBreak : lengthSession;
            t.start();
            finishedSession = !finishedSession;

            // Set color according to state.
            $('.clock').addClass('green-pattern');
        } else {
            $('.clockTimeDisplay').html('<p>Paused</p>');
            // Remove colors from clock.
            $('.clock').addClass('red-pattern');

            // $('.clock').removeClass('green-pattern red-pattern');
            // t.start();
            t.toggle();
        }

        if (!t.paused) {
          $('.clock').removeClass('red-pattern');

        }
    });

    // Reset timer
    // TODO: This doesn't work correctly yet.
    //       Timer seems to keep going, or multiple timers are going.
    $('#resetButton').click(function (event) {
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
            // console.log(diff);
        } else {
            diff = 0;
            that.finished = true;
            // $('.clockTimeDisplay').html('<p>Click to start timer</p>');
            that.running = false;
        }

        obj = CountDownTimer.parse(diff);
        // console.log(obj);
        // console.log(obj.minutes);
        let secondString = obj.seconds > 9 ? obj.seconds : '0' + obj.seconds;
        // $('.clockTimeDisplay').html('<p>Clicked</p><p> Time remaining</p><p>' + obj.minutes + ':' + secondString + '</p>');
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
    window.clearTimeout(timeoutID);
    this.start();
}

CountDownTimer.prototype.toggle = function() {
    if (this.paused) {
        // console.log(timeoutID, 'Restarting');
        this.duration = diff;
        this.start();
    } else {
        // console.log(timeoutID, this.duration, diff, 'Paused');
        window.clearTimeout(timeoutID);
    }
    this.paused = !this.paused;
    return;
}

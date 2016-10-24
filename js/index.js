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

        if (!t.running) {
            $('.clockTimeDisplay').html('<p>Clicked</p>');
            // Get duration from setting button
            // TODO: Implement setter/getters.
            t.duration = finishedSession ? lengthBreak : lengthSession;
            t.start();
            finishedSession = !finishedSession;
        } else {
            $('.clockTimeDisplay').html('<p>Don\'t stop me now!');
            t.start();
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
    this.timeoutID;
}

CountDownTimer.prototype.start = function() {
    if (this.running) {
        // TODO: Implement pause function.
        console.log(timeoutID, 'Stopped');
        window.clearTimeout(timeoutID);
        this.running = false;
        return;
    }
    this.running = true;
    let start = Date.now(),
        that = this,
        diff, obj;

    (function timer() {
        diff = that.duration - (((Date.now() - start) / 1000) | 0);

        if (diff > 0) {
            timeoutID = window.setTimeout(timer, that.granularity);
            // console.log(timeoutID);
        } else {
            diff = 0;
            // $('.clockTimeDisplay').html('<p>Click to start timer</p>');
            that.running = false;
        }

        obj = CountDownTimer.parse(diff);

        // console.log(obj.minutes);
        let secondString = obj.seconds > 9 ? obj.seconds : '0' + obj.seconds;
        $('.clockTimeDisplay').html('<p>Clicked</p><p> Time remaining</p><p>' + obj.minutes + ':' + secondString + '</p>');

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

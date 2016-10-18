$(document).ready(function($) {
    let lengthBreak = 5;
    let lengthSession = 25;

    $('.breakTimer').html(lengthBreak);
    $('.sessionTimer').html(lengthSession);

    // TODO: The below needs to be refactored desperately.
    // DRY up this code.

    // Decrease Break Length
    $('#decreaseBreakButton').click(function(event) {
        if (lengthBreak > 0) {
            lengthBreak -= 1;
        };
        $('.breakTimer').html(lengthBreak);
    });

    // Increase Break Length
    $('#increaseBreakButton').click(function(event) {
        if (lengthBreak < lengthSession) {
            lengthBreak += 1;
        };
        $('.breakTimer').html(lengthBreak);
    });

    // Decrease Session Length
    $('#decreaseSessionButton').click(function(event) {
        if (lengthSession > 0) {
            lengthSession -= 1;
        };
        $('.sessionTimer').html(lengthSession);
    });

    // Increase Session Length
    $('#decreaseBreakButton').click(function(event) {
        if (lengthSession < 60) {
            lengthSession += 1;
        };
        $('.sessionTimer').html(lengthSession);
    });


    // Start timer
    $('.clock').click(function(event) {
        /* Act on the event */
        $('.clockTimeDisplay').html('<p>Clicked</p>');

        // Get duration from setting button
        let t = new CountDownTimer(lengthSession);
        t.start();
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
}

CountDownTimer.prototype.start = function() {
    if (this.running) {
        return;
    }
    this.running = true;
    let start = Date.now(),
        that = this,
        diff, obj;

    (function timer() {
        diff = that.duration - (((Date.now() - start) / 1000) | 0);

        if (diff > 0) {
            console.log(diff);
            $('.clockTimeDisplay').html('<p>Clicked</p><p>' + diff + ' seconds remaining.</p>');
            setTimeout(timer, that.granularity);
        } else {
            diff = 0;
            $('.clockTimeDisplay').html('<p>Click to start timer</p>');
            that.running = false;
        }

        obj = CountDownTimer.parse(diff);
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

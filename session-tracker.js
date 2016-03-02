/**
 * Created by Patrick Falize on 12-2-2016.
 */

(function ( $ ) {

    $.fn.sessionTracker = function(callback, duration, alertDuration, intervalScreensaver, updater, updateUrl, removeUrl, session_id, token, mode) {

        var orginalDuration = duration;

        if(mode == true){ var interval = intervalScreensaver; } else { var interval = 1000; }

        var destroySession = false;

         function toHHMMSS(duration) {
            var sec_num = parseInt(duration, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
             if(hours == 0){
                 var time    = minutes+':'+seconds;
             }else{
                 var time    = hours+':'+minutes+':'+seconds;
             }

            return time;
        }

        // Get reference to container, and set initial content
        var container = $(this[0]).html(toHHMMSS(duration));
        // Get reference to the interval doing the countdown
        var countdown = setInterval(function () {
            if(mode == true){
                var formData = new FormData();
                formData.append('_token', token);

                $.ajax({
                    url: updateUrl,
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function(data){
                        console.log('Session has been renewed!');
                    }
                });
            }else{
                if(alertDuration >= duration){
                    $('.alert-timeout-back').fadeIn( "slow" );
                    $('.alert-timeout').fadeIn( "fast" );
                }else{
                    $('.alert-timeout-back').fadeOut( "fast" );
                    $('.alert-timeout').fadeOut( "slow" );
                }

                // If seconds remain
                if (--duration) {
                    // Update our container's message
                    container.html(toHHMMSS(duration));
                    $(".expireNumber").html(toHHMMSS(duration));
                    // Otherwise
                } else {
                    // Clear the countdown interval
                    clearInterval(countdown);

                    var formData = new FormData();
                    formData.append('_token', token);
                    formData.append('type', "screensaver");

                    $.ajax({
                        url: removeUrl,
                        data: formData,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function(data){
                            console.log('Start new session!');
                            window.location.href = data;
                        }
                    });
                }
            }
        }, interval);

        if(updater == true){
            $('html').bind("mousemove touchmove", function(e){

                if(mode == true){

                    if(destroySession == false){
                        destroySession = true;
                        var formData = new FormData();
                        formData.append('_token', token);
                        formData.append('type', "shop");

                        $.ajax({
                            url: removeUrl,
                            data: formData,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            success: function(data){
                                console.log('Start new session!');
                                window.location.href = data;
                            }
                        });
                    }

                }else{
                    var updateSession = false;

                    if(duration < (orginalDuration - 20)) {
                        updateSession = true;
                    }

                    if(updateSession == true){

                        duration = orginalDuration;

                        var formData = new FormData();
                        formData.append('_token', token);

                        $.ajax({
                            url: updateUrl,
                            data: formData,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            success: function(data){
                                console.log('Session has been renewed!');
                            }
                        });
                    }
                }

            });
        }

    };

}( jQuery ));
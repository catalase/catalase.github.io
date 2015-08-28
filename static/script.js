$(function (){
    "use strict";

    var expiry = new Date(
        2017,
        2,
        28
    );

    function now() {
        return new Date;
    }

    var _stringRepeat = window.String.prototype.repeat

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
    // String.prototype.repeat 는 ECMAScript 2015 에 추가된 기능이며 experimental 상태이다.
    function stringRepeat(str, n) {
        if ( _stringRepeat !== undefined ) {
            return _stringRepeat.call( str, n );
        }

        var repeated = new String();

        for ( var i = 0; i < n; i++ ) {
            repeated += str
        }

        return repeated;
    }

    function zfill(str, x, n) {
        if ( x.length != 1 ) {
            throw "expected that x.length is 1, got " + x.length
        }

        if ( str.length < n ) {
            return stringRepeat(x, n - str.length) + str;
        }

        return str;
    }

    setTimeout(function() {
        var $stage = $( ".stage" ),
            $stagew = $( ".stage-wrapper" ),
            $retina;

        var duration = 1000;

        var reserved;

        function done() {
            $( '<div class="stage-message">' )
                .text( "군생활을 마쳤습니다." )
                .appendTo( $stage );
        }

        function timegoes() {
            var duration = moment.duration(expiry - now());

            if ( duration > 0 ) {
                var text = "";

                if ( duration.years() > 0 ) {
                    text += duration.years() + "년 ";
                }

                if ( duration.months() > 0 ) {
                    text += duration.months() + "월 ";
                }

                if ( duration.days() > 0 ) {
                    text += duration.days() + "일 ";
                }

                if ( duration.hours() > 0 ) {
                    text += duration.hours() + "시 ";
                }

                if ( duration.minutes() > 0 ) {
                    text += zfill( duration.minutes().toString(), "0", 2 ) + "분 ";
                }

                if ( duration.seconds() > 0) {
                    text += zfill( duration.seconds().toString(), "0", 2 ) + "초 ";
                }

                if ( duration.milliseconds() > 0 ) {
                    text += ".";
                    text += zfill( duration.milliseconds().toString(), "0", 3);
                }

                $retina.text( text );
            } else {
                clearInterval( reserved );
                $stage.empty();
                done();
            }
        }

        $( '<div class="stage-message">')
            .text( "전역까지" )
            .appendTo( $stage );

        $retina = $( '<div class="stage-retina">' ).appendTo( $stage );

        $( '<div class="stage-message">' )
            .text( "남았습니다." )
            .appendTo( $stage );

        timegoes();
        reserved = setInterval( timegoes, 1 );

        var height = $stage.height();

        $stagew.css({
            height: 20
        }).animate({
            height: "+=" + height
        }, duration);

        $stage.css({
            display: "block",
            height: 0
        }).animate({
            height: height
        }, duration);

    }, 5000);

    $( "a" ).each(function( index, el ) {
        if ( typeof $( el ).attr( "target" ) == "undefined" ) {
            $( el ).attr( "target", "_blank" );
        }
    });
});

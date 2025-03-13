$(document).ready(function () {
    var envelope = $('#envelope');
    var btn_open = $("#open");
    var btn_reset = $("#reset");
    var genderSwitch = $("#genderSwitch");

    var audio = new Audio('fairy.mp3');
    audio.volume = 0.5;



    envelope.click(function () {
        open();
    });
    btn_open.click(function () {
        open();
    });
    btn_reset.click(function () {
        close();
    });

    genderSwitch.change(function () {
        if (this.checked) {
            $('body').removeClass('girl').addClass('boy');
        } else {
            $('body').removeClass('boy').addClass('girl');
        }
    });

    function open() {
        envelope.addClass("open").removeClass("close");
        audio.play();
        setTimeout(function () {
            audio.pause();
            audio.currentTime = 0;
        }, 13000);


    }

    function close() {
        envelope.addClass("close").removeClass("open");
        audio.pause();
        audio.currentTime = 0;
    }
});
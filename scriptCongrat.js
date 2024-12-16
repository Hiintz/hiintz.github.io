$(document).ready(function () {
    var envelope = $('#envelope');
    var btn_open = $("#open");
    var btn_reset = $("#reset");
    var genderSwitch = $("#genderSwitch");

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
    }

    function close() {
        envelope.addClass("close").removeClass("open");
    }
});
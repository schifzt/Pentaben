const line_color = [219, 17, 17, 0.3];
var ws;
var canvas, ctx;
var canvas_offset = {
    x: 0,
    y: 0
};
var prev_point = {
    x: 0,
    y: 0
};
var isSelected = false;
var isDrag = false;

/*
 * todo
 * dragStart-->event.targetで統合
 */

function initWebSocket() {
    ws = new WebSocket("ws://192.168.100.100:8000/websocket");
    ws.onmessage = function(e) {
        console.log(e.data);
    };
    ws.onopen = function() {
        ws.send("establish connection");
    };
}

function resizeCanvas() {
    if (canvas.width == 270) {
        canvas.width = 900;
        canvas.height = ~~(900 * 1080 / 1920);
    } else {
        canvas.width = 270;
        canvas.height = 270;
    }
    calCanvasOffset();
}

function initCanvas() {
    console.log("init canvas");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    calCanvasOffset();

    document.removeEventListener("touchmove", function() {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, false);

    window.addEventListener("scroll", calCanvasOffset);
    canvas.addEventListener("touchmove", draw, true);
    canvas.addEventListener("touchstart", drawStart, true);
    canvas.addEventListener("touchend", drawEnd, true);
    $("#canvas").hammer().on("tap", function(e) {
        var x = e.gesture.center.x;
        var y = e.gesture.center.y;
        sendMessage(0, 0, 1, "l");
        prev_point.x = x;
        prev_point.x = x;
    });
    $("#canvas").hammer().on("doubletap", function(e) {
        var x = e.gesture.center.x;
        var y = e.gesture.center.y;
        sendMessage(0, 0, 1, "r");
        prev_point.x = x;
        prev_point.x = x;
    });
    $("#canvas").hammer().on("press", dragStart);


    // ----------------------------------------------------------------

    // var hammer = new Hammer(document.getElementById("canvas"), {});
    // var singleTap = new Hammer.Tap({
    //     event: "singletap"
    // });
    // var doubleTap = new Hammer.Tap({
    //     event: "doubletap",
    //     taps: 2
    // });
    // var tripleTap = new Hammer.Tap({
    //     event: "tripletap",
    //     taps: 3
    // });
    // hammer.add([tripleTap, doubleTap, singleTap]);
    // tripleTap.recognizeWith([doubleTap, singleTap]);
    // doubleTap.recognizeWith(singleTap);
    //
    // doubleTap.requireFailure(tripleTap);
    // singleTap.requireFailure([tripleTap, doubleTap]);

}

function soundPlay() {
    window.AudioContext = window.webkitAudioContext || window.AudioContext;
    var audioctx = new AudioContext();
    var osc = audioctx.createOscillator();
    var gain = audioctx.createGain();
    osc.connect(gain);
    gain.connect(audioctx.destination);

    osc.type = "triangle";
    osc.frequency.value = 4000;
    gain.gain.value = 1;

    var t0 = audioctx.currentTime;
    osc.start(t0);
    osc.stop(t0 + 0.05);
}

window.onload = new function() {
    initWebSocket();
    initCanvas();
    document.addEventListener("fullscreenchange", resizeCanvas, false);
    document.getElementById("FS").onclick = function() {
        //mozilla support only
        if (document.documentElement.mozRequestFullScreen) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.mozRequestFullScreen();
            }
        }
    };
}

//--------------------------------------------------------------------------

function sendMessage(x, y, p, eventtype) {
    ws.send(x + "," + y + "," + p + "," + eventtype);
    // p = (p !== undefined) ? p : 1;
    // ws.send(x + "," + y + "," + ev.targetTouches[0].forces);
}

function calCanvasOffset() {
    console.log("calc offset");
    var bounds = canvas.getBoundingClientRect();
    canvas_offset.x = ~~(bounds.left);
    canvas_offset.y = ~~(bounds.top);
}


function draw(e) {
    e.preventDefault();
    console.log("draw")

    if (isSelected) {
        var x = ~~(e.targetTouches[0].clientX - canvas_offset.x);
        var y = ~~(e.targetTouches[0].clientY - canvas_offset.y);

        if (isDrag) {
            sendMessage(x - prev_point.x, y - prev_point.y, ~~(100 * e.targetTouches[0].force || 1), "d");
        } else {
            sendMessage(x - prev_point.x, y - prev_point.y, ~~(100 * e.targetTouches[0].force || 1), "m");
        }

        //draw circle
        ctx.clearRect(prev_point.x - 60, prev_point.y - 60, 120, 120);
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + line_color[0] + "," + line_color[1] + "," + line_color[2] + "," + line_color[3] + ")";
        ctx.arc(x, y, 50, 0, 6.28, false);
        ctx.fill();

        prev_point.x = x;
        prev_point.y = y;
    }
}

function drawStart(e) {
    console.log("draw start");
    e.preventDefault()
    // var x = ~~(e.targetTouches[0].clientX - canvas_offset.x);
    // var y = ~~(e.targetTouches[0].clientY - canvas_offset.y);
    // sendMessage(x - prev_point.x, y - prev_point.y, 1, "s");
    prev_point.x = ~~(e.targetTouches[0].clientX - canvas_offset.x);
    prev_point.y = ~~(e.targetTouches[0].clientY - canvas_offset.y);

    isSelected = true;
    isDrag = false;
}

function dragStart(e) {
    console.log("drag start");
    e.preventDefault()
    // window.navigator.vibrate(200);
    soundPlay();

    // var x = ~~(e.gesture.center.x - canvas_offset.x);
    // var y = ~~(e.gesture.center.y - canvas_offset.y);
    // sendMessage(x - prev_point.x, y - prev_point.y, 1, "s");
    prev_point.x = ~~(e.gesture.center.x - canvas_offset.x);
    prev_point.y = ~~(e.gesture.center.y - canvas_offset.y);

    isSelected = true;
    isDrag = true;
}

function drawEnd(e) {
    console.log("draw end");
    // console.log(e);
    e.preventDefault()
    // prev_point.x = ~~(e.targetTouches[0].clientX - canvas_offset.x);
    // prev_point.y = ~~(e.targetTouches[0].clientY - canvas_offset.y);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isSelected = false;
    if (isDrag) {
        isDrag = false;
        sendMessage(0, 0, 1, "de");
    }
    else{
        sendMessage(0, 0, 1, "e");
    }
}

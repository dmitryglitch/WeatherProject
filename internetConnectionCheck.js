const imageAddr = "http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg";
const downloadSize = 4995374; //bytes

const btnSpeedTest = document.getElementById("btnSpeedTest");
const spBps = document.getElementById("spBps");
const spKbps = document.getElementById("spKbps");
const spMbps = document.getElementById("spMbps");

btnSpeedTest.onclick = function () {
    MeasureConnectionSpeed();
};

function ShowProgressMessage(msg) {
    if (console) {
        if (typeof msg == "string") {
            console.log(msg);
        } else {
            for (var i = 0; i < msg.length; i++) {
                console.log(msg[i]);
            }
        }
    }

    let oProgress = document.getElementById("progress");
    if (oProgress) {
        let actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
        oProgress.innerHTML = actualHTML;
    }
}

function InitiateSpeedDetection() {
    ShowProgressMessage("Loading the image, please wait...");
    window.setTimeout(MeasureConnectionSpeed, 1);
}

if (window.addEventListener) {
    window.addEventListener('load', InitiateSpeedDetection, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', InitiateSpeedDetection);
}

function MeasureConnectionSpeed() {
    let startTime, endTime;
    let download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    };

    download.onerror = function (err, msg) {
        ShowProgressMessage("Invalid image, or error downloading");
    };

    startTime = (new Date()).getTime();
    let cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;

    function showResults() {
        let duration = (endTime - startTime) / 1000;
        let bitsLoaded = downloadSize * 8;
        let speedBps = (bitsLoaded / duration).toFixed(2);
        let speedKbps = (speedBps / 1024).toFixed(2);
        let speedMbps = (speedKbps / 1024).toFixed(2);
        ShowProgressMessage([
            "Your connection speed is:",
            speedBps + " bps",
            speedKbps + " kbps",
            speedMbps + " Mbps"
        ]);
        spBps.innerHTML = speedBps;
        spKbps.innerHTML = speedKbps;
        spMbps.innerHTML = speedMbps;
    }
}



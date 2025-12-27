function updateTime() {
        let d = new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds();
        let milliseconds = d.getMilliseconds();

        // 24 hour stuff
        document.getElementById("24hours").innerHTML = hours < 10 ? "0" + hours.toString() : hours;
        document.getElementById("24min").innerHTML = minutes < 10 ? "0" + minutes.toString() : minutes;
        document.getElementById("24sec").innerHTML = seconds < 10 ? "0" + seconds.toString() : seconds;
        // 12 hour stuff
        document.getElementById("12hours").innerHTML = hours > 12 ? hours - 12 : hours;
        document.getElementById("12min").innerHTML = minutes < 10 ? "0" + minutes.toString() : minutes;
        document.getElementById("12sec").innerHTML = seconds < 10 ? "0" + seconds.toString() : seconds;
        document.getElementById("ampm").innerHTML = hours > 12 ? "PM" : "AM";
        // millisecond stuff
        let ImperialMillisecondsFromMidnight = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds;
        document.getElementById("totalSec").innerHTML = parseInt(ImperialMillisecondsFromMidnight / 1000);
        let MetricMillisecondsFromMidnight = ImperialMillisecondsFromMidnight * (100000 / 86400);
        // document.getElementById("metricSec").innerHTML = parseInt(MetricMillisecondsFromMidnight / 1000);


        let metricSecondFromMidnight = Math.trunc(MetricMillisecondsFromMidnight / 1000);
        let metricHour = Math.trunc(metricSecondFromMidnight / 10000);
        let metricMinute = Math.trunc((metricSecondFromMidnight - metricHour * 10000) / 100);
        let metricSecond = metricSecondFromMidnight - metricHour * 10000 - metricMinute * 100;

        document.getElementById("metHour").innerHTML = metricHour;
        document.getElementById("metMin").innerHTML = metricMinute < 10 ? "0" + metricMinute.toString() : metricMinute;
        document.getElementById("metSec").innerHTML = metricSecond < 10 ? "0" + metricSecond.toString() : metricSecond;

        let binarySecondFromMidnight = ImperialMillisecondsFromMidnight * (65536 / 86400) / 1000;
        document.getElementById("bin1").innerHTML = (truncateString(DecimalToBinary(binarySecondFromMidnight)));

        let hexSecondFromMidnight = binarySecondFromMidnight.toString(16);
        document.getElementById("hex").innerHTML = (truncateString(hexSecondFromMidnight.toUpperCase()));
    }

    setInterval(updateTime, 100);

    function DecimalToBinary(d) {
        return d.toString(2);
    }

    function truncateString(str) {
        let array = str.split(".");
        return array[0];
    }

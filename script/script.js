$(document).ready(function(){

    function imgfit(){
        const bw = $("#back").width();
        const bh = $("#back").height();
        const iw = $("#back img").get(0).width;
        const ih = $("#back img").get(0).height;
        const br = bw / bh;
        const ir = iw / ih;
        if (br > ir) {
            $("#back img").width(bw).height("auto");
        } else {
            $("#back img").height(bh).width("auto");
        }
    }

    imgfit();
    $(window).resize(imgfit);

    function naljja(stamp) {
        stamp = stamp * 1000;  // 초 단위 입력 시 밀리초로 변환
        const time = new Date(stamp);
        // time.setDate(time.getDate() - 1);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let date = time.getDate();

        if (month < 10) { month = "0" + month; }
        if (date < 10) { date = "0" + date; }
        const day = time.getDay();
        const yoil = ["일", "월", "화", "수", "목", "금", "토"];

        const formattedDate = year + "-" + month + "-" + date;
        const dayName = yoil[day];
        const result = {
            date: formattedDate,
            day: dayName
        };
        return result;
    }

    const now = new Date();
    let currentHour = now.getHours();
    let start = Math.floor(currentHour / 3);

    let lat = "37.52682";
    let lon = "126.92435";
    navigator.geolocation.getCurrentPosition(function(pos){
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        getweather();
    }, function(){
        getweather();
    });    

    function getweather(){
        $("#city>option").eq(0).attr({
            lat: lat,
            lon: lon
        });
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=e6ee8ea2d7131ed534209b93ca4235a2&units=metric&lang=kr",
            success: function(data){
                $("#dosi").text(data.city.name);
                $("#date").text(naljja(data.list[start].dt).date + " (" + naljja(data.list[0].dt).day + "요일)");
                $("#icon").html("<img src='https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png' alt='" + data.list[0].weather[0].description + "' />");
                $("#forecast").text(data.list[start].weather[0].description);
                $("#temp").text(data.list[start].main.temp);
                $("#min").text(data.list[start].main.temp_min);
                $("#max").text(data.list[start].main.temp_max);
                $("#dir").css("transform", "rotate(" + data.list[start].wind.deg + "deg)");
                $("#speed").text(data.list[start].wind.speed);
                for (let i = 0; i < 4; i++) {
                    $(".fore").eq(i).find(".ficon").html("<img src='https://openweathermap.org/img/wn/" + data.list[start + ((i+1) * 8)].weather[0].icon + "@2x.png' alt='" + data.list[start + ((i+1) * 8)].weather[0].description + "' />");
                    $(".fore").eq(i).find(".ftemp").text(data.list[start + ((i+1) * 8)].main.temp);
                    $(".fore").eq(i).find(".ftext").text(data.list[start + ((i+1) * 8)].weather[0].description);
                    $(".fore").eq(i).find(".fday").text(naljja(data.list[start + ((i+1) * 8)].dt).day);
                }
            }
        });
    }

    $("#city").change(function(){
        lat = $(this).children("option:selected").attr("lat");
        lon = $(this).children("option:selected").attr("lon");
        getweather();
    });
});
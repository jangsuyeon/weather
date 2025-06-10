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
        // time.setHours(time.getHours() - 3);
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

    console.log(naljja(1735819200));
    console.log(naljja(1735819200));

    const now = new Date();
    let lat = "37.5665";
    let lon = "126.9780";
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
                let start = 0;
                const now = new Date();

                // 현재 시간 이후의 데이터 인덱스 계산
                for (let i = 0; i < data.list.length; i++) {
                    const forecastTime = data.list[i].dt * 1000; // 예보 시간(밀리초)
                    if (forecastTime >= now.getTime()) {
                        start = i;
                        break;
                    }
                }

                console.log(data.list[start]);
                console.log(naljja(data.list[start].dt).date);


                // const weatherTranslation = {
                //     "맑음": "sun",
                //     "비": "rain",
                //     "흐림": "cloud0",
                //     "안개": "mist",
                //     "눈": "snow",
                //     // 다른 날씨 설명에 대한 매핑을 추가할 수 있습니다.
                // };
                
                // // 날씨 설명을 영어로 변경
                // let descriptionInEnglish = weatherTranslation[data.list[start].weather[0].description] || data.list[start].weather[0].description;
                
                // // 영어로 바뀐 날씨 설명을 사용
                // $("#back").children().attr("src", "images/" + descriptionInEnglish.replace(/\s+/g, '_') + ".jpg");


                $("#dosi").text(data.city.name);
                if($("#dosi").text() == 'Gongju') {
                    $("#dosi").text('Sejong');
                }
                $("#date").text(naljja(data.list[start].dt).date + " (" + naljja(data.list[start].dt).day + "요일)");
                $("#icon").html("<img src='https://openweathermap.org/img/wn/" + data.list[start].weather[0].icon + "@2x.png' alt='" + data.list[start].weather[0].description + "' />");
                $("#forecast").text(data.list[start].weather[0].description);
                $("#temp").text(data.list[start].main.temp);
                $("#min").text(data.list[start].main.temp_min);
                $("#max").text(data.list[start].main.temp_max);
                $("#dir").css("transform", "rotate(" + data.list[start].wind.deg + "deg)");
                $("#speed").text(data.list[start].wind.speed);
                for (let i = 0; i < 4; i++) {
                    const forecastIndex = start + ((i + 1) * 8);
                    if (forecastIndex < data.list.length) {
                        $(".fore").eq(i).find(".ficon").html("<img src='https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png' alt='" + data.list[forecastIndex].weather[0].description + "' />");
                        $(".fore").eq(i).find(".ftemp").text(data.list[forecastIndex].main.temp);
                        $(".fore").eq(i).find(".ftext").text(data.list[forecastIndex].weather[0].description);
                        $(".fore").eq(i).find(".fday").text(naljja(data.list[forecastIndex].dt).day);
                    }
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
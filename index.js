const http = require("http");
const fs  = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync('home1.html','utf8');

const replacedata = (data,val)=>{
    var temperature = data.replace('{%tempval%}',val.main.temp);
    temperature = temperature.replace('{%tempval1%}', val.main.temp);
    temperature = temperature.replace('{%tempmin%}', val.main.temp_min);
    temperature = temperature.replace('{%tempmax%}', val.main.temp_max);
    temperature = temperature.replace('{%location%}', val.name);
    temperature = temperature.replace('{%country%}', val.sys.country);
    temperature = temperature.replace('{%tempstatus%}', val.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res)=>{

    if(req.url == "/")
    {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=c447c0a8b27e0d5a3977886979d90925&units=metric')
        .on('data', function (chunk) {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
           // console.log(arrData[0].main.temp);
           
           const realdata = arrData.map((val)=>replacedata(homeFile,val)).join("");
                // console.log(realdata);
                res.write(realdata);
                //return realdata;
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        // console.log('end');
});
    }


});

server.listen(8000,"localhost",()=>{
    console.log("server connected !!");
});
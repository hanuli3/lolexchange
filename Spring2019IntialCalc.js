const csv = require('csvtojson')
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

function readTrainingData(path) {
    return csv().fromFile(path).then((jsonObj) => {
        let lcsMatches = [];
        let lastMatch = 0;

           return fs.readFileAsync('time.txt', "utf8").then(data=> {
        //console.log(err,buf);
        console.log(data)
            jsonObj.forEach(match => {
            //console.log(match.date + buf);
            if (match.league === 'LCS' && match.player != 'Team' && match.date > data && match.gameid !=1002620109 ) {
                lcsMatches.push(match);
                //fs.writeFile('time.txt', match.date, function(err, data){});
                //lastMatch = match.date;
                //console.log(match)
            }

        });
        //console.log(lcsMatches);
        if(lcsMatches.length > 0){
            //fs.writeFile('time.txt', lcsMatches[lcsMatches.length - 1].date, function(err, data2){});
        //console.log(lcsMatches);

return lcsMatches;
}
    });
        
        
    });
}
readTrainingData('./data3.csv').then((data)=>{
    //data[1][league]]
    //console.log(data.length);
    if (data === undefined || data.length == 0) {
    // array empty or does not exist
    }
    else{
        var a = [];
        for(let i = 0; i < data.length; i++ ) {
            if(a[data[i].player] === undefined)
                a[data[i].player] = 0;
            let s = masterFormula(data[i]);
            a[data[i].player] += s;
            console.log("Player: " + data[i].player + "  Score: "+ s);
        }
    //a.forEach(key => {
    //    console.log(key + a[key]);
   // });
        var stream = fs.createWriteStream("Spring2019Simulation.txt", {flags:'a'});
        var stockId =0;

        var positionFormat = [];
        positionFormat["Top"] = "TOP";
        positionFormat["Jungle"] = "JNG";
        positionFormat["Middle"] = "MID";
        positionFormat["ADC"] = "BOT";
        positionFormat["Support"] = "SUP";

        for (var key in a) {
            stream.write("INSERT INTO `stock` VALUES ("+(stockId+1)+",'" + key+"'," +a[key] +",'"+ data[stockId].team +"','"+positionFormat[data[stockId].position] + "');\n");
            console.log( key + ": "+a[key]);
            stockId++;
        }
        stream.end();
    }

    //console.log(data.length + data[1].league)
});


function masterFormula(data){
    let weights = {
        "Top" : [5,2.5,1,50,0.01,10,0.5,0.5,0.1,0.002,0.002,0.002],
        "Jungle" : [5,1.5,1.5,30,0.01,10,1.5,1.5,0.1,0.002,0.002,0.002],
        "Middle" : [5,2,1,5,0.01,10,0.5,0.5,0.1,0.002,0.002,0.002],
        "ADC" : [5,2,1,5,0.01,10,0.5,0.5,0.1,0.002,0.002,0.002],
        "Support" : [5,1,1.5,10,0.001,5,5,5,0.001,0.0002,0.001,0.001]
    };
    //console.log(data.position);
    return  30.0 / data.gamelength  * calcScore( weights[data.position], data );
}

function calcScore(array, data) {
    return array[0]*parseInt(data.result, 10) + array[1]*parseInt(data.k, 10) + array[2]*parseInt(data.a, 10) + array[3]*parseFloat(data.kpm, 10) + array[4]*parseFloat(data.dmgtochampsperminute, 10) + array[5]*parseFloat(data.dmgshare, 10) + array[6]*parseFloat(data.wpm, 10) + array[7]*parseFloat(data.wcpm, 10) + array[8]*parseFloat(data.cspm, 10) + array[9]*parseFloat(data.gdat15, 10) + array[10]*parseFloat(data.csdat10, 10) + array[11]*parseFloat(data.xpdat10, 10);
}
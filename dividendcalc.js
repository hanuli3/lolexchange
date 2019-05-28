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
                if (match.league === 'LCS' && match.player != 'Team' && match.date > data) {
                    lcsMatches.push(match);
                //fs.writeFile('time.txt', match.date, function(err, data){});
                //lastMatch = match.date;
                //console.log(match)
                }

            });
            if(lcsMatches.length > 0){
            //fs.writeFile('time.txt', lcsMatches[lcsMatches.length - 1].date, function(err, data2){});
                return lcsMatches;
            }   
        });        
    });
}

readTrainingData('./data.csv').then((data)=>{
    //data[1][league]]
    //console.log(data.length);
    if (data === undefined || data.length == 0) {
    // array empty or does not exist
    }
    else{
        var a = [];
        var names =[];
        var stream = fs.createWriteStream("dividend.txt", {flags:'a'});
        var top = 0;
        var jng = 0;
        var mid = 0;
        var adc = 0;
        var sup = 0;
        count =1;
        for(let i = 0; i < data.length; i++ ) {
            if(a[data[i].player] === undefined){
                a[data[i].player] = 0;
                names[data[i].player] = count;
                count++;
            }
            let s = masterFormula(data[i]);
            a[data[i].player] += s;
            console.log("Player: " + data[i].player + "  Score: "+ s);
            stream.write("INSERT INTO `dividend` (stock_id, value) VALUES ("+names[data[i].player] + ","+ s +");\n");

            if(data[i].position ==="Top")
                top += s;
            if(data[i].position ==="Jungle")
                jng += s;
            if(data[i].position ==="Middle")
                mid += s;
            if(data[i].position ==="ADC")
                adc += s;
            if(data[i].position ==="Support")
                sup += s;
        }
        
        stream.end();
        console.log("");
    //a.forEach(key => {
    //    console.log(key + a[key]);
   // });
        for (var key in a) {
            console.log( key + ": "+a[key]);
        }

        console.log("");
        console.log("Top: " + top);
        console.log("Jungle: " + jng);
        console.log("Middle: " + mid);
        console.log("ADC: " + adc);
        console.log("Support: " + sup);
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
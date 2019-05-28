const parser = require('csv-parse')
const parse = require('csv-parse/lib/sync')
const assert = require('assert')

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
const results = [];
 
fs.readFileAsync('data.csv', 'utf8').then(function (data){
	console.log(data);
});

  // .pipe(parser())
  // .on('data', results.push)
  // .on('end', () => {
  //   console.log(records);
  //   // [
  //   //   { NAME: 'Daffy Duck', AGE: 24 },
  //   //   { NAME: 'Bugs Bunny', AGE: 22 }
  //   // ]
  // });

// const input = `
// "key_1","key_2"
// "value 1","value 2"
// `
// const records = parse('data.csv', {
//   columns: true,
//   skip_empty_lines: true
// })
// function whatever(){
// 	console.log('eat my ass')
// 	console.log(records)
// }
// function main() {
// 	whatever()
// }

// main()
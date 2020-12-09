exports.handler = function(context, event, callback) {

	var fs = require('fs');

    var rawdata = fs.readFile('https://pecodev.convergentusa.com/Json/JsonFormate.json');
    console.log(rawdata);
    var student = JSON.parse(rawdata);
    console.log(student);
    //fs.readFile(`https://pecodev.convergentusa.com/Json/JsonFormate.json`, (err, data) => {
   // if (err) throw err;
   // var student = JSON.parse(data);
   // console.log(student);
     //console.log(data);
//});
	callback(null, rawdata);
};
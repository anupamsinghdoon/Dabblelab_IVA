exports.handler = function(context, event, callback) {
    var dateFormat = require('dateformat');
    
    let response={result:""};
	var d = new Date(); // Today!
    d.setDate(d.getDate() + 30);
	  
  var day=dateFormat(d, "yyyy-mm-dd");
  response.result=day;
	callback(null, response);
};
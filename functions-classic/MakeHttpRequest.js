exports.handler = function(context, event, callback) {
 
    var responsemsg ="";
    //var request = require('request'),
    // url = "https://pecodev.convergentusa.com/IVRAPI/Home/Index",
     //auth = "Basic cGVjb2RldmlpczpUZXN0QDEyMw==";
   // var request = require('request'),
    // username = "pecodeviis",
    // password = "Test123!",
    // url = "https://" + username + ":" + password + "@pecodev.convergentusa.com/IVRAPI/Home/Index";
     //url = "https://pecodev.convergentusa.com/IVRAPI/Home/Index",
    // auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
   
  //  request.post(
    // {
        
       //  url : url
         //headers : {
          //   "Authorization" : auth
        // }
        
    // },
    //function (error, response, body) {
        // console.log('body', body);
        // console.log(response);
        // console.log(error);
        // console.log(`statusCode: ${response.statusCode}`);
         //responsemsg=response;
         // Do more stuff with 'body' here
     //}
 //);
 
  // console.log('request',responsemsg);
  
  const axios = require('axios');
 
 //axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
 axios.post('https://pecodeviis:Test123!@pecodev.convergentusa.com/IVRAPI/Home/Index')
   .then(response => {
     console.log(response.data);
     console.log(response.data);
     //responsemsg=response.data.explanation;
     callback(null, response.data);
   })
   .catch(error => {
     console.log(error);
     
     callback(null, error);
   });
   
       //callback(null, responsemsg);
 };
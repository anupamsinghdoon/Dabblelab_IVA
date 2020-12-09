exports.handler = function(context, event, callback) {
    
    let RespJson = {'Key2': event.Key2, 'timezone': event.timezone}
    callback(null, RespJson);
};

var https = require('https');


  exports.notification = (playerId, msg) => {
    var sendNotification = function(data) {
        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic ODQxMzE5NDktN2Y3MS00ZGYwLTgxMjktOGVjNDQxMGVlZWUy"
        };
        
        var options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };
        
        var req = https.request(options, function(res) {  
          res.on('data', function(data) {
            console.log(JSON.parse(data));
          });
        });
        req.on('error', function(e) {
          console.log("ERROR:");
          console.log(e);
        });
        
        req.write(JSON.stringify(data));
        req.end();
      };
    
        
      var message = { 
        app_id: "f0f18dd7-c9b5-4bda-8daa-e9eeb53297f9",
        "include_player_ids": [playerId],
        "contents": {"en": msg},
      };
      console.log(message)
      sendNotification(message);
    
  };
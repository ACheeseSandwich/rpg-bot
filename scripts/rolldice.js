// Description:
//   Rolls dice!
//
// Dependencies:
//   None
// Description:
//   Rolls dice!
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot roll XdY[+/-#] [adv,advantage,dis,disadvantage] -  rolls X dice with Y sides. Optional `+` or `-` adds/subtracts bonuses, and the [adv,advantage,dis,disadvantage] keywords roll advantage or disadvantage (note the space between the dice syntax and the adv keywords)
//
// Author:
//   unquist

(function() {
    module.exports = function(robot) {
        var util = require("util");
		var randint = function(sides) {
            return Math.round(Math.random() * (sides - 1)) + 1;
        };

        var rolldice = function(sides, num) {
            var results = [];
            for (var j = 1; j <= num; j++) {
                results.push(randint(sides));
            }
            return results;
        };
        
        var diceBot = function(name,num,sides,bonusType,bonus,advantage) {
            var rolls = rolldice(sides, num);
            var rollsTotal = 0;
      			
      			var result = "@" + name + " rolled " + num + "d" + sides;
      			if(bonusType.indexOf("+") != -1)
      			{
      				result += "+" + bonus;
      			}
      			else if(bonusType.indexOf("-") != -1)
      			{
      				result += "-" + bonus;
      			}
			
			      if(advantage.indexOf("dis") != -1)
			      {
			        result += " with disadvantage\nFirst result: ";
			        var secondRollsTotal = rollsTotal;
			        
			        for (var j = 0; j < rolls.length; j++) {
                result += "`" + rolls[j] + "` ";
                rollsTotal += rolls[j];
		          }
		          result += "\nSecond result: ";
		          rolls = rolldice(sides, num);
		          for (var j = 0; j < rolls.length; j++) {
                result += "`" + rolls[j] + "` ";
                secondRollsTotal += rolls[j];
		          }
		          
		          if(secondRollsTotal < rollsTotal)
		          {
		            rollsTotal = secondRollsTotal;
		          }
		          if(Number(bonus) > 0)
      		    {
      			  	rollsTotal += Number(bonus);
      			  }
		          
		          result += "\n*Total of lowest rolls: `" + rollsTotal + "`*";
              
			      }
			      else if(advantage.indexOf("adv") != -1)
			      {
			        result += " with advantage\nFirst result: ";
			        var secondRollsTotal = rollsTotal;
			        
			        for (var j = 0; j < rolls.length; j++) {
                result += "`" + rolls[j] + "` ";
                rollsTotal += rolls[j];
		          }
		          result += "\nSecond result: ";
		          rolls = rolldice(sides, num);
		          for (var j = 0; j < rolls.length; j++) {
                result += "`" + rolls[j] + "` ";
                secondRollsTotal += rolls[j];
		          }
		          
		          if(secondRollsTotal > rollsTotal)
		          {
		            rollsTotal = secondRollsTotal;
		          }
		          if(Number(bonus) > 0)
      		    {
      			  	rollsTotal += Number(bonus);
      			  }
		          
              result += "\n*Total of highest rolls: `" + rollsTotal + "`*";
              
			      }
			      else
			      {
			        if(Number(bonus) > 0)
      		    {
      			  	rollsTotal += Number(bonus);
      			  }
			        
			        result += "\n*Result: ";
			        for (var j = 0; j < rolls.length; j++) {
                result += "`" + rolls[j] + "` ";
                rollsTotal += rolls[j];
		          }
					result += "*";
              if ((rolls.length > 1) || (rolls.length == 1 && Number(bonus) > 0)) 
              {
                result += "\n*Total: `" + rollsTotal + "`*";
              }
			      }

		
			   
            var msgData = {
              
              attachments: [{
                "fallback": result,
                "color": "#cc3300",
                "footer": "Dice Rolling Script",
                "footer_icon": "https://a.fsdn.com/allura/p/kdicegen/icon",
                "text": result,
				"mrkdwn_in": ["text"]
              }]
          };
          
          
          
          return msgData;
        };

        robot.hear(/(\$roll\s+)(\d+)(d)(\d+)(\+|-){0,1}(\d+){0,1}\s{0,1}(advantage|adv|disadvantage|dis){0,1}/i, function(msg) {
            var callerName = msg.message.user.name;
			var num = msg.match[2] || 1;
            var sides = msg.match[4] || 6;
            var bonusType = msg.match[5] || "NAN";
			var bonus = msg.match[6] || 0;
			var advantage = msg.match[7] || "";
            
            var msgData = diceBot(callerName,num,sides,bonusType,bonus,advantage);
            msgData['channel'] = msg.message.room;
            try{
              
              robot.adapter.customMessage(msgData);
            }
            catch (err) 
            {
              robot.logger.debug("Caught error: " + err.message);
            }
            return;
        });
    
      	robot.router.post('/hubot/roll', function(req, res) {
          robot.logger.debug("Received a POST request to /hubot/roll");
          
          var data, channel_name, response_url, command, text, token,username;
               
          data = req.body.payload != null ? JSON.parse(req.body.payload) : req.body;
          //robot.logger.debug("data:"+util.inspect(data));
		  command = data.command;
          text = data.text;     
		  token = data.token;
		  username = data.user_name;
		  channel_name = data.channel_name;
		  		  
		  robot.logger.debug("token="+token);
		  robot.logger.debug("username="+username);
		  
		  var num = 2;
		  var sides = 6;
		  var bonusType = "+";
		  var bonus = 10;
		  var advantage = "";
		  
		  var msgData = diceBot(username,num,sides,bonusType,bonus,advantage);
          msgData['channel'] = channel_name;
		  msgData['response_type'] = 'in_channel';
		  
          return res.send(JSON.stringify(msgData));
    });
      
    };

})();

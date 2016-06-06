// Description:
//   Keeps track of combat
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
//   hubot combat
//
// Author:
//   unquist

(function() {
    module.exports = function(robot) {
        var insults = ['artless','bawdy','beslubbering','bootless','churlish','cockered','clouted','craven','currish','dankish','dissembling','droning','errant','fawning','fobbing','froward','frothy','gleeking','goatish','gorbellied','impertinent','infectious','jarring','loggerheaded','lumpish','mammering','mangled','mewling','paunchy','pribbling','puking','puny','qualling','rank','reeky','roguish','ruttish','saucy','spleeny','spongy','surly','tottering','unmuzzled','vain','venomed','villainous','warped','wayward','weedy','yeasty','cullionly','fusty','caluminous','wimpled','burly-boned','misbegotten','odiferous','poisonous','fishified','Wart-necked','base-court','bat-fowling','beef-witted','beetle-headed','boil-brained','clapper-clawed','clay-brained','common-kissing','crook-pated','dismal-dreaming','dizzy-eyed','doghearted','dread-bolted','earth-vexing','elf-skinned','fat-kidneyed','fen-sucked','flap-mouthed','fly-bitten','folly-fallen','fool-born','full-gorged','guts-griping','half-faced','hasty-witted','hedge-born','hell-hated','idle-headed','ill-breeding','ill-nurtured','knotty-pated','milk-livered','motley-minded','onion-eyed','plume-plucked','pottle-deep','pox-marked','reeling-ripe','rough-hewn','rude-growing','rump-fed','shard-borne','sheep-biting','spur-galled','swag-bellied','tardy-gaited','tickle-brained','toad-spotted','unchin-snouted','weather-bitten','whoreson','malmsey-nosed','rampallian','lily-livered','scurvy-valiant','brazen-faced','unwashed','bunch-backed','leaden-footed','muddy-mettled','pigeon-livered','scale-sided','apple-john','baggage','barnacle','bladder','boar-pig','bugbear','bum-bailey','canker-blossom','clack-dish','clotpole','coxcomb','codpiece','death-token','dewberry','flap-dragon','flax-wench','flirt-gill','foot-licker','fustilarian','giglet','gudgeon','haggard','harpy','hedge-pig','horn-beast','hugger-mugger','joithead','lewdster','lout','maggot-pie','malt-worm','mammet','measle','minnow','miscreant','moldwarp','mumble-news','nut-hook','pigeon-egg','pignut','puttock','pumpion','ratsbane','scut','skainsmate','strumpet','varlot','vassal','whey-face','wagtail','knave','blind-worm','popinjay','scullian','jolt-head','malcontent','devil-monk','toad','rascal','basket-cockle'];

		var getRandomInsult = function() {
			var index = randint(insults.length) - 1;
			return insults[index];
		};
		
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
		
		//just a lazy wrapper for randint
		var rolldie = function(sides) {
            return randint(sides);
        };
		
		function Combatant (name,init) {
			this.name = name;
			this.init = Number(init);
		};
 
		Combatant.prototype.getName = function() {
			return this.name;
		};
		
		Combatant.prototype.getInit = function() {
			return this.init;
		};
		
		var combatantSortByName = function(a,b) {
			var nameA=a.getName().toLowerCase();
			var nameB=b.getName().toLowerCase();
			if (nameA < nameB) //sort string ascending
				return -1 
			if (nameA > nameB)
				return 1
			return 0 //default return value (no sorting) 
		};
		
		var combatantSortByInit = function(a,b) {
			var initA=a.getInit();
			var initB=b.getInit();
			if (initA < initB) //sort int descending
				return 1 
			if (initA > initB)
				return -1
			return 0 //default return value (no sorting) 
		};
		
		robot.hear(/(\/combat end)/i, function(msg) {
			var callerName = msg.message.user.name;
			var combat_started = robot.brain.get('combat_flag');
			
			if(combat_started != 0 && combat_started != 1)
			{
			   robot.logger.debug("Bad valuefor combat_started ["+combat_started+"]");
			   robot.brain.set('combat_flag', 0);
			   return msg.reply(">Unknown combat flag["+combat_started+"]");
			   
			}  
		    if(combat_started == 0)
			{
			   return msg.reply(">No combat started @"+callerName+". Begin with `/combat start`");
			}
			//combat needs to end
			
			robot.brain.set('combat_flag', 0);
			//TODO: any other cleanup work (like removing persistent variables)
			robot.logger.debug("Ending combat.");
			return msg.reply(">@"+callerName+" is taking the low road. Ending Combat.");
		});
		
        robot.hear(/(\/combat start )(\d+)/i, function(msg) {
           var callerName = msg.message.user.name;
		   var combat_started = robot.brain.get('combat_flag');
		   var numCombatants = msg.match[2] || -1;
		   robot.logger.debug("numCombatants = ["+numCombatants+"]"); 

		   if(combat_started != 0 && combat_started != 1)
		   {
			   robot.logger.debug("Bad valuefor combat_started ["+combat_started+"]");
			   robot.brain.set('combat_flag', 0);
			   return msg.reply(">Unknown combat flag["+combat_started+"]");
		   }  
			if(combat_started == 1)
			{
				return msg.reply(">Combat already started @"+callerName+". End with `/combat end`");
			}
		   //Combat has started. First step is to check the number of participants
		   
		   if(numCombatants < 2)
		   {
				var reply = ">Need at least two to tango @"+callerName+"! Usage `combat start [num participants]` where [num participants] is 2 or more.\n";
				return msg.reply(reply);
		   }

		   
		   
		   /*
		   var combatant1 = new Combatant("Alice",5);
		   var combatant2 = new Combatant("Bob",10);
		   var combatant3 = new Combatant("Charles",1);
		   
		   var combatants = [combatant2, combatant3, combatant1];
		   robot.logger.debug("Before sort");
		   robot.logger.debug(combatants);
		   combatants = combatants.sort(combatantSortByName);
		   robot.logger.debug("After sort");
		   robot.logger.debug(combatants);
		   */
		   
		   //how many players have rolled for initiative? zero so far
		   var numRegisteredCombatants = 0;
		   robot.brain.set('numRegisteredCombatants',numRegisteredCombatants);
		   //array of players. currently empty
		   var combatantsArray = [];
		   robot.brain.set('combatantsArray',combatantsArray);
		   //who is in the fight?
		   var numTotalCombatants = numCombatants;
		   robot.brain.set('numTotalCombatants',numTotalCombatants);
		   
		   
		   robot.brain.set('combat_flag', 1);
		   return msg.reply(">@"+callerName+" started combat with " + numCombatants + " belligerents. Everyone roll for initiative!");
		   
        });
		
		robot.hear(/\/combat start$/i, function(msg) {
            var callerName = msg.message.user.name;
			var reply = ">Need at least two to tango @"+callerName+"! Usage `combat start [num participants]` where [num participants] is 2 or more.\n";
			return msg.reply(reply);
	
        });
		
	    robot.hear(/\/combat init(\s){0,1}(\d+){0,1}$/i, function(msg) {
			//var callerName = msg.message.user.name;
			//for debug only:
			var callerName = msg.message.user.name + " " + getRandomInsult();
			var combat_started = robot.brain.get('combat_flag');
			var numRegisteredCombatants = robot.brain.get('numRegisteredCombatants');
			//array of players
			var combatantsArray = robot.brain.get('combatantsArray');
			var numTotalCombatants = robot.brain.get('numTotalCombatants');
			
			
			if(combat_started != 0 && combat_started != 1)
			{
				robot.logger.debug("Bad valuefor combat_started ["+combat_started+"]");
				robot.brain.set('combat_flag', 0);
				return msg.reply(">Unknown combat flag["+combat_started+"]");
			}  
			if(combat_started == 0)
			{
				return msg.reply(">Don't get trigger happy @"+callerName+". Need to start combat before you roll initiative...");
			}
			else if(numTotalCombatants == numRegisteredCombatants)
			{
				return msg.reply(">This combat is full up @"+callerName+".");
			}
			else if(robot.brain.get(callerName+"_initScore") != null)
			{
				return msg.reply(">@" + callerName+" already rolled initiative `"+robot.brain.get(callerName+"_initScore")+"`. No backsies.");
			}
			
			var bonus = msg.match[2] || 0;
			robot.logger.debug("Init request from " + callerName + " with bonus of [" + bonus + "]");
			
			var initRoll = rolldie(20);
			var initScore = initRoll + Number(bonus);
			var newCombatant = new Combatant(callerName,initScore);
			robot.brain.set(callerName+"_initScore",initScore);
			
			combatantsArray.push(newCombatant);
			robot.brain.set('combatantsArray',combatantsArray);
			numRegisteredCombatants += 1;
			robot.brain.set('numRegisteredCombatants',numRegisteredCombatants);
			
			//ready to start combat?
			if(numRegisteredCombatants == numTotalCombatants)
			{
				var reply = ">@" + callerName+" rolled `" + initRoll +"` with a bonus of `" + bonus+"` for a total initative score of `"+initScore+".";
				reply += "\n\n>All Combatants accounted for.";
				reply += "\n\n>Here is the combat order:";
				
				combatantsArray = combatantsArray.sort(combatantSortByInit);
				robot.brain.set('combatantsArray',combatantsArray);

				for(var k = 0; k < combatantsArray.length; k++)
				{
					var order = k + 1;
					reply += "\n>["+order+"] @" + combatantsArray[k].getName() + " the " + getRandomInsult();
				}
				reply += "\n\n>*Let the bloodletting begin!*";
				return msg.reply(reply); 
			}
			else
			{
				var stillNeeded = numTotalCombatants - numRegisteredCombatants;
				return msg.reply(">@" + callerName+" rolled `" + initRoll +"` with a bonus of `" + bonus+"` for a total initative score of `"+initScore+".\n\n>Still waiting on "+stillNeeded+" combatants."); 
			}
        });
    };

})();
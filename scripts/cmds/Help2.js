const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help2",
    version: "1.0",
    author: "Mahin",
    role: 0,
    shortDescription: "View paginated command list",
    category: "utility",
    guide: "{pn} [page] | {pn} <command>"
  },

  onStart: async function ({ message, args, event }) {
    const prefix = getPrefix(event.threadID);
    const commandsPerPage = 25;
    const allCommands = Array.from(commands.keys())
      .filter(cmd => commands.get(cmd).config.role <= 0)
      .sort();
    const totalPages = Math.ceil(allCommands.length / commandsPerPage);

    // COMMAND DETAILS VIEW
    if (args[0] && isNaN(args[0])) {
      const cmdName = args[0].toLowerCase();
      const cmd = commands.get(cmdName) || 
                 [...aliases.entries()].find(([alias]) => alias === cmdName)?.[1];

      if (!cmd) {
        return message.reply(`⚠️ Command "${cmdName}" not found. Use "${prefix}help2" to view available commands.`);
      }

      const config = cmd.config;
      const details = `📚 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗗𝗘𝗧𝗔𝗜𝗟𝗦:

🆔 𝗡𝗮𝗺𝗲: ${config.name}
🗂️ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${config.category || "General"}
🔄 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${config.version}
👤 𝗔𝘂𝘁𝗵𝗼𝗿: ${config.author || "Unknown"}

📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻:
${config.longDescription || config.shortDescription || "No description available"}

🛠️ 𝗨𝘀𝗮𝗴𝗲:
${(config.guide?.body || prefix + config.name)
  .replace(/{pn}/g, prefix + config.name)
  .replace(/{p}/g, prefix)
  .replace(/{n}/g, config.name)}

${config.aliases ? `🔤 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${config.aliases.join(", ")}\n` : ""}
`;

      return message.reply(details);
    }

    // PAGINATED LIST VIEW
    const page = args[0] ? Math.min(Math.max(parseInt(args[0]), 1), totalPages) : 1;
    const startIdx = (page - 1) * commandsPerPage;
    const pageCommands = allCommands.slice(startIdx, startIdx + commandsPerPage);

    let replyMsg = `📖 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 𝗣𝗔𝗚𝗘 ${page}/${totalPages}\n\n`;
    replyMsg += `📊 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${allCommands.length}\n`;
    replyMsg += `🔣 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n\n`;

    // Group commands by first letter
    const commandGroups = {};
    pageCommands.forEach(cmd => {
      const firstLetter = cmd[0].toUpperCase();
      if (!commandGroups[firstLetter]) {
        commandGroups[firstLetter] = [];
      }
      commandGroups[firstLetter].push(cmd);
    });

    // Add commands to message
    Object.keys(commandGroups).sort().forEach(letter => {
      replyMsg += `🔸【 ${letter} 】\n`;
      replyMsg += `▸ ${commandGroups[letter].join(", ")}\n\n`;
    });

    replyMsg += `📌 𝗧𝗶𝗽: Use "${prefix}help2 <command>" for details\n`;
    replyMsg += `👑 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿: Mahin\n\n`;
    replyMsg += `🔄 𝗣𝗮𝗴𝗲 𝗡𝗮𝗺𝗯𝗲𝗿: ${page}/${totalPages}`;

    // Create navigation buttons
    const buttons = [];
    if (page > 1) {
      buttons.push({
        type: 'reply',
        reply: {
          displayText: '⬅️ Previous Page',
          id: `help2_${page-1}`
        }
      });
    }
    if (page < totalPages) {
      buttons.push({
        type: 'reply',
        reply: {
          displayText: 'Next Page ➡️',
          id: `help2_${page+1}`
        }
      });
    }

    buttons.push({
      type: 'reply',
      reply: {
        displayText: 'ℹ️ Support Info',
        id: 'help2_support'
      }
    });

    const sentMessage = await message.reply(replyMsg, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          pageData: { current: page, total: totalPages }
        });
      }
    });

    if (buttons.length > 0) {
      await message.reply("Navigate through pages:", {
        attachment: sentMessage.attachments,
        buttons,
        mentions: [{
          tag: "@user",
          id: event.senderID
        }]
      });
    }
  },

  onReply: async function ({ message, Reply, event }) {
    const { author, pageData } = Reply;
    if (event.senderID !== author) return;

    if (event.body.startsWith('help2_')) {
      const page = parseInt(event.body.split('_')[1]);
      await this.onStart({
        message,
        args: [page.toString()],
        event
      });
    } 
    else if (event.body === 'help2_support') {
      const prefix = getPrefix(event.threadID);
      await message.reply(
        `💡 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗜𝗡𝗙𝗢:\n\n` +
        `🔹 Type "${prefix}addo" to add owner\n` +
        `🔹 Join our group: m.me/j/AbaFfM_UeoFnQqbh/\n` +
        `🔹 Contact: Vag`
      );
    }
  }
};

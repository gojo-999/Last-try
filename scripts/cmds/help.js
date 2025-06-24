const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.1",
    author: "Mahin",
    role: 0,
    shortDescription: "Show command list or details",
    category: "utility",
    guide: {
      body: "{pn} [command]",
      footer: "Type {pn} <command> for details"
    }
  },

  onStart: async function ({ message, args, event }) {
    const prefix = getPrefix(event.threadID);
    
    if (!args[0]) {
      // COMMAND LIST VIEW
      const categories = new Map();
      let totalCommands = 0;

      commands.forEach((cmd, name) => {
        const category = cmd.config.category || "Other";
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category).push(name);
        totalCommands++;
      });

      // Create stylish response
      let replyMsg = `🌸┌─────────────────┐🌸
      🌟│   𝐘𝐮𝐫𝐢  𝓒𝓞𝓜𝓜𝓐𝓝𝓓𝓢   │🌟
      🌸└─────────────────┘🌸

      ✨ 𝓣𝓸𝓽𝓪𝓵 𝓒𝓸𝓶𝓶𝓪𝓷𝓭𝓼: ${totalCommands}
      🦋 𝓟𝓻𝓮𝓯𝓲𝔁: [ ${prefix} ]
  🍷 Type [ ${prefix}addo ] 𝐓𝐨 𝐚𝐝𝐝 𝐦𝐲 𝐨𝐰𝐧𝐞𝐫 📌
 🎀𝐉𝐨𝐢𝐧 𝐨𝐮𝐫 𝐌𝐚𝐢𝐧 𝐠𝐜:https://m.me/j/AbaFfM_UeoFnQqbh/

      🌼══════════════════💌\n`;

      // Add categories with stylish formatting
      [...categories.entries()].sort().forEach(([category, cmdList]) => {
        replyMsg += `🖤┌───【 ${category.toUpperCase()} 】───┐🦋\n`;
        replyMsg += `🎀 │ ${cmdList.sort().join("  ✧  ")}\n`;
        replyMsg += `🌷└─────────────────┘🌸\n\n`;
      });

      // Add footer
      replyMsg += `🦋══════════════════🦋
      🔮 𝓣𝔂𝓹𝓮 "${prefix}help <command>" 𝓯𝓸𝓻 𝓭𝓮𝓽𝓪𝓲𝓼𝓼
      👑 𝓞𝔀𝓷𝓮𝓮𝓻: 𝓜𝓪𝓱𝓲𝓷

      ✨⋆⋅☆⋅⋆✨⋆⋅☆⋅⋆✨⋆⋅☆⋅⋆✨
      🎀 Type "${prefix}addo" to add owner
      🍫 Join our community: m.me/j/AbaFfM_UeoFnQqbh/
      ✨⋆⋅☆⋅⋆✨⋆⋅☆⋅⋆✨⋆⋅☆⋅⋆✨`;

      return message.reply(replyMsg);
    }

    // COMMAND DETAILS VIEW
    const cmdName = args[0].toLowerCase();
    const cmd = commands.get(cmdName) || 
               [...aliases.entries()].find(([alias]) => alias === cmdName)?.[1];

    if (!cmd) {
      return message.reply(`💢 𝓒𝓸𝓶𝓶𝓪𝓷𝓭 "${cmdName}" 𝓷𝓸𝓽 𝓯𝓸𝓾𝓷𝓭. 𝓤𝓼𝓮 "${prefix}help"`);
    }

    const config = cmd.config;
    const details = `
🌸┌─────────────────┐🌸
🌟│ 𝓒𝓞𝓜𝓜𝓐𝓝𝓓 𝓓𝓔𝓣𝓐𝓘𝓛𝓢 │🌟
🌸└─────────────────┘🌸

🌠 𝓝𝓪𝓶𝓮: ${config.name}
🌌 𝓒𝓪𝓽𝓮𝓰𝓸𝓻𝔂: ${config.category || "None"}
📜 𝓥𝓮𝓻𝓼𝓲𝓸𝓷: ${config.version}
👤 𝓐𝓾𝓽𝓱𝓸𝓻: ${config.author || "Unknown"}

🪄══════════════════✨
𝓓𝓔𝓢𝓒𝓡𝓘𝓟𝓣𝓘𝓞𝓝:
${config.longDescription || config.shortDescription || "No description"}

💌══════════════════💌
𝓤𝓢𝓐𝓖𝓔:
${(config.guide?.body || "No usage guide")
  .replace(/{pn}/g, prefix + config.name)
  .replace(/{p}/g, prefix)
  .replace(/{n}/g, config.name)}

${config.aliases ? `🔮 𝓐𝓵𝓲𝓪𝓼𝓮𝓼: ${config.aliases.join(", ")}\n` : ""}
✨⋆⋅☆⋅⋆✨⋆⋅☆⋅⋆✨⋆⋅☆⋅⋆✨
🎀 Type "${prefix}addo" to add owner
🍫 Join our community: m.me/j/AbaFfM_UeoFnQqbh/
✨⋆⋅☆⋅⋆✨⋆⋅☆⋅⋆✨⋆⋅☆⋅⋆✨
`;

    return message.reply(details);
  }
};

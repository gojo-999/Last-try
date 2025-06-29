module.exports = {
  config: {
    name: "addo",
    version: "1.0",
    author: "Mahin", // Your name
    role: 0, // Anyone can use
    category: "utility",
    shortDescription: "Add owner to group",
    longDescription: "Adds the bot owner to the current group chat",
    guide: "{p}addo"
  },

  onStart: async function ({ api, event, args, message }) {
    // Your UID (replace with your actual UID)
    const ownerUID = "100030451953891"; 
    
    try {
      // Check if already in group
      const threadInfo = await api.getThreadInfo(event.threadID);
      const participants = threadInfo.participantIDs;
      
      if (participants.includes(ownerUID)) {
        return message.reply("⚠️𝐌𝐚𝐡𝐢𝐧 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐆𝐫𝐨𝐮𝐩");
      }

      // Add owner to group
      await message.reply("🚀𝐀𝐝𝐝𝐢𝐧𝐠 𝐌𝐚𝐡𝐢𝐧 𝐭𝐨 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩🦋...");
      await api.addUserToGroup(ownerUID, event.threadID);

      // Success message
      return message.reply({
        body: "✅ 𝐘𝐞𝐬 𝐛𝐛𝐲 𝐚𝐝𝐝𝐞𝐝 𝐦𝐲 𝐛𝐨𝐬𝐬 𝐌𝐚𝐡𝐢𝐧🎀!",
        mentions: [{
          tag: "@Md mahin",
          id: ownerUID
        }]
      });

    } catch (error) {
      console.error("Add Owner Error:", error);
      return message.reply("❌ Failed to add owner. Please try again later.");
    }
  }
};

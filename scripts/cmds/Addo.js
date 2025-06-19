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
        return message.reply("⚠️ I'm already in this group!");
      }

      // Add owner to group
      await message.reply("🚀 Adding owner to group...");
      await api.addUserToGroup(ownerUID, event.threadID);

      // Success message
      return message.reply({
        body: "✅ Successfully added owner to group!",
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

module.exports = {
  config: {
    name: "antiout",
    version: "3.0",
    author: "TawsiN",
    countDown: 5,
    role: 1, // Admin-only
    shortDescription: "💡 Prevent users from leaving the group!",
    longDescription:
      "The antiout feature ensures no one can leave the group. If enabled, any user who attempts to leave will be automatically re-added to the chat.",
    category: "boxchat",
    guide: "{pn} [on | off]\n\n🛠 Example:\n`{pn} on` - Enable antiout\n`{pn} off` - Disable antiout",
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function ({ message, event, threadsData, args, role }) {
    if (role < 1) {
      return message.reply("🚫 **Permission Denied!** Only admins can use this command.");
    }

    if (!["on", "off"].includes(args[0])) {
      return message.reply(
        "❌ **Invalid Argument!**\nPlease use `on` or `off`.\n\n🛠 Example:\n`{pn} on` to enable antiout\n`{pn} off` to disable it."
      );
    }

    const isEnabled = args[0] === "on";
    await threadsData.set(event.threadID, isEnabled, "settings.antiout");

    return message.reply(
      `🎉 **Antiout Feature Updated!**\nStatus: ${isEnabled ? "✅ Enabled" : "❌ Disabled"}\n\n📢 *Users who attempt to leave ${
        isEnabled ? "will be automatically added back!" : "can now leave freely."
      }*`
    );
  },

  onEvent: async function ({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (!antiout || !event.logMessageData || !event.logMessageData.leftParticipantFbId) return;

    const userId = event.logMessageData.leftParticipantFbId;

    try {
      // Check if the user is already in the group
      const threadInfo = await api.getThreadInfo(event.threadID);
      const isUserInChat = threadInfo.participantIDs.includes(userId);

      if (!isUserInChat) {
        await api.addUserToGroup(userId, event.threadID);

        // Send a stylish re-add message
        api.sendMessage(
          `💖 **Oops, looks like someone tried to leave!**\nUser: [${userId}](https://facebook.com/${userId})\n\n✨ But don’t worry, I brought them back!`,
          event.threadID
        );
      }
    } catch (error) {
      console.error(`⚠ Failed to re-add user ${userId}:`, error);
      api.sendMessage(
        `🚨 **Error:** Could not add the user back.\n\n❗ Possible Reasons:\n- Bot lacks admin privileges.\n- User blocked the bot.\n\nPlease check and try again.`,
        event.threadID
      );
    }
  }
};

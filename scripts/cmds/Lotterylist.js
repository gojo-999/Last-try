module.exports = {
  config: {
    name: "lotterylist",
    version: "1.0",
    author: "Dbz_Mahin",
    role: 0, // Everyone can use
    shortDescription: "Show lottery participants",
    longDescription: "Displays all players and their purchased tickets",
    category: "economy",
    guide: {
      en: "{p}lotterylist"
    }
  },

  onStart: async function ({ api, event, globalData }) {
    try {
      // Check if lottery exists
      if (!globalData.lottery || !globalData.lottery.participants) {
        return api.sendMessage(
          "🎫 No active lottery found\nStart a new lottery with !lotterybuy",
          event.threadID
        );
      }

      const { participants, ticketsSold, jackpot } = globalData.lottery;
      const currencySymbol = "฿";

      // Format participant list
      let participantList = Object.entries(participants)
        .sort((a, b) => b[1].tickets - a[1].tickets) // Sort by ticket count
        .map(([id, data], index) => 
          `${index + 1}. ${data.name} - ${data.tickets} ticket(s)`)
        .join('\n');

      return api.sendMessage(
        `🎰 𝗟𝗢𝗧𝗧𝗘𝗥𝗬 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗦\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💰 𝗝𝗮𝗰𝗸𝗽𝗼𝘁: ${currencySymbol}${jackpot.toLocaleString()}\n` +
        `🎫 𝗧𝗼𝘁𝗮𝗹 𝗧𝗶𝗰𝗸𝗲𝘁𝘀: ${ticketsSold}\n` +
        `👥 𝗣𝗹𝗮𝘆𝗲𝗿𝘀: ${Object.keys(participants).length}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${participantList || "No participants yet"}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Use ${global.GoatBot.config.prefix}lotterybuy to join!`,
        event.threadID
      );

    } catch (error) {
      console.error('[LOTTERYLIST ERROR]', error);
      return api.sendMessage(
        "❌ Failed to load lottery data",
        event.threadID
      );
    }
  }
};

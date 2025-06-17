module.exports = {
  config: {
    name: "customlottery",
    version: "1.0",
    author: "Dbz_Mahin",
    role: 1, // ADMIN ONLY
    shortDescription: "Create lottery with custom jackpot",
    longDescription: "Start a new lottery with specified jackpot amount",
    category: "economy",
    guide: {
      en: "{p}customlottery [jackpot]"
    }
  },

  onStart: async function ({ api, event, args, globalData }) {
    try {
      const CURRENCY = "฿";
      const MIN_JACKPOT = 1000000; // 1M minimum
      const MAX_JACKPOT = 100000000; // 100M maximum

      // Validate input
      const jackpot = parseInt(args[0]);
      if (isNaN(jackpot) {
        return api.sendMessage(
          `🎰 𝗖𝗨𝗦𝗧𝗢𝗠 𝗟𝗢𝗧𝗧𝗘𝗥𝗬\n━━━━━━━━━━━━━━━━━━\n` +
          `❌ Please specify jackpot amount\n` +
          `Min: ${CURRENCY}${MIN_JACKPOT.toLocaleString()}\n` +
          `Max: ${CURRENCY}${MAX_JACKPOT.toLocaleString()}\n` +
          `Usage: ${global.GoatBot.config.prefix}customlottery [amount]`,
          event.threadID
        );
      }

      // Check jackpot range
      if (jackpot < MIN_JACKPOT || jackpot > MAX_JACKPOT) {
        return api.sendMessage(
          `⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗝𝗮𝗰𝗸𝗽𝗼𝘁!\n` +
          `Must be between ${CURRENCY}${MIN_JACKPOT.toLocaleString()} - ${CURRENCY}${MAX_JACKPOT.toLocaleString()}`,
          event.threadID
        );
      }

      // Initialize new lottery
      globalData.lottery = {
        ticketsSold: 0,
        participants: {},
        isDrawActive: false,
        jackpot: jackpot,
        ticketPrice: Math.floor(jackpot * 0.01) // 1% of jackpot
      };

      return api.sendMessage(
        `🎉 𝗡𝗘𝗪 𝗟𝗢𝗧𝗧𝗘𝗥𝗬 𝗖𝗥𝗘𝗔𝗧𝗘𝗗!\n━━━━━━━━━━━━━━━━━━\n` +
        `💰 𝗝𝗮𝗰𝗸𝗽𝗼𝘁: ${CURRENCY}${jackpot.toLocaleString()}\n` +
        `🎫 𝗧𝗶𝗰𝗸𝗲𝘁 𝗣𝗿𝗶𝗰𝗲: ${CURRENCY}${globalData.lottery.ticketPrice.toLocaleString()}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Use ${global.GoatBot.config.prefix}lotterybuy to participate!`,
        event.threadID
      );

    } catch (error) {
      console.error('[CUSTOM LOTTERY ERROR]', error);
      return api.sendMessage(
        "❌ Failed to create lottery. Please try again.",
        event.threadID
      );
    }
  }
};

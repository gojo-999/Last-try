module.exports = {
  config: {
    name: "lotterydraw",
    version: "1.0",
    author: "Dbz_Mahin",
    role: 1, // ADMIN ONLY
    shortDescription: "Draw the lottery winner",
    longDescription: "Select a random winner from purchased tickets and award the jackpot",
    category: "economy",
    guide: {
      en: "{p}lotterydraw"
    }
  },

  onStart: async function ({ api, event, usersData, globalData }) {
    try {
      // Constants
      const JACKPOT = 10000000;
      const CURRENCY = "฿";

      // Check if lottery exists
      if (!globalData.lottery || !globalData.lottery.participants) {
        return api.sendMessage(
          "❌ 𝗡𝗼 𝗮𝗰𝘁𝗶𝘃𝗲 𝗹𝗼𝘁𝘁𝗲𝗿𝘆 𝗳𝗼𝘂𝗻𝗱\nPlease start a new lottery first.",
          event.threadID
        );
      }

      const lottery = globalData.lottery;

      // Validate tickets sold
      if (lottery.ticketsSold === 0) {
        return api.sendMessage(
          "❌ 𝗡𝗼 𝘁𝗶𝗰𝗸𝗲𝘁𝘀 𝘀𝗼𝗹𝗱\nCannot draw with zero participants.",
          event.threadID
        );
      }

      // Mark draw as active
      lottery.isDrawActive = true;
      await api.sendMessage(
        "🎰 𝗟𝗢𝗧𝗧𝗘𝗥𝗬 𝗗𝗥𝗔𝗪 𝗦𝗧𝗔𝗥𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n" +
        "✧ 𝗧𝗼𝘁𝗮𝗹 𝗧𝗶𝗰𝗸𝗲𝘁𝘀: " + lottery.ticketsSold + "\n" +
        "✧ 𝗝𝗮𝗰𝗸𝗽𝗼𝘁: " + CURRENCY + JACKPOT.toLocaleString() + "\n" +
        "━━━━━━━━━━━━━━━━━━\n" +
        "Selecting winner...",
        event.threadID
      );

      // Create ticket pool (array of user IDs based on ticket count)
      const ticketPool = [];
      for (const [userID, data] of Object.entries(lottery.participants)) {
        for (let i = 0; i < data.tickets; i++) {
          ticketPool.push(userID);
        }
      }

      // Select random winner
      const winnerID = ticketPool[Math.floor(Math.random() * ticketPool.length)];
      const winnerData = await usersData.get(winnerID);
      const winnerName = winnerData.name;

      // Award jackpot
      await usersData.set(winnerID, {
        money: winnerData.money + JACKPOT
      });

      // Reset lottery
      globalData.lottery = {
        ticketsSold: 0,
        participants: {},
        isDrawActive: false,
        jackpot: JACKPOT
      };

      // Announce winner
      return api.sendMessage(
        "🎉 𝗪𝗜𝗡𝗡𝗘𝗥 𝗔𝗡𝗡𝗢𝗨𝗡𝗖𝗘𝗠𝗘𝗡𝗧 🎉\n" +
        "━━━━━━━━━━━━━━━━━━\n" +
        `🏆 𝗪𝗶𝗻𝗻𝗲𝗿: ${winnerName}\n` +
        `💰 𝗣𝗿𝗶𝘇𝗲: ${CURRENCY}${JACKPOT.toLocaleString()}\n` +
        `🎫 𝗪𝗶𝗻𝗻𝗶𝗻𝗴 𝗧𝗶𝗰𝗸𝗲𝘁: #${Math.floor(Math.random() * lottery.ticketsSold) + 1}\n` +
        "━━━━━━━━━━━━━━━━━━\n" +
        "A new lottery is now open! Buy tickets with !lotterybuy",
        event.threadID
      );

    } catch (error) {
      console.error('[LOTTERYDRAW ERROR]', error);
      // Reset draw status if error occurred
      if (globalData.lottery) {
        globalData.lottery.isDrawActive = false;
      }
      return api.sendMessage(
        "❌ 𝗗𝗿𝗮𝘄 𝗳𝗮𝗶𝗹𝗲𝗱\nAn error occurred while processing the draw. Please try again.",
        event.threadID
      );
    }
  }
};

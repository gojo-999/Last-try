module.exports = {
  config: {
    name: "lotterybuy",
    version: "1.0",
    author: "Dbz_Mahin",
    role: 0,
    shortDescription: "💎 Premium Lottery Ticket Purchase",
    longDescription: "🛒 Buy tickets for the 10 million jackpot lottery",
    category: "economy",
    guide: {
      en: "{p}lotterybuy [quantity]"
    }
  },

  onStart: async function ({ api, event, args, usersData, globalData }) {
    try {
      // Constants
      const TICKET_PRICE = 100000;
      const MAX_PER_USER = 3;
      const TOTAL_TICKETS = 30;
      const JACKPOT = 10000000;

      // Initialize lottery data
      globalData.lottery = globalData.lottery || {
        ticketsSold: 0,
        participants: {},
        isDrawActive: false,
        jackpot: JACKPOT
      };

      const { lottery } = globalData;
      const userID = event.senderID;
      const userData = await usersData.get(userID);
      const currencySymbol = "฿"; // Using Goat Bot's default currency symbol

      // Show lottery info if no args
      if (!args[0]) {
        return api.sendMessage(
          `🎰 𝗟𝗢𝗧𝗧𝗘𝗥𝗬 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 🎰\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `💰 𝗝𝗮𝗰𝗸𝗽𝗼𝘁: ${currencySymbol}${JACKPOT.toLocaleString()}\n` +
          `🎫 𝗧𝗶𝗰𝗸𝗲𝘁 𝗣𝗿𝗶𝗰𝗲: ${currencySymbol}${TICKET_PRICE.toLocaleString()}\n` +
          `👤 𝗠𝗮𝘅 𝗣𝗲𝗿 𝗨𝘀𝗲𝗿: ${MAX_PER_USER} tickets\n` +
          `📊 𝗧𝗶𝗰𝗸𝗲𝘁𝘀 𝗦𝗼𝗹𝗱: ${lottery.ticketsSold}/${TOTAL_TICKETS}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `💡 𝗨𝘀𝗮𝗴𝗲: ${global.GoatBot.config.prefix}lotterybuy [1-3]`,
          event.threadID
        );
      }

      // Check if draw is happening
      if (lottery.isDrawActive) {
        return api.sendMessage(
          `⏳ 𝗟𝗼𝘁𝘁𝗲𝗿𝘆 𝗗𝗿𝗮𝘄 𝗶𝗻 𝗣𝗿𝗼𝗴𝗿𝗲𝘀𝘀!\n` +
          `Please wait until the current draw is complete to buy tickets for the next round.`,
          event.threadID
        );
      }

      // Validate purchase quantity
      const quantity = parseInt(args[0]);
      if (isNaN(quantity) || quantity < 1 || quantity > MAX_PER_USER) {
        return api.sendMessage(
          `❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗤𝘂𝗮𝗻𝘁𝗶𝘁𝘆!\n` +
          `You can only buy between 1-3 tickets at a time.`,
          event.threadID
        );
      }

      // Check user's existing tickets
      const userTickets = lottery.participants[userID]?.tickets || 0;
      if (userTickets + quantity > MAX_PER_USER) {
        return api.sendMessage(
          `⚠️ 𝗧𝗶𝗰𝗸𝗲𝘁 𝗟𝗶𝗺𝗶𝘁 𝗥𝗲𝗮𝗰𝗵𝗲𝗱!\n` +
          `You already have ${userTickets} tickets (max ${MAX_PER_USER}).`,
          event.threadID
        );
      }

      // Check available tickets
      if (lottery.ticketsSold + quantity > TOTAL_TICKETS) {
        return api.sendMessage(
          `🚫 𝗡𝗼𝘁 𝗘𝗻𝗼𝘂𝗴𝗵 𝗧𝗶𝗰𝗸𝗲𝘁𝘀 𝗟𝗲𝗳𝘁!\n` +
          `Only ${TOTAL_TICKETS - lottery.ticketsSold} tickets remaining.`,
          event.threadID
        );
      }

      // Check user's balance
      const totalCost = quantity * TICKET_PRICE;
      if (userData.money < totalCost) {
        return api.sendMessage(
          `❌ 𝗜𝗻𝘀𝘂𝗳𝗳𝗶𝗰𝗶𝗲𝗻𝘁 𝗙𝘂𝗻𝗱𝘀!\n` +
          `You need ${currencySymbol}${totalCost.toLocaleString()}\n` +
          `Your balance: ${currencySymbol}${userData.money.toLocaleString()}`,
          event.threadID
        );
      }

      // Process purchase
      await usersData.set(userID, {
        money: userData.money - totalCost
      });

      // Update lottery data
      lottery.ticketsSold += quantity;
      lottery.participants[userID] = {
        name: userData.name,
        tickets: (lottery.participants[userID]?.tickets || 0) + quantity
      };

      return api.sendMessage(
        `🎉 𝗧𝗶𝗰𝗸𝗲𝘁𝘀 𝗣𝘂𝗿𝗰𝗵𝗮𝘀𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `✧ 𝗧𝗶𝗰𝗸𝗲𝘁𝘀 𝗕𝗼𝘂𝗴𝗵𝘁: ${quantity}\n` +
        `✧ 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝘀𝘁: ${currencySymbol}${totalCost.toLocaleString()}\n` +
        `✧ 𝗬𝗼𝘂𝗿 𝗧𝗶𝗰𝗸𝗲𝘁𝘀: ${userTickets + quantity}/${MAX_PER_USER}\n` +
        `✧ 𝗥𝗲𝗺𝗮𝗶𝗻𝗶𝗻𝗴: ${TOTAL_TICKETS - lottery.ticketsSold}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🍀 𝗚𝗼𝗼𝗱 𝗹𝘂𝗰𝗸 𝗶𝗻 𝘁𝗵𝗲 𝗱𝗿𝗮𝘄!`,
        event.threadID
      );

    } catch (error) {
      console.error('[LOTTERYBUY ERROR]', error);
      return api.sendMessage(
        `❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗽𝘂𝗿𝗰𝗵𝗮𝘀𝗲.\n` +
        `Please try again later.`,
        event.threadID
      );
    }
  }
};

module.exports = {
  config: {
    name: "tax",
    aliases: ["seize", "royaldecree"],
    version: "3.0",
    author: "Dbz_Mahin 👑",
    role: 2, // Strictly admin-only
    category: "economy",
    shortDescription: "🪙 Deduct fixed money from users (Admin Power)",
    longDescription: "Confiscate specific coin amounts from all/specific users",
    guide: {
      en: "{p}tax [amount] [all/@mention]\n{p}tax 5000 all\n{p}tax 10000 @user"
    }
  },

  onStart: async function ({ api, event, args, usersData, message }) {
    const { senderID, mentions } = event;
    const amount = parseInt(args[0]);
    const target = args[1];

    // Royal Validation System 👑
    if (isNaN(amount) || amount <= 0) {
      return message.reply("⚖️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗗𝗲𝗰𝗿𝗲𝗲:\n\n❌ Tax amount must be a positive number!\n💡 Example: {p}tax 5000 @user");
    }

    if (!target) {
      return message.reply(`👑 𝗥𝗼𝘆𝗮𝗹 𝗧𝗮𝘅 𝗠𝗲𝗻𝘂:\n\n⚜️ Usage:\n» {p}tax [amount] all - Tax everyone\n» {p}tax [amount] @user - Target specific subject\n\n💸 Example: {p}tax 10000 all`);
    }

    try {
      let successCount = 0;
      let totalConfiscated = 0;
      const failedList = [];

      // Royal Tax Edict (All Subjects) 👑
      if (target === "all") {
        const allUsers = await usersData.getAll();
        
        for (const user of allUsers) {
          if (user.money >= amount) {
            await usersData.set(user.ID, {
              money: user.money - amount,
              data: user.data
            });
            successCount++;
            totalConfiscated += amount;
          } else {
            failedList.push(user.ID);
          }
        }

        // Royal Proclamation 📜
        let report = `👑 𝗥𝗼𝘆𝗮𝗹 𝗧𝗿𝗲𝗮𝘀𝘂𝗿𝘆 𝗥𝗲𝗽𝗼𝗿𝘁:\n\n💰 𝗔𝗺𝗼𝘂𝗻𝘁 𝗦𝗲𝗶𝘇𝗲𝗱: ${amount.toLocaleString()} coins per subject\n\n`;
        report += `✅ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 𝗖𝗼𝗹𝗹𝗲𝗰𝘁𝗶𝗼𝗻𝘀: ${successCount} users\n`;
        report += `💎 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗻𝗳𝗶𝘀𝗰𝗮𝘁𝗲𝗱: ${totalConfiscated.toLocaleString()} coins\n`;
        
        if (failedList.length > 0) {
          report += `\n❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝗖𝗮𝘀𝗲𝘀: ${failedList.length} paupers (insufficient funds)`;
        }

        report += `\n\n"By order of the Royal Treasury - Resistance is futile."`;
        return message.reply(report);
      }

      // Individual Tax Execution ⚔️
      if (Object.keys(mentions).length > 0) {
        const targetID = Object.keys(mentions)[0];
        const userName = mentions[targetID].replace("@", "");
        const userData = await usersData.get(targetID);

        if (userData.money < amount) {
          return message.reply(`💢 𝗙𝗮𝗶𝗹𝗲𝗱 𝗗𝗲𝗰𝗿𝗲𝗲:\n\n@${userName} only has ${userData.money.toLocaleString()} coins!\n\n⚖️ Royal Law requires at least ${amount.toLocaleString()} coins for confiscation.`);
        }

        await usersData.set(targetID, {
          money: userData.money - amount,
          data: userData.data
        });

        return message.reply(`⚡ 𝗥𝗼𝘆𝗮𝗹 𝗖𝗼𝗻𝗳𝗶𝘀𝗰𝗮𝘁𝗶𝗼𝗻 𝗡𝗼𝘁𝗶𝗰𝗲:\n\n👤 𝗦𝘂𝗯𝗷𝗲𝗰𝘁: @${userName}\n💰 𝗔𝗺𝗼𝘂𝗻𝘁 𝗧𝗮𝗸𝗲𝗻: ${amount.toLocaleString()} coins\n\n"${userName}'s wealth has been... adjusted by royal decree." 👑`);
      }

      return message.reply("⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗧𝗮𝗿𝗴𝗲𝘁!\n\nUse 'all' or mention a user!");

    } catch (error) {
      console.error("💥 Royal Tax Error:", error);
      return message.reply("🔥 𝗘𝗺𝗲𝗿𝗴𝗲𝗻𝗰𝘆 𝗣𝗿𝗼𝗰𝗹𝗮𝗺𝗮𝘁𝗶𝗼𝗻:\n\nThe tax collectors revolted! Command failed.");
    }
  }
};

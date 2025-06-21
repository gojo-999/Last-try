module.exports = {
  config: {
    name: "owner2",
    aliases: ["godmode", "mahin"],
    version: "5.1",
    author: "Mahin", // Changed to your name
    role: 2,
    category: "admin",
    shortDescription: "🔥 | MAHIN'S CONTROL PANEL",
    longDescription: "Display your admin privileges with real-time stats",
    guide: { en: "{p}owner2" }
  },

  onStart: async function ({ api, event, usersData, message }) {
    // Get your REAL-TIME data
    const yourUID = "100030451953891"; // Your actual UID
    const userData = await usersData.get(yourUID);
    const balance = userData.money.toLocaleString();
    const exp = userData.exp.toLocaleString();

    // 🎨 Customized Owner Data
    const ownerData = {
      main: {
        name: "𝐌𝐚𝐡𝐢𝐧", // Your name
        uid:100030451953891,
        title: "🔥 Supreme Developer",
        gender: "♂️ King",
        since: "2025" // When you became admin
      },
      stats: {
        balance: `${balance} coins`, // Real-time balance
        exp: `${exp} XP`,
        power: "███████ 95%", // Customize this
        speed: "⚡ Ultra Instinct"
      },
      abilities: [
        "🛡️ Bypass All Systems",
        "💻 Code Creation",
        "🔮 Future Prediction",
        "👑 Royal Commands"
      ],
      contact: {
        fb: "𝐕𝐚𝐠 𝐒𝐡𝐚𝐥𝐚", // Your real FB
        hours: "24/7 Active"
      }
    };

    // ✨ Stylish Design
    const divider = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    const ownerMessage = `
╔═════◇◆❖◆◇═════╗
       MAHIN'S REALM
╚═════◇◆❖◆◇═════╝

${divider}
👑 𝗖𝗢𝗥𝗘 𝗜𝗡𝗙𝗢
❖ Name » ${ownerData.main.name}
⚡ UID » ${ownerData.main.uid}
♚ Title » ${ownerData.main.title}
♂️ Gender » ${ownerData.main.gender}

${divider}
💎 𝗟𝗜𝗩𝗘 𝗦𝗧𝗔𝗧𝗦
✧ Balance » ${ownerData.stats.balance}
✦ EXP » ${ownerData.stats.exp}
☯ Power » ${ownerData.stats.power}
🌀 Speed » ${ownerData.stats.speed}

${divider}
✨ 𝗔𝗕𝗜𝗟𝗜𝗧𝗜𝗘𝗦
${ownerData.abilities.map(ab => `→ ${ab}`).join('\n')}

${divider}
📞 𝗖𝗢𝗡𝗧𝗔𝗖𝗧
📘 Facebook » ${ownerData.contact.fb}
🕒 Active » ${ownerData.contact.hours}

${divider}
⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚:
"Unauthorized access will be punished"
`;

    await message.reply(ownerMessage);
    await api.react("👑", event.messageID); // Crown reaction
  }
};

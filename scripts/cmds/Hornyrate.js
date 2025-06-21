module.exports = {
  config: {
    name: "hornyrate",
    version: "1.0",
    author: "Mahin",
    category: "fun",
    shortDescription: "How horny are you today? 😳",
    longDescription: "Checks your horny level with a funny emoji scale",
    role: 0,
    guide: "{pn}"
  },

  onStart: async function ({ event, message }) {
    const percent = Math.floor(Math.random() * 101);
    let emoji = "😐";

    if (percent > 80) emoji = "🔞🥵";
    else if (percent > 60) emoji = "🍑💦";
    else if (percent > 30) emoji = "😅";
    else emoji = "😇";

    return message.reply(`❤️ Your Horny Level: ${percent}% ${emoji}`);
  }
};

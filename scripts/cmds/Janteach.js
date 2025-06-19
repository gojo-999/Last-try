const fs = require("fs");
const dbPath = __dirname + "/teachDB.json";

// Load DB from file or create empty
let db = {};
if (fs.existsSync(dbPath)) {
  try {
    db = JSON.parse(fs.readFileSync(dbPath));
  } catch (e) {
    db = {};
  }
} else {
  fs.writeFileSync(dbPath, "{}");
}

module.exports.config = {
  name: "janteach",
  version: "2.0.0",
  role: 0,
  hasPrefix: false,
  aliases: ["jan teach", "janteach", "janlearn"],
  credits: "Mahin",
  description: "Teach the bot something new",
  usages: "jan teach question - answer\njan myteach",
  cooldowns: 3
};

module.exports.onStart = async function ({ api, event, usersData }) {
  const { threadID, senderID, body } = event;
  const input = body.trim();

  if (input.toLowerCase().startsWith("jan myteach")) {
    const teaches = Object.values(db).filter(entry => entry.taughtBy === senderID);
    const count = teaches.length;
    const earned = count * 10000;

    return api.sendMessage(
      `📚 𝗧𝗲𝗮𝗰𝗵 𝗥𝗲𝗰𝗼𝗿𝗱 🧠\n━━━━━━━━━━━━━━\n🧑‍🏫 𝗣𝗵𝗿𝗮𝘀𝗲𝘀 𝗧𝗮𝘂𝗴𝗵𝘁: ${count}\n💸 𝗘𝗮𝗿𝗻𝗲𝗱: $${earned} coins\n━━━━━━━━━━━━━━\n🫶 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝗲𝗱𝘂𝗰𝗮𝘁𝗶𝗻𝗴 𝗝𝗮𝗻𝗕𝗼𝘁!`,
      threadID
    );
  }

  if (!input.toLowerCase().startsWith("jan teach")) return;

  const content = input.slice(9).trim();
  if (!content.includes("-")) {
    return api.sendMessage("❌ Use format: jan teach question - answer", threadID);
  }

  const [q, ...a] = content.split("-");
  const question = q.trim().toLowerCase();
  const answer = a.join("-").trim();

  if (!question || !answer) {
    return api.sendMessage("❌ Please provide both question and answer!", threadID);
  }

  db[question] = {
    answer,
    taughtBy: senderID,
    taughtAt: Date.now()
  };

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  await usersData.addMoney(senderID, 10000);

  return api.sendMessage(
    `✅ 𝗧𝗲𝗮𝗰𝗵𝗶𝗻𝗴 𝗦𝘂𝗰𝗰𝗲𝘀𝘀\n━━━━━━━━━━━━━━\n📖 Question: "${question}"\n💬 Answer: "${answer}"\n💰 You earned: $10,000 coins\n━━━━━━━━━━━━━━\n🤖 JanBot has learned something new!`,
    threadID
  );
};

module.exports.onChat = async function ({ api, event }) {
  const msg = event.body.trim().toLowerCase();
  if (db[msg]) {
    api.sendMessage(db[msg].answer, event.threadID);
  }
};

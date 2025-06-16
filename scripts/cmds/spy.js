const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "spy",
    aliases: ["whoishe", "Damm", "whoami", "atake"],
    version: "1.0",
    role: 0,
    author: " Mahin 😫",
    Description: "Get user information and profile photo",
    category: "information",
    countDown: 10,
  },

  onStart: async function ({
    event,
    message,
    usersData,
    api,
    args,
  }) {
    const uid1 = event.senderID;

    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      uid =
        event.type === "message_reply"
          ? event.messageReply.senderID
          : uid2 || uid1;
    }
    const response = await require("axios").get(
      `${await baseApiUrl()}/baby?list=all`
    );
    const dataa = response.data || { teacher: { teacherList: [] } };
    let babyTeach = 0;

    if (dataa?.teacher?.teacherList?.length) {
      babyTeach = dataa.teacher.teacherList.find((t) => t[uid])?.[uid] || 0;
    }

    const userInfo = await api.getUserInfo(uid);
    const avatarUrl = await usersData.getAvatarUrl(uid);

    let genderText;
    switch (userInfo[uid].gender) {
      case 1:
        genderText = "𝐆𝐢𝐫𝐥🙋🏻‍♀️";
        break;
      case 2:
        genderText = "𝐁𝐨𝐲 🙋🏻‍♂️";
        break;
      default:
        genderText = "𝐆𝐚𝐲🤷🏻‍♂️";
    }

    const money = (await usersData.get(uid)).money;
    const allUser = await usersData.getAll(), rank = allUser.slice().sort((a, b) => b.exp - a.exp).findIndex(user => user.userID === uid) + 1, moneyRank = allUser.slice().sort((a, b) => b.money - a.money).findIndex(user => user.userID === uid) + 1;

    const position = userInfo[uid].type;

    const userInformation = `
         ┌────★────┐
          ♡︎ 𝐔𝐬𝐞𝐫 𝐈𝐧𝐟𝐨 𝐛𝐛𝐲  ♡︎ 
         └────★────┘
┌──────────────────┐
│    ✨ 𝐍𝐚𝐦𝐞: ${userInfo[uid].name.toUpperCase()} ♡︎
│    ${genderText === "𝐆𝐢𝐫𝐥🙋🏻‍♀️" ? "🙋🏻‍♀️" : genderText === "𝐁𝐨𝐲🙋🏻‍♂️" ? "🙋🏻‍♂️" : "🤷🏻‍♂️"} 𝐆𝐞𝐧𝐝𝐞𝐫 : ${genderText}シ︎
│    ✿︎  🆔 𝐔𝐢𝐝: ${uid} ✿︎
│   💌 𝐂𝐥𝐚𝐬𝐬: ${position ? position.toUpperCase() : "𝐍𝐨𝐫𝐦𝐚𝐥 𝐮𝐬𝐞𝐫 🦋𝐌𝐚𝐲𝐛𝐞😒𝐈𝐝𝐤"}
│   😍 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${userInfo[uid].vanity ? userInfo[uid].vanity.toUpperCase() : "𝐍𝐨𝐧𝐞"
│     🦋 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐔𝐫𝐥: ${userInfo[uid].profileUrl}
│     😫𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞 : ${userInfo[uid].alternateName ? userInfo[uid].alternateName.toUpperCase() : "𝐍𝐨𝐧𝐞"}
│     🙈 𝐅𝐫𝐢𝐞𝐧𝐝 𝐰𝐢𝐭𝐡 𝐘𝐮 𝐑𝐢: ${userInfo[uid].isFriend ? "𝐘𝐞𝐬✔️" : "𝐍𝐨❌"}
│                   
└──────────────────┘
        ┌────★────┐
             𝐉𝐚𝐧    𝐬𝐭𝐚𝐭𝐮𝐬
        └────★────┘
┌──────────────────┐
│💰 𝐌𝐨𝐧𝐞𝐲 : $${formatMoney(money)}
│
│🏅𝐁𝐛𝐲 𝐫𝐚𝐧𝐤 : #${rank}/${allUser.length}
│
│🦋𝐘𝐮 𝐑𝐢 𝐌𝐨𝐧𝐞𝐲 𝐑𝐚𝐧𝐤 : #${moneyRank}/${allUser.length}
│
│🍷 𝐁𝐚𝐛𝐲 𝐓𝐞𝐚𝐜𝐡 : ${babyTeach || 0}`;
│
└──────────────────┘
         ┌────★────┐
          😉𝐎𝐰𝐧𝐞𝐫 𝐢𝐬 𝐬𝐢𝐧𝐠𝐥𝐞
         └────★────┘


    message.reply({
      body: userInformation,
      attachment: await global.utils.getStreamFromURL(avatarUrl),
    });
  },
};

function formatMoney(num) {
  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
  let unit = 0;
  while (num >= 1000 && ++unit < units.length) num /= 1000;
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
                                                                          }

module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.2",
		author: "Dbz_Mahin",
		countDown: 5,
		role: 0,
		description: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "view your money or the money of the tagged person"
		},
		category: "economy",
		guide: {
			vi: "   {pn}: xem số tiền của bạn"
				+ "\n   {pn} <@tag>: xem số tiền của người được tag",
			en: "   {pn}: view your money"
				+ "\n   {pn} <@tag>: view the money of the tagged person"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %1$",
			moneyOf: "%1 đang có %2$"
		},
		en: {
			money: "𝐁𝐚𝐛𝐲 𝐲𝐨𝐮𝐫 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐁𝐚𝐥𝐚𝐧𝐜𝐞 𝐢𝐬   %1$  🙈𝐇𝐨𝐩𝐞 𝐲𝐨𝐮 𝐰𝐢𝐥𝐥 𝐢𝐧𝐜𝐫𝐞𝐚𝐬𝐞 𝐢𝐭  ",
			moneyOf: "%1 𝐋𝐢𝐭𝐭𝐥𝐞 𝐛𝐚𝐛𝐲 𝐡𝐚𝐬 𝐜𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲 🙈 %2$"
		}
	},

	onStart: async function ({ message, usersData, event, getLang }) {
		if (Object.keys(event.mentions).length > 0) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				const userMoney = await usersData.get(uid, "money");
				msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney) + '\n';
			}
			return message.reply(msg);
		}
		const userData = await usersData.get(event.senderID);
		message.reply(getLang("money", userData.money));
	}
};

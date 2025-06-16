const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "file",
    aliases: ["files", "sendfile"],
    version: "1.1",
    author: "",
    countDown: 5,
    role: 0,
    shortDescription: "Send bot script",
    longDescription: "Send bot specified file",
    category: "",
    guide: "{pn} Give the file name  Ex' .{pn} filename",
  },

  onStart: async function ({ message, args, api, event }) {
    const permission = ["100088513497761"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("        ", event.threadID, event.messageID);
    }

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage("       ", event.threadID, event.messageID);
    }

    const safeFileName = path.basename(fileName); 
    const filePath = path.join(__dirname, `${safeFileName}.js`);
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`there is no file with this name : ${safeFileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    api.sendMessage({ body: fileContent }, event.threadID);
  }
};

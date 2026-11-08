const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing!");
}

const api = `https://api.telegram.org/bot${token}`;

async function telegram(method, data = {}) {
  const response = await fetch(`${api}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.description);
  }

  return result.result;
}

async function handleMessage(message) {
  if (!message.text) return;

  const chatId = message.chat.id;
  const text = message.text.toLowerCase();

  let reply;

  if (text === "/start") {
    reply = "Welcome to SmartStudyBot! 📚\n\nI can help you study, prepare for exams, make schedules, and practice quizzes.\n\nType /help to see my commands.";
  } else if (text === "/help") {
    reply = "📚 SmartStudyBot Commands\n\n/study - Study guidance\n/exam - Exam preparation\n/schedule - Study schedule\n/quiz - Practice quiz";
  } else if (text === "/study") {
    reply = "📖 What subject would you like help studying?";
  } else if (text === "/exam") {
    reply = "📝 Let's prepare for your exam! Which subject is your exam about?";
  } else if (text === "/schedule") {
    reply = "📅 Let's make a study schedule! Tell me your subjects and available study hours.";
  } else if (text === "/quiz") {
    reply = "🧠 Quiz time! Tell me which subject you want to practice.";
  } else {
    reply = "I'm here to help you learn! Type /help to see what I can do. 📚";
  }

  await telegram("sendMessage", {
    chat_id: chatId,
    text: reply
  });
}

async function startBot() {
  console.log("SmartStudyBot is running!");

  let offset = 0;

  while (true) {
    try {
      const updates = await telegram("getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message"]
      });

      for (const update of updates) {
        offset = update.update_id + 1;

        if (update.message) {
          await handleMessage(update.message);
        }
      }
    } catch (error) {
      console.error("Bot error:", error.message);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

startBot();
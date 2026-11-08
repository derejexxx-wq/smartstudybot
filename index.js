export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("SmartStudyBot is running! 📚");
    }

    if (url.pathname !== "/webhook" || request.method !== "POST") {
      return new Response("Not found", { status: 404 });
    }

    if (
      request.headers.get("X-Telegram-Bot-Api-Secret-Token") !==
      env.WEBHOOK_SECRET
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json();
    const message = update.message;

    if (!message || !message.text) {
      return new Response("OK");
    }

    const chatId = message.chat.id;
    const command = message.text.toLowerCase().trim();

    let reply;

    if (command === "/start") {
      reply = "Welcome to SmartStudyBot! 📚\n\nYour study assistant is ready!\n\nType /help to see my commands.";
    } else if (command === "/help") {
      reply = "📚 SmartStudyBot Commands\n\n/study - Study guidance\n/exam - Exam preparation\n/schedule - Study schedule\n/quiz - Practice quiz";
    } else if (command === "/study") {
      reply = "📖 What subject would you like help studying?";
    } else if (command === "/exam") {
      reply = "📝 Let's prepare for your exam! Which subject?";
    } else if (command === "/schedule") {
      reply = "📅 Tell me your subjects and available study hours.";
    } else if (command === "/quiz") {
      reply = "🧠 Which subject would you like a practice quiz about?";
    } else {
      reply = "I'm here to help you learn! Type /help. 📚";
    }

    await fetch(
      `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply
        })
      }
    );

    return new Response("OK");
  }
};
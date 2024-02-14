document.addEventListener("DOMContentLoaded", function() {
    const chatListItems = document.querySelectorAll(".chatlist li");
    const columnRight = document.querySelector(".column-right");

    chatListItems.forEach(item => {
        item.addEventListener("click", () => {
            chatListItems.forEach(chat => chat.classList.remove("active"));

            item.classList.add("active");

            columnRight.innerHTML = "";

            const chatId = item.innerText;
        });
    });
});

import Handlebars from 'handlebars';

const chatsData = ["chat 1", "chat 2"];

(async () => {
    const templateSource = await fetch("chatlist.hbs").then(response => response.text());
  
    const template = Handlebars.compile(templateSource);
  
    document.getElementById("chatlist-container").innerHTML = template({ chats: chatsData });
  })();
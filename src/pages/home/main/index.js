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

import Handlebars from 'https://cdn.skypack.dev/handlebars@4.7.7';

const chatsData = ["chat 1", "chat 2"];

(async () => {
    const templateSource = `
        {{#each chats}}
            <li>{{this}}</li>
        {{/each}}
        `;
        
    const template = Handlebars.compile(templateSource);
    const renderedHTML = template({ chats: chatsData });
  
    document.getElementById("chatlist-container").innerHTML = renderedHTML;
  })();
import * as Handlebars from 'handlebars';
import {Block} from './block';
import {EventBus} from './eventBus';

export interface ChatData {
  chatname: string;
  data: string;
  photo: string;
  message: string;
  id: string
}

export const renderChatList = (
    chatsData: ChatData[],
    chatlistBlock: Block,
    eventBus: EventBus
): void => {
  const templateSource = `
      {{#each chats}}
      <li class="chat_container" data-chat-id="{{@index}}">
          <div class="avatar_container">
              <img src="{{photo}}" alt="chat's avatar" class="avatar_image">
          </div>
          <div class="dialog_container">
              <div class="dialog_title">{{chatname}}
                  <div class="chat_container__message-data">{{data}}</div>
              </div>
              <div class="dialog_content">{{message}}
              </div>
          </div>
      </li>
      {{/each}}
  `;

  const template = Handlebars.compile(templateSource);
  const renderedHTML = template({chats: chatsData});

  chatlistBlock.render(renderedHTML);

  const chatListItems = chatlistBlock.getElement().querySelectorAll('.chat_container');
  chatListItems.forEach((chatItem) => {
    chatItem.addEventListener('click', (event: Event) => {
      const chatId = (event.currentTarget as HTMLElement).dataset.chatId;
      if (chatId) {
        eventBus.emit('chatSelected', {chatId});
      }
    });
  });
};

import {EventBus} from '../../../scripts/eventBus';
import ChatListBlock from './renderChatlist';
import DialogBlock from './renderDialog';

export interface Chat {
  chatId: string,
  chatName: string;
  data: string;
  photo: string;
  message: string;
}

export const chats = [
  {chatId: '0', chatName: 'Pug Supernova', data: '11:40', photo: '', message: 'Hello!'},
  {chatId: '1', chatName: 'dogs', data: '27.04', photo: '', message: 'Hi there!'},
];

const eventBus = new EventBus();

const chatListBlock = new ChatListBlock({
  chats: chats,
  eventBus: eventBus,
  events: {
    click: (event: MouseEvent) => {
      console.log('Clicked chat info:', event.target);
    },
  },
});

chatListBlock.setProps({
  chats: chats,
  eventBus: eventBus,
  events: {
    click: (event: MouseEvent) => {
      console.log('Clicked chat info:', event.target);
      chatListBlock.handleChatClick(event);
    },
    beforeunload: () => {
      chatListBlock.componentWillUnmount();
    },
  },
});

renderChatlist('#chatlist-container', chatListBlock);

/* const dialogBlock = new DialogBlock({
  chats: chats,
  eventBus: eventBus,
  events: {
    click: (event: MouseEvent) => {
      console.log('chat');
    },
  },

});*/

/**
 * рендерит список чатов в указанный DOM-элемент
 * @param {string} query - селектор DOM-элемента, в который будет добавлен список чатов
 * @param {ChatListBlock} block - блок списка чатов для рендеринга
 * @return {Element} - DOM-элемент, к которому был добавлен список чатов
 * @throws {Error} - ошибка, если не удалось найти элемент с указанным селектором
 */
function renderChatlist(query: string, block: ChatListBlock) {
  const root = document.querySelector(query);
  if (root) {
    root.appendChild(block.getContent());
    return root;
  } else {
    throw new Error(`element with selector ${query} not found`);
  }
}

/**
 * рендерит диалоговый блок в указанный DOM-элемент
 * @param {string} query - селектор DOM-элемента, в который будет добавлен диалоговый блок
 * @param {DialogBlock} block - блок диалога для рендеринга
 * @return {Element} - DOM-элемент, к которому был добавлен диалоговый блок
 * @throws {Error} - ошибка, если не удалось найти элемент с указанным селектором
 */
function renderDialog(query: string, block: DialogBlock) {
  const root = document.querySelector(query);
  if (root) {
    root.appendChild(block.getContent());
    return root;
  } else {
    throw new Error(`element with selector ${query} not found`);
  }
}

eventBus.on('chatSelected', (chatId: string) => {
  renderDialogBlock(chatId);
});

/**
 * создает и рендерит блок диалога для указанного чата
 * @param {string} chatId - id чата, для которого нужно создать и рендерить диалоговый блок
 */
function renderDialogBlock(chatId: string) {
  const selectedChat = chats.find((chat) => chat.chatId === chatId);
  if (selectedChat) {
    const dialogBlock = new DialogBlock({
      eventBus: eventBus,
      chats: chats,
      selectedChat: selectedChat,
      events: {
        click: (event: MouseEvent) => {
          console.log('Click info:', event.target);
          // dialogBlock.handleChatClick(event);
        },
        beforeunload: () => {
          dialogBlock.componentWillUnmount();
        },
      },
    });
    dialogBlock.setProps({
      chats: chats,
      eventBus: eventBus,
      selectedChat: selectedChat,
      events: {
        click: (event: MouseEvent) => {
          console.log('Click info:', event.target);
        },
        beforeunload: () => {
          dialogBlock.componentWillUnmount();
        },
      },
    });
    renderDialog('#dialog-container', dialogBlock);
  }
}

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
  eventBus,
  events: {
    click: (chat) => {
      console.log('Clicked chat info:', chat);
    },
  },
});

const dialogBlock = new DialogBlock({
  eventBus,
  chats: chats,
  events: {
    click: () => {
      console.log('chat');
    },
  },
});

const chatListContainer = document.getElementById('chatlist-container');
const dialogContainer = document.getElementById('dialog-container');

if (chatListContainer && dialogContainer) {
  chatListContainer.innerHTML = chatListBlock.render();
  dialogContainer.innerHTML = dialogBlock.render();
  chatListBlock.addClickListener();
} else {
  console.error('chatlist-container not found');
}

window.addEventListener('beforeunload', () => {
  chatListBlock.componentWillUnmount();
});

window.addEventListener('beforeunload', () => {
  dialogBlock.componentWillUnmount();
});

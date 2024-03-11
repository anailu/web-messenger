import EventBus from '../../../scripts/eventBus';
import ChatListBlock from './renderChatlist';
import DialogBlock from './renderDialog';

export interface Chat {
  chatId: string,
  chatName: string;
  data: string;
  photo: string;
  message: string;
}
const eventBus = new EventBus<Chat>();

export const chatListProps: { chats: Chat[], eventBus: EventBus<Chat> } = {
  chats: [
    {chatId: '0', chatName: 'Pug Supernova', data: '11:40', photo: '', message: 'Hello!'},
    {chatId: '1', chatName: 'dogs', data: '27.04', photo: '', message: 'Hi there!'},
  ],
  eventBus: eventBus,
};

const chatListBlock = new ChatListBlock(chatListProps);
chatListBlock;

eventBus.on('chatSelected', (selectedChat: Chat) => {
  const columnRight = document.getElementById('column-right');
  if (columnRight !== null) {
    columnRight.innerHTML = '';

    const dialogBlock = new DialogBlock({selectedChat, eventBus});
    columnRight.appendChild(dialogBlock.element);
  } else {
    console.error('Элемент не найден');
  }
});

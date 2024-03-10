/* import {Block} from './block';
import {EventBus} from './eventBus';
import {renderChatList, ChatData} from './renderChatlist';
import {renderColumn} from './renderDialog';

const chatlistBlock = new Block('ul');
const columnRightBlock = new Block();
columnRightBlock.getElement().classList.add('column-right_container');
const eventBus = new EventBus();

export const exampleChatsData: ChatData[] = [
  {chatname: 'Pug Supernova', data: '11:40', photo: '', message: 'Hello!', id: '0'},
  {chatname: 'dogs', data: '27.04', photo: '', message: 'Hi there!', id: '1'},
];

renderChatList(exampleChatsData, chatlistBlock, eventBus);

eventBus.on('chatSelected', ({chatId}) => {
  const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);

  if (chatItem instanceof HTMLLIElement) {
    renderColumn(chatItem, columnRightBlock, eventBus, exampleChatsData);

    const existingColumnRight = document.getElementById('column-right');
    if (existingColumnRight) {
      existingColumnRight.innerHTML = '';
      existingColumnRight.appendChild(columnRightBlock.getElement());
    }
  }
});

const chatlistContainer = document.getElementById('chatlist-container');
if (chatlistContainer) {
  chatlistContainer.appendChild(chatlistBlock.getElement());
}
*/

import EventBus from '../../../scripts/eventBus';
import ChatListBlock from './renderChatlist';
import DialogBlock from './renderDialog';
// import DialogRenderer from './renderDialog';
// import { eventBus } from './eventBus';

export interface Chat {
  chatId: string,
  chatName: string;
  data: string;
  photo: string;
  message: string;
}
const eventBus = new EventBus();

export const chatListProps: { chats: Chat[], eventBus: EventBus } = {
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
    console.error('Элемент с id \'columnRight\' не найден');
  }
});

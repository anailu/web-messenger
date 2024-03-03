import {Block} from './block';
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

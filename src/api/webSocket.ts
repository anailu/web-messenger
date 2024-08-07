interface Message {
  id: number;
  user_id: number;
  chat_id: number;
  type: 'message';
  content: string;
  time: string;
}

interface WebSocketData {
  type: string;
  content?: string;
}

/**
 * Класс для управления WebSocket-соединением чата
 */
class ChatWebSocket {
  private url: string;
  private socket: WebSocket | null = null;
  private pingInterval: number | null = null;
  private messageQueue: object[] = [];

  /**
   * Конструктор класса
   * @param {number} userId - ID пользователя
   * @param {number} chatId - ID чата
   * @param {string} token - Токен авторизации
   */
  constructor(userId: number, chatId: number, token: string) {
    this.url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
  }

  /**
   * Устанавливает WebSocket-соединение
   */
  connect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already open');
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      this.startPing();
      this.loadOldMessages(0);

      this.messageQueue.forEach((message) => this.sendMessage(message));
      this.messageQueue = [];
    });

    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Message received:', data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    });

    this.socket.addEventListener('close', (event) => {
      console.log('Close event code:', event.code, 'Reason:', event.reason);
      this.stopPing();
    });

    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error', error);
    });
  }

  /**
   * Загружает старые сообщения
   * @param {number} offset - Смещение для загрузки сообщений
   */
  loadOldMessages(offset = 0): void {
    const message = {
      content: String(offset),
      type: 'get old',
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  /**
   * Отправляет сообщение через WebSocket
   * @param {object} message - Сообщение для отправки
   */
  sendMessage(message: object): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Message queued:', message);
      this.messageQueue.push(message);
    }
  }

  /**
   * Обрабатывает полученные данные от WebSocket
   * @param {WebSocketData | WebSocketData[]} data - Полученные данные
   */
  handleMessage(data: WebSocketData | WebSocketData[]): void {
    console.log('Handle message:', data);

    if (Array.isArray(data)) {
      const messages = data as Message[];

      const existingMessages = window.store.getState().messages || [];
      window.store.set({messages: [...existingMessages, ...messages]});

      if (messages.length < 20) {
        console.log('All messages have been loaded');
      } else {
        this.loadOldMessages(existingMessages.length + messages.length);
      }
    } else {
      console.log('Received data is not an array:', data);
    }
  }

  /**
   * Запускает периодическую отправку ping-сообщений
   */
  startPing() {
    this.pingInterval = window.setInterval(() => {
      this.sendMessage({type: 'ping'});
    }, 50000);
  }

  /**
   * Прекращает периодическую отправку ping-сообщений
   */
  stopPing() {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
    }
  }

  /**
   * Закрывает WebSocket-соединение и останавливает отправку ping-сообщений
   */
  close() {
    this.stopPing();
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default ChatWebSocket;

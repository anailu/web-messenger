import EventBus from '../core/eventBus';
import {User, Message} from '../api/type';

export interface AppState {
  isLoading: boolean;
  loginError: string | null;
  messages: Message[];
  user: User | null;
  selectedCard: any;
}

export enum StoreEvents {
  Updated = 'Updated'
}

/**
 * Хранилище состояния приложения, наследующее EventBus для управления событиями.
 * @extends {EventBus<StoreEvents>}
 */
export class Store extends EventBus<StoreEvents> {
  private static __instance: Store | null = null;
  private state: any;

  /**
   * Создает экземпляр Store.
   * @param {any} defaultState Начальное состояние приложения
   */
  constructor(defaultState: any) {
    super();

    if (Store.__instance) {
      return Store.__instance;
    }

    this.state = defaultState;
    this.set(defaultState);

    Store.__instance = this;
  }

  /**
   * Возвращает текущее состояние приложения.
   * @return {any} Текущее состояние приложения
   */
  public getState() {
    return this.state;
  }

  /**
   * Обновляет состояние приложения и уведомляет подписчиков о событии обновления.
   * @param {Partial<AppState>} nextState Следующее состояние приложения
   */
  public set(nextState: Partial<AppState>) {
    const prevState = {...this.state};

    this.state = {...this.state, ...nextState};

    this.emit(StoreEvents.Updated, prevState, nextState);
  }
}

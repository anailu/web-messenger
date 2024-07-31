import {StoreEvents} from './store';
import isEqual from './isEqual';

/**
 * Функция высшего порядка для соединения компонента с хранилищем состояния.
 * @template State - Тип состояния хранилища.
 * @template P - Тип свойств компонента.
 * @param {*} mapStateToProps - Функция выбирает данные из стора.
 * @param {*} [dispatch] - Об диспатч.
 * @return {function(T): any} принимает компонент и возвращает обернутый, связанный с хранилищем.
 */
export function connect<State, P>(
    mapStateToProps: (state: State) => Partial<P>,
    dispatch?: Record<string, (dispatch: Function, ...args: any[]) => void>
) {
  return function<T extends {new(...args: any[]): any}>(Component: T) {
    return class extends Component {
      private onChangeStoreCallback: () => void;

      /**
       * Конструктор класса, оборачивающего компонент.
       * @param {...any[]} args - Аргументы, передаваемые в конструктор базового компонента.
       */
      constructor(...args: any[]) {
        const [props] = args;
        const store = window.store;
        let state = mapStateToProps(store.getState());

        super({...props, ...state} as any);

        const dispatchHandlers: Record<string, Function> = {};
        Object.entries(dispatch || {}).forEach(([key, handler]) => {
          dispatchHandlers[key] = (...args: any[]) =>
            handler(window.store.set.bind(window.store), ...args);
        });

        this.setProps({...dispatchHandlers});

        this.onChangeStoreCallback = () => {
          const newState = mapStateToProps(store.getState());

          if (!isEqual(state, newState)) {
            this.setProps({...newState});
          }

          state = newState;
        };

        store.on(StoreEvents.Updated, this.onChangeStoreCallback);
      }

      /**
       * Метод, вызываемый перед размонтированием компонента.
       */
      componentWillUnmount() {
        if (super.componentWillUnmount) {
          super.componentWillUnmount();
        }
        window.store.off(StoreEvents.Updated, this.onChangeStoreCallback);
      }
    };
  };
}

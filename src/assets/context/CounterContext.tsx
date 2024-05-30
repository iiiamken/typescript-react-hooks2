import {
  ChangeEvent,
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react"

type StateType = {
  count: number
  text: string
}
export const initState = { count: 0, text: "" }

const enum REDUCER_ACTION_TYPE {
  INCREMENT,
  DECREMENT,
  NEW_INPUT,
}

type ReducerAction = {
  type: REDUCER_ACTION_TYPE
  payload?: string
}

const reducer = (state: StateType, action: ReducerAction): typeof initState => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.INCREMENT:
      return { ...state, count: state.count + 1 }
    case REDUCER_ACTION_TYPE.DECREMENT:
      return { ...state, count: state.count - 1 }
    case REDUCER_ACTION_TYPE.NEW_INPUT:
      return { ...state, text: action.payload ?? "" }
    default:
      throw new Error()
  }
}

//custom hook
const useCounterContext = (initState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initState)

  const increment = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.INCREMENT }),
    []
  )
  const decrement = useCallback(
    () => dispatch({ type: REDUCER_ACTION_TYPE.DECREMENT }),
    []
  )
  const handleTextInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.NEW_INPUT,
      payload: e.target.value,
    })
  }, [])
  return { state, increment, decrement, handleTextInput }
}

// create context
type useCounterContextType = ReturnType<typeof useCounterContext>

//initial state
const initContextState: useCounterContextType = {
  state: initState,
  increment: () => {},
  decrement: () => {},
  handleTextInput: () => {},
}

export const CounterContext =
  createContext<useCounterContextType>(initContextState)

type ChildrenType = {
  children?: ReactElement | undefined
}

export const CounterProvider = ({
  children,
  ...initState
}: ChildrenType & StateType): ReactElement => {
  return (
    <CounterContext.Provider value={useCounterContext(initState)}>
      {children}
    </CounterContext.Provider>
  )
}

//new custom hook

type UseCounterHookType = {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounter = (): UseCounterHookType => {
  const {
    state: { count },
    increment,
    decrement,
  } = useContext(CounterContext)

  return { count, increment, decrement }
}

//new custom hook2
type UseCounterTextHookType = {
  text: string
  handleTextInput: (e: ChangeEvent<HTMLInputElement>) => void
}

export const useCounterText = (): UseCounterTextHookType => {
  const {
    state: { text },
    handleTextInput,
  } = useContext(CounterContext)
  return { text, handleTextInput }
}

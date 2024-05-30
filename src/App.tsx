import Counter from "./assets/Counter"
import { CounterProvider } from "./assets/context/CounterContext"
import { initState } from "./assets/context/CounterContext"

function App() {
  return (
    <>
      <CounterProvider count={initState.count} text={initState.text}>
        <Counter>{(num: number) => <>Current Count: {num}</>}</Counter>
      </CounterProvider>
    </>
  )
}

export default App

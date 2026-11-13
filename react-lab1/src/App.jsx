// The whole app: App → Header, Matrix → Cell, Stats.
// App owns the numbers. Matrix and Stats only receive them as props.
import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
import Stats from "./Stats.jsx";
import { START, incrementAt, decrementAt, zeros } from "./matrix.js";

export default function App() {
  const [matrix, setMatrix] = useState(START);
  useEffect(() => {
    fetch("/matrix.json")
      .then((res) => res.json())
      .then((data) => setMatrix(data));
  }, []);
  const increment = (row, col) =>
    setMatrix((prev) => incrementAt(prev, row, col));
  const decrement = (row, col) =>
    setMatrix((prev) => decrementAt(prev, row, col));
  return (
    <main className="app">
      <Header />
      <div className="board">
        <Matrix
          matrix={matrix}
          onIncrement={increment}
          onDecrement={decrement}
        />
        <Stats matrix={matrix} />
      </div>
    </main>
  );
}

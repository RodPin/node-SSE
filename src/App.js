import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let eventSource = new EventSource("http://localhost:3002/detailWithSSE");
    eventSource.onmessage = (e) => {
      //Parsing JSON cause it comes it string format
      const xCount = JSON.parse(e.data).count;
      setCount(xCount);
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Count {count}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

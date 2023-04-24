import React, {useState} from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);

    if (replace) {
      history.pop();
    }
    
    history.push(newMode);

    return mode;
  };

  function back() {
    if (history.length > 1) {
      history.pop()
    };

    setMode(history[history.length - 1]);
    return mode;
  }

  return { mode, transition, back };
}
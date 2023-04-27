import {useState} from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setHistory(prev => 
      replace ? [...prev.slice(0, -1), newMode] : [...prev, newMode] );

    return setMode(newMode);
  };

  function back() {
    let counter = history.length > 1 ? 2 : 1;
  
    setMode(history[history.length - counter]);
    history.pop();
  }

  return { mode, transition, back };
}

import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // change mode to the newMode string value
  // save the old mode in the history array, optionally replacing the old mode instead
  function transition(newMode, replace = false) {
    setHistory(prev => 
      replace ? [...prev.slice(0, -1), newMode] : [...prev, newMode] );

    return setMode(newMode);
  };

  // return to the previous mode saved in the history array
  // if history only contains one item, return that instead
  function back() {
    let counter = history.length > 1 ? 2 : 1;
  
    setMode(history[history.length - counter]);
    history.pop();
  }

  return { mode, transition, back };
}

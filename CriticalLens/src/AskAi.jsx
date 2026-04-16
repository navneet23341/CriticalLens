import { useState } from "react";
import "./AskAi.css";

function AskAi({ setQuestion, setStep }) {
  const [type, setType] = useState("");

  function handletype(e) {
    setType(e.target.value);
  }

  function handleenter() {
    if (type.trim() === "") return;

    setQuestion(type);   // 🔥 store in App
    setStep(2);          // 🔥 move to next page
  }

  return (<>
      <div className="ProjectName">🔍CriticalLens</div>
      <div className="prompt">Test your thinking, not just your answers</div>
     <div className="AskBlock">
      <div className="suggest">Ask your question...</div>
      <textarea
        className="write"
        onChange={handletype}
        value={type}
      ></textarea>
      <button className="enter" onClick={handleenter}>
        enter
      </button>
    </div>
  </>
   
  );
}

export default AskAi;
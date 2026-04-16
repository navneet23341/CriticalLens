import { useState } from "react";
import "./GuessAns.css"

function GuessAns({ question, setAnswer, setStep, setClaims }) {
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);

  function handleans(e) {
    setAns(e.target.value);
  }

  async function handleSubmit() {
    if (ans.trim() === "") return;

    setAnswer(ans);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answer: ans,
        }),
      });

     const data = await res.json();

      console.log("API DATA:", data);

      if (data && data.claims && data.claims.length > 0) {
        setClaims(data.claims);
      } else {
        setClaims(["No claims returned"]);
      }

      setStep(3);
    } catch (err) {
      console.error(err);
      setClaims(["Error fetching AI"]);
      setStep(3);
    }

    setLoading(false);
  }

  return (
    <>
      <div className="ProjectName">🔍CriticalLens</div>
      <div className="prompt">Think before you see the answer</div>
      <div className="AnswerBlock">
        <div className="ontop">-Write what you THINK the answer is...</div>
        <div className="question">Q - {question}</div>
        <textarea
          className="write"
          onChange={handleans}
          value={ans}
        ></textarea>

        <button className="enter" onClick={handleSubmit}>
          {loading ? "Loading..." : "enter"}
        </button>
    </div>
    </>
  );
}

export default GuessAns;
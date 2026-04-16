import { useEffect, useState } from "react";

function Result({ responses, question }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getEvaluation() {
      try {
        const res = await fetch("http://localhost:3000/api/evaluate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            responses,
          }),
        });

        const data = await res.json();
        setFeedback(data);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    getEvaluation();
  }, []);

  const agreed = responses.filter(r => r.response === "agree").length;

  return (
    <div className="Result">
      <h1>🧠 Thinking Analysis</h1>

      <h2>
        You agreed with {agreed} / {responses.length} claims
      </h2>

      <hr />

      {responses.map((r, i) => (
        <div key={i}>
          <p><b>Claim:</b> {r.claim}</p>
          <p><b>Your Response:</b> {r.response}</p>
        </div>
      ))}

      <hr />

      {loading ? (
        <p>Analyzing your thinking...</p>
      ) : feedback ? (
        <div>
          <h2>🧠 AI Feedback</h2>

          <p><b>Summary:</b> {feedback.summary}</p>

          <p><b>Understanding:</b> {feedback.understanding}</p>

          <div>
            <b>Mistakes:</b>
            <ul>
              {feedback.mistakes?.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No feedback available</p>
      )}
    </div>
  );
}

export default Result;
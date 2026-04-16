import { useState, useEffect } from "react";

function Claim({ claims, setStep, setResponses }) {
  const [index, setIndex] = useState(0);
  const [localResponses, setLocalResponses] = useState([]);

  useEffect(() => {
    setIndex(0);
    setLocalResponses([]);
  }, [claims]);

  if (!claims || claims.length === 0) {
    return <p>Loading...</p>;
  }

  function handleResponse(type) {
    const updated = [
      ...localResponses,
      { claim: claims[index], response: type }
    ];

    setLocalResponses(updated);

    if (index < claims.length - 1) {
      setIndex(i => i + 1);
    } else {
      setResponses(updated); // ⭐ send to App
      setStep(4);            // ⭐ go to result page
    }
  }

  return (
    <div className="Card">
      <div className="content">
        <p>{claims[index]}</p>
      </div>

      <div>
        <button
          className="agree"
          onClick={() => handleResponse("agree")}
        >
          Agree
        </button>

        <button
          className="disagree"
          onClick={() => handleResponse("disagree")}
        >
          Disagree
        </button>
      </div>

      <p>{index + 1} / {claims.length}</p>
    </div>
  );
}

export default Claim;
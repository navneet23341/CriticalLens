import { useState } from "react";
import AskAi from "./AskAi";
import GuessAns from "./GuessAns";
import Claim from "./Claim";
import Result from "./Result";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [claims, setClaims] = useState([]);
  const [responses, setResponses] = useState([]); // ⭐ NEW

  return (
    <>
      {step === 1 && (
        <AskAi setQuestion={setQuestion} setStep={setStep} />
      )}

      {step === 2 && (
        <GuessAns
          question={question}
          setAnswer={setAnswer}
          setStep={setStep}
          setClaims={setClaims}
        />
      )}

      {step === 3 && (
        <Claim
          claims={claims}
          setStep={setStep}
          setResponses={setResponses} // ⭐ NEW
        />
      )}

      {step === 4 && (
        <Result responses={responses} question={question} />
      )}
    </>
  );
}

export default App;
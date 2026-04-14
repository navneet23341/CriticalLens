import { useEffect, useState } from "react"
import "./AskAi.css"

function AskAi(){
    let [type , settype] = useState("");
    let [givenQuestion , setgivenQuestion] = useState();

    function handletype(e){
        settype(e.target.value);
    }

    function handleenter(){

    }

    return(
        <div className="AskBlock">
            <h1>Ask your question...</h1>
            <textarea className="write" onChange={handletype} value={type}></textarea>
            <button className="enter" onClick={handleenter}>enter</button>
        </div>
    )
}

export default AskAi
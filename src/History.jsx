import React, {useState} from "react"
import {nanoid} from "nanoid"

const History = (props) => {
    
    
    const [history, setHistory] = useState(JSON.parse(localStorage.getItem("history")) || [])
    const [bestTime, setBestTime] = useState(localStorage.getItem("bestTime") || 20)
    
    let counter = 0
    let newHistory = history.reverse()

    const board = newHistory.map(save => {
        counter++
        if(counter < 11){
            return <li key={nanoid()}><div>{save.name}</div> - {save.time}seconds & {save.rolls} rolls of dice</li>
        }
    })
    return (
        <div className="cont--board">
            <i className="fa-solid fa-xmark" onClick={props.toogleBoard}></i>
            <p><i className="fa-solid fa-trophy gold"></i> Your best time is {bestTime}s</p>
            <h2>Tenzies History</h2>
            <ol>
                {board}
            </ol>
        </div>
    )
}

export default History
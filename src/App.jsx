import React, {useEffect, useState} from "react"
import Die from "./Die"
import History from "./History"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

const App = () => {
    //Leaderboard
    const [history, setHistory] = useState(JSON.parse(localStorage.getItem("history")) || [])
    const [bestTime, setBestTime] = useState(localStorage.getItem("bestTime") || 20)

    //Player Info
    const [playerName, setPlayerName] = useState('')
    
    const [timerStatus, setTimerStatus] = useState(false)
    const [game, setGame] = useState(false)
    const [restart, setRestart] = useState(true)
    const [tenzies, setTenzies] = useState(false)
    const [dice, setDice] = useState(allNewDice())
    
    //Game Info
    const [rolls, setRolls] = useState(0)
    //const [seconds, setSeconds] = useState(0)
    //const [minutes, setMinutes] = useState(0)
    const [startTime, setStartTime] = useState(0)
    const [runningTime, setRunningTime] = useState(0)
    
    const handleSetName = (event) => {
        setPlayerName(event.target.value)
    }
    
    var timer    
    useEffect(()=>{
        if(timerStatus){
            timer = setInterval(()=>{
                setRunningTime(Math.floor(Date.now() / 1000) - startTime)
                /*setSeconds(seconds+1)
                if(seconds===59){
                    setMinutes(minutes+1)
                    setSeconds(0)
                }*/
            }, 1000)
            return ()=>clearInterval(timer)
        }
    })
    
    const start = () => {
        setTimerStatus(true)
    }
    
    const reset = () => {
        setGame(false)
        setTenzies(false)
        setRestart(true)
        setTimerStatus(false)
        setDice(allNewDice())
        setRolls(0)
        /*
        setSeconds(0)
        setMinutes(0)
        */
    }
    
    const stop = () => {
        setTimerStatus(false)
        clearInterval(timer)
    }
    
    const startGame = () => {
        setGame(true)
        setRestart(false)
        setTimerStatus(true)
        setStartTime(Math.floor(Date.now() / 1000))
    }

    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setRestart(true)
            stop()
            
            if(runningTime < Number(bestTime)){
                localStorage.setItem("bestTime", runningTime)
            }
            
            
            let newSet = history
            newSet.push({name: playerName ? playerName : 'Unknown', rolls: rolls, time: runningTime})
            localStorage.setItem("history", JSON.stringify(newSet))
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: numToWord(Math.ceil(Math.random() * 6)),
            isHeld: false,
            id: nanoid()
        }
        console.log(dice)
    }
    
    function numToWord(number){
        switch(number){
            case 1 : return 'one';
            case 2 : return 'two';
            case 3 : return 'three';
            case 4 : return 'four';
            case 5 : return 'five';
            case 6 : return 'six';
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!restart){
            setRolls(prev => prev + 1)
            if(!tenzies) {
                setDice(oldDice => oldDice.map(die => {
                    return die.isHeld ? 
                        die :
                        generateNewDie()
                }))
            } else {
                setTenzies(false)
                setDice(allNewDice())
            }
        } else{
            reset()
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    const [boardView, setBoardView] = useState(false)
    const toogleBoard = () => {
        setBoardView(boardView => boardView ? false : true)
    }
    
    return (
        boardView ? 
            <div className="board">
                <History toogleBoard={toogleBoard} />
            </div>
            :
            game ?
                <main>
                    {tenzies && <Confetti />}
                    Hi, {playerName ? playerName : 'Player'}!
                    <div className="dice-container">
                        {diceElements}
                    </div>
                    <button 
                        className="roll-dice" 
                        onClick={rollDice}
                    >
                        {tenzies ? "New Game" : "Roll"}
                    </button>
                    <div className="info">
                        <h3>Rolls count: {rolls}</h3>
                        <h3>Timer: {runningTime}s</h3>
                    </div>
                    
                </main>
                :
                    <section>
                        <h1 className="title">Tenzies</h1>
                        <p className="instructions">Roll until all dice are the same. 
                        Click each die to freeze it at its current value between rolls.</p>
                        <div className="container--input">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={playerName}
                                onChange={handleSetName}
                            />
                            <button
                                className="start-game" 
                                onClick={startGame}
                            >Start Game</button>
                            <button
                                className="history" 
                                onClick={toogleBoard}
                            >View History</button>
                        </div>
                    </section>
    )
}

export default App
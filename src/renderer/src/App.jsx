import './assets/index.css'
import { useState, useRef } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import ringer from './assets/sound.wav'
function App() {
  const Timeref = useRef()
  const WorkTime = useRef()
  const BreakTime = useRef()
  const BreakTimeRef = useRef()
  const SessionsRef = useRef()
  const [time, setTime] = useState(`00:25:00`)
  const [breakTime, setBreakTime] = useState('00:05:00')
  const [isBreak, setBreak] = useState(false)
  const [autoStart, setAutoStart] = useState(false)
  const [sessionsNumber, setSessionsNumber] = useState(1)
  const handlesetMiliseconds = (e) => {
    let getmiliseconds = 0
    getmiliseconds += parseInt(e.slice(0, 2)) * 3600000
    getmiliseconds += parseInt(e.slice(3, 5)) * 60000
    getmiliseconds += parseInt(e.slice(6)) * 1000
    return getmiliseconds
  }
  const audio = new Audio(ringer)
  audio.loop = true
  const renderer = ({ hours, minutes, seconds, completed, api }) => {
    if (completed) {
      return <CircularProgressbar className="warning" value={100} text={`Value must be > 0`} />
    }
    return (
      <>
        <CircularProgressbar
          value={
            ((hours * 3600 + minutes * 60 + seconds) / (handlesetMiliseconds(time) / 1000)) * 100
          }
          text={`${hours > 0 ? `${zeroPad(hours)}:` : ''}${
            minutes > 0 ? `${zeroPad(minutes)}:` : ''
          }${zeroPad(seconds)}`}
        />
        <div className="buttons">
          <button
            onClick={() => {
              api.start()
              Timeref.current.readOnly = true
              BreakTimeRef.current.readOnly = true
              SessionsRef.current.readOnly = true
            }}
          >
            Start
          </button>
          <button onClick={() => api.pause()}>Pause</button>
          <button
            onClick={() => {
              api.stop()
              Timeref.current.readOnly = false
              BreakTimeRef.current.readOnly = false
              SessionsRef.current.readOnly = false
              setSessionsNumber(1)
              setBreak(false)
            }}
          >
            Reset
          </button>
        </div>
      </>
    )
  }

  const renderer2 = ({ hours, minutes, seconds, api }) => {
    return (
      <>
        <CircularProgressbar
          className="CircularProgressbar2"
          value={
            ((hours * 3600 + minutes * 60 + seconds) / (handlesetMiliseconds(breakTime) / 1000)) *
            100
          }
          text={`${hours > 0 ? `${zeroPad(hours)}:` : ''}${
            minutes > 0 ? `${zeroPad(minutes)}:` : ''
          }${zeroPad(seconds)}`}
        />
        <div className="buttons">
          <button
            onClick={() => {
              api.start()
              Timeref.current.readOnly = true
              BreakTimeRef.current.readOnly = true
              SessionsRef.current.readOnly = true
            }}
          >
            Start
          </button>
          <button onClick={() => api.pause()}>Pause</button>
          <button
            onClick={() => {
              api.stop()
              Timeref.current.readOnly = false
              BreakTimeRef.current.readOnly = false
              SessionsRef.current.readOnly = false
              setBreak(false)
              setSessionsNumber(1)
            }}
          >
            Reset
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="App">
      {!isBreak && (
        <Countdown
          date={Date.now() + handlesetMiliseconds(time)}
          ref={WorkTime}
          renderer={renderer}
          autoStart={autoStart}
          onComplete={() => {
            if (handlesetMiliseconds(time) > 0) {
              setBreak(!isBreak)
              audio.loop = false
              audio.play()
            }
          }}
        />
      )}
      {isBreak && (
        <Countdown
          ref={BreakTime}
          date={Date.now() + handlesetMiliseconds(breakTime)}
          renderer={renderer2}
          autoStart={true}
          onComplete={() => {
            setBreak(!isBreak)
            if (sessionsNumber > 1) {
              setSessionsNumber(sessionsNumber - 1)
              setAutoStart(true)
              setBreak(!isBreak)
            } else {
              setAutoStart(false)
              Timeref.current.readOnly = false
              BreakTimeRef.current.readOnly = false
              SessionsRef.current.readOnly = false
              setSessionsNumber(1)
            }
          }}
        />
      )}
      <div className="inputs">
        <input
          type="time"
          step="1"
          value={time}
          onChange={(e) => {
            setTime(e.target.value)
          }}
          ref={Timeref}
        />
        <input
          type="time"
          step="1"
          value={breakTime}
          onChange={(e) => {
            setBreakTime(e.target.value)
          }}
          ref={BreakTimeRef}
        />
        <input
          type="number"
          className="sessions"
          min={0}
          max={10}
          ref={SessionsRef}
          value={sessionsNumber}
          onChange={(e) => {
            setSessionsNumber(e.target.value)
          }}
        />
      </div>
    </div>
  )
}

export default App

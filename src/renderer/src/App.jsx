import './assets/index.css'
import { useState, useRef } from 'react'
import Countdown, { zeroPad } from 'react-countdown'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import ringer from './assets/sound.wav'
import Confetti from 'react-confetti'
import SidePanel from './components/Sidepanel'

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
  const [isExploding, setIsExploding] = useState(false)
  const [workTime, setWorkTime] = useState(false)
  const [WorkTimeColor, setWorkTimeColor] = useState('#fc4a4a')
  const [BreakTimeColor, setBreakTimeColor] = useState('#4afc59')
  const [ButtonColor, setButtonColor] = useState('#fc4a4a')
  const [active, setActive] = useState(false)
  console.log(isBreak)
  const handlesetMiliseconds = (e) => {
    let getmiliseconds = 0
    getmiliseconds += parseInt(e.slice(0, 2)) * 3600000
    getmiliseconds += parseInt(e.slice(3, 5)) * 60000
    getmiliseconds += parseInt(e.slice(6)) * 1000
    return getmiliseconds
  }
  const audio = new Audio(ringer)
  audio.loop = true
  const width = window.innerWidth
  const height = window.innerHeight
  const renderer = ({ hours, minutes, seconds, completed, api }) => {
    if (completed) {
      return (
        <CircularProgressbar
          className="warning"
          styles={{
            root: {},
            path: {
              stroke: WorkTimeColor,
              strokeWidth: 5
            },
            text: {
              fill: WorkTimeColor,
              fontSize: '14px'
            },
            background: {
              fill: WorkTimeColor
            },
            trail: {
              stroke: 'transparent'
            }
          }}
          value={100}
          text={`Value must be > 0`}
        />
      )
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
          styles={{
            root: {},
            path: {
              stroke: WorkTimeColor,
              strokeWidth: 5
            },
            text: {
              fill: WorkTimeColor,
              fontSize: '14px'
            },
            background: {
              fill: WorkTimeColor
            },
            trail: {
              stroke: 'transparent'
            }
          }}
        />
        <div className="buttons">
          <button
            onClick={() => {
              api.start()
              Timeref.current.readOnly = true
              BreakTimeRef.current.readOnly = true
              SessionsRef.current.readOnly = true
              setWorkTime(true)
            }}
            style={{ backgroundColor: ButtonColor }}
          >
            Start
          </button>
          <button onClick={() => api.pause()} style={{ backgroundColor: ButtonColor }}>
            Pause
          </button>
          <button
            onClick={() => {
              api.stop()
              Timeref.current.readOnly = false
              BreakTimeRef.current.readOnly = false
              SessionsRef.current.readOnly = false
              setBreak(false)
              setWorkTime(false)
              setIsExploding(false)
            }}
            style={{ backgroundColor: ButtonColor }}
          >
            Reset
          </button>

          {workTime && (
            <button
              onClick={() => {
                setBreak(!isBreak)
                setIsExploding(true)
                audio.loop = false
                audio.play()
              }}
              style={{ backgroundColor: ButtonColor }}
            >
              Skip
            </button>
          )}
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
          styles={{
            root: {},
            path: {
              stroke: BreakTimeColor,
              strokeWidth: 5
            },
            text: {
              fill: BreakTimeColor,
              fontSize: '14px'
            },
            background: {
              fill: BreakTimeColor
            },
            trail: {
              stroke: 'transparent'
            }
          }}
        />
        <div className="buttons">
          <button
            onClick={() => {
              api.start()
              Timeref.current.readOnly = true
              BreakTimeRef.current.readOnly = true
              SessionsRef.current.readOnly = true
            }}
            style={{ backgroundColor: ButtonColor }}
          >
            Start
          </button>
          <button onClick={() => api.pause()} style={{ backgroundColor: ButtonColor }}>
            Pause
          </button>
          <button
            onClick={() => {
              api.stop()
              Timeref.current.readOnly = false
              BreakTimeRef.current.readOnly = false
              SessionsRef.current.readOnly = false
              setBreak(false)
              setIsExploding(false)
            }}
            style={{ backgroundColor: ButtonColor }}
          >
            Reset
          </button>

          <button
            onClick={() => {
              if (sessionsNumber > 1) {
                setSessionsNumber(sessionsNumber - 1)
                setAutoStart(true)
                setBreak(!isBreak)
                setIsExploding(false)
              } else {
                setAutoStart(false)
                Timeref.current.readOnly = false
                BreakTimeRef.current.readOnly = false
                SessionsRef.current.readOnly = false
                setSessionsNumber(1)
                setIsExploding(false)
                setBreak(!isBreak)
              }
            }}
            style={{ backgroundColor: ButtonColor }}
          >
            Skip
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <div
        className="App"
        onClick={() => {
          setActive(false)
        }}
      >
        {isExploding && <Confetti width={width} height={height} tweenDuration={2000} />}
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
                setIsExploding(true)
              }
              if (sessionsNumber == 1) {
                setWorkTime(false)
              }
            }}
            onStart={() => {
              setIsExploding(false)
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
              if (sessionsNumber > 1) {
                setSessionsNumber(sessionsNumber - 1)
                setAutoStart(true)
                setBreak(!isBreak)
                setIsExploding(false)
              } else {
                setAutoStart(false)
                Timeref.current.readOnly = false
                BreakTimeRef.current.readOnly = false
                SessionsRef.current.readOnly = false
                setSessionsNumber(1)
                setIsExploding(false)
                setBreak(!isBreak)
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
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault()
              }
            }}
            className="textinput"
          />
          <input
            type="time"
            step="1"
            value={breakTime}
            onChange={(e) => {
              setBreakTime(e.target.value)
            }}
            ref={BreakTimeRef}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault()
              }
            }}
            className="textinput"
          />
          <input
            type="number"
            className="sessions textinput"
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
      <SidePanel
        isBreak={isBreak}
        workTime={workTime}
        active={active}
        setActive={setActive}
        breakTimeColor={BreakTimeColor}
        workTimeColor={WorkTimeColor}
        setWorkTimeColor={setWorkTimeColor}
        setBreakTimeColor={setBreakTimeColor}
        buttonColor={ButtonColor}
        setButtonColor={setButtonColor}
      />
    </>
  )
}

export default App

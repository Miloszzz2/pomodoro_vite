/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import Settings from '../assets/settings.png'
function SidePanel(props) {
  return (
    <>
      <img
        src={Settings}
        alt="settings"
        className="settings_button"
        onClick={() => {
          props.workTime || props.isBreak === true ? '' : props.setActive(true)
        }}
        style={{
          opacity: props.workTime || props.isBreak === true ? 0 : 1
        }}
      />
      <div className={`${props.active ? 'hidden' : 'visible'} sidepanel `}>
        <h2>SETTINGS</h2>
        <div className="colorinput">
          <label htmlFor="worktimecolor">Work Timer Color</label>
          <input
            type="color"
            name="worktimecolor"
            value={props.workTimeColor}
            onChange={(e) => {
              props.setWorkTimeColor(e.target.value)
            }}
            className="colorinputcustomstyle"
          />
        </div>
        <div className="colorinput">
          <label htmlFor="breaktimecolor">Break Timer Color</label>
          <input
            type="color"
            name="breaktimecolor"
            value={props.breakTimeColor}
            onChange={(e) => {
              props.setBreakTimeColor(e.target.value)
            }}
            className="colorinputcustomstyle"
          />
        </div>
        <div className="colorinput">
          <label htmlFor="breaktimecolor">Buttons Color</label>
          <input
            type="color"
            name="breaktimecolor"
            value={props.buttonColor}
            onChange={(e) => {
              props.setButtonColor(e.target.value)
            }}
            className="colorinputcustomstyle"
          />
        </div>
      </div>
    </>
  )
}

export default SidePanel

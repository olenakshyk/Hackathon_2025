import Map from "./Map/Map"
import style from "./style.module.scss"
import Icon from "./modified_icons/icon"
import { left_arrow } from "./modified_icons/ICONS"
import Panel from "./Panel/Panel"
import { useState } from "react"
import { ConfigProvider } from 'antd';
import "./index.scss"



function App() {

  const [panelOpened, setPanelOpened] = useState<boolean>(false);

  return (
    <ConfigProvider
      button={{style: {
        
      }}}
      collapse={{ style: { outline: "none", userSelect: "none" } }}
    >
      <div className={style.container}>
        <div className={style.logo}>
          
        </div>

        <div className={style.container2}>
          <Map />
          <div>
            <Icon
              className={style.panelToggle}
              path={left_arrow}
              onClick={() => {
                setPanelOpened(true)
              }} />
          </div>
          <Panel opened={panelOpened} setOpened={setPanelOpened} />
        </div>
      </div>
    </ConfigProvider>
  )
}

export default App

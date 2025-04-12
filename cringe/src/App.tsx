import Map from "./Map/Map"
import scss from "./style.module.scss"
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
      <div className={scss.container}>
        <div className={scss.container2}>
          <Map />
          <div>
            <Icon
              className={scss.panelToggle}
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

import Map from "./Map/Map"
import style from "./style.module.scss"
import Icon from "./modified_icons/icon"
import { left_arrow } from "./modified_icons/ICONS"
import Panel from "./Panel/Panel"
import { useEffect, useRef, useState } from "react"
import { ConfigProvider } from 'antd';
import "./index.scss"
import gsap from "gsap"



function App() {

  const [panelOpened, setPanelOpened] = useState<boolean>(false);
  const logoRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (logoRef.current)
      gsap.to(logoRef.current, {
        ease: "power1.out",
        delay: 0.5,
        duration: 1,
        x: 0,
      })
  }, [])

  return (
    <ConfigProvider
      button={{
        style: {

        }
      }}
      collapse={{ style: { outline: "none", userSelect: "none" } }}
    >
      <div className={style.container}>
        <div ref={logoRef} className={style.logo}>
          Карта для броколів 🥦
        </div>

        <div className={style.container2}>
          <Map />
          <div>
            <Icon
              className={style.panelToggle + " " + style.icon_black}
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

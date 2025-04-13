import Map from "./Map/Map"
import style from "./style.module.scss"
import Icon from "./modified_icons/icon"
import { left_arrow } from "./modified_icons/ICONS"
import Panel from "./Panel/Panel"
import { useEffect, useRef, useState } from "react"
import { ConfigProvider } from 'antd';
import "./index.scss"
import gsap from "gsap"
import { filters } from "./Panel/Filter/Filter"

export interface Ifilter { features: string[], types: string[] }

function App() {


  const [filterState, setFilterHook] = useState<Ifilter>()






  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [panelOpened, setPanelOpened] = useState<boolean>(false);
  const logoRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setFilterHook({features: filters.byFeatures, types: filters.byType})
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
          <Map filter={filterState} />
          <div>
            <Icon
              className={style.panelToggle + " " + style.icon_black}
              path={left_arrow}
              onClick={() => {
                setPanelOpened(true)
              }} />
          </div>
          <Panel filterHook={setFilterHook} opened={panelOpened} setOpened={setPanelOpened} />
        </div>
      </div>
    </ConfigProvider>
  )
}

export default App

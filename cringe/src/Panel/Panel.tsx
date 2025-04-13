import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import scss from "./Panel.module.scss"
import style from "../style.module.scss"
import { alien, call, happy_location, left_arrow, right_arrow } from "../modified_icons/ICONS";
import Icon from "../modified_icons/icon";
import { Collapse, CollapseProps } from "antd";
import InfoBlock from "./InfoBlock/InfoBlock";

interface IpanelProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const Panel: React.FC<IpanelProps> = ({ opened, setOpened }) => {

    const collapse1: CollapseProps['items'] = [{
        key: 1,
        label: "Фільтрувати",
        children: <></>
    }]

    const panel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (opened && panel.current)
            gsap.to(
                panel.current,
                { x: '-100%', duration: 1, ease: 'power3.out' }
            )
        else
            gsap.to(
                panel.current,
                { x: '0%', duration: 1, ease: 'power3.out' }
            )

    }, [opened]);

    return <div ref={panel} className={scss.container}>
        <div className={scss.block1}>
            <Icon className={style.icon_btn + " " + scss.close_btn} path={right_arrow} onClick={() => {
                gsap.to(style.panelToggle, {
                    x: "0%",
                    transition: "500ms"
                })
                setOpened(false)
            }} />
            <Icon className={style.icon_btn + " " + scss.acount_btn} path={alien} />
        </div>
        <div className={scss.block2}>
            <Collapse
                expandIconPosition="end"
                size="small"
                className={scss.collapse}
                items={collapse1}
                bordered={false}
                expandIcon={({ isActive }) =>
                    <Icon
                        path={right_arrow}
                        style={{
                            rotate: isActive ? "90deg" : "0deg",
                        }}
                        className={style.icon_btn + " " + scss.collapse_icon} />}
            />
            {}
        </div>

        
        <InfoBlock />



        <div className={scss.block3}>
            <button className={scss.add_location_btn}>
                <Icon path={happy_location} className={style.icon + " " + scss.icon} />
                <div className={scss.text_in_btn} >Додати локацію</div>
            </button>
            <div className={scss.contacts_btn_container}>
                <button className={scss.contacts_btn}>
                    <Icon path={call} className={style.icon + " " + scss.icon} />
                    <div className={scss.text_in_btn} >Контакти</div>
                </button>
            </div>
        </div>
    </div>
}

export default Panel
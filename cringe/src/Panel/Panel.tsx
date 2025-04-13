import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import scss from "./Panel.module.scss";
import style from "../style.module.scss";
import { alien, call, happy_location, left_arrow, right_arrow } from "../modified_icons/ICONS";
import Icon from "../modified_icons/icon";
import { Button, Collapse, CollapseProps, Tooltip } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import IconChangebale from "../modified_icons/iconChangebale";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface IpanelProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const Panel: React.FC<IpanelProps> = ({ opened, setOpened }) => {
  const collapse1: CollapseProps["items"] = [
    {
      key: 1,
      label: "Фільтрувати",
      children: <></>,
    },
  ];

  const panel = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (opened && panel.current)
      gsap.to(panel.current, { x: "-100%", duration: 1, ease: "power3.out" });
    else
      gsap.to(panel.current, { x: "0%", duration: 1, ease: "power3.out" });
  }, [opened]);

  const handleAlienClick = () => {
    navigate("/login"); // Navigate to the login page when the alien icon is clicked
  };

  return (
    <div ref={panel} className={scss.container}>
      <div className={scss.block1}>
        <Icon
          className={style.icon_btn + " " + scss.close_btn}
          path={right_arrow}
          onClick={() => {
            gsap.to(style.panelToggle, {
              x: "0%",
              transition: "500ms",
            });
            setOpened(false);
          }}
        />
        <Icon
          className={style.icon_btn + " " + scss.acount_btn}
          path={alien}
          onClick={handleAlienClick} // Add onClick handler to the alien icon
        />
      </div>
      <div className={scss.block2}>
        <Collapse
          expandIconPosition="end"
          size="small"
          className={scss.collapse}
          items={collapse1}
          bordered={false}
          expandIcon={({ isActive }) => (
            <Icon
              path={right_arrow}
              style={{
                rotate: isActive ? "90deg" : "0deg",
                transition: "200ms",
                stroke: "#3b3b3b",
                filter: "drop-shadow(1px 1px 1px #0e0e0e58)",
              }}
              className={style.icon_btn + " " + scss.collapse_icon}
            />
          )}
        />
      </div>
      <div className={scss.block3}>
        <button className={scss.add_location_btn}>
          <Icon path={happy_location} className={scss.icon} />
          <div>Додати локацію</div>
        </button>
        <div className={scss.contacts_btn_container}>
          <button className={scss.contacts_btn}>
            <Icon path={call} className={scss.icon} />
            <div>Контакти</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
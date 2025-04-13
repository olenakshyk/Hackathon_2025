import React from "react";
import scss from "./Map.module.scss"


const Loading: React.FC = () => {



    return <div className={scss.rotate_container}>
        <div className={scss.rotator}/>
    </div>
}

export const MiniLoading = () => {
    return <div className={scss.mini_rotate_container}>
    <div className={scss.mini_rotator}/>
</div>
}
export default Loading
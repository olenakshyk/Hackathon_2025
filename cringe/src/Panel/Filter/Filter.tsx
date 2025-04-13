import React, { useRef } from "react"

import scss from "./Filter.module.scss"
import style from "../Panel.module.scss"
import { Divider } from "antd"
import { Ifilter } from "../../App"
import { eatingPlaces_type, healthcare_type, service_type, shop_type, stores_type, tourism_type } from "../../modified_icons/ICONS"







export const filters = {
    typeIcons: [shop_type, stores_type, service_type, healthcare_type, tourism_type, eatingPlaces_type],
    typeColors: ["#3399ff", "#000099", "#258e8e", "#990000", "#004d00", "#cc5200"],
    byType: ["Shops", "Stores", "Services", "Healthcare", "Tourism", "EatingPlaces"],
    byTypeLabels: ["Продуктові маркети", "Магазини", "Сервіси", "охорона здоров'я", "Туризм", "Заклади харчування"],
    byFeatures: ["hasRamp", "hasTactilePaving", "hasAdaptiveToilet", "hasElevator", "onFirstFloor"],
    byFeaturesLabels: ["Пандус при вході", "Тактильні елементи", "Адаптовані туалети", "Ліфт", "Перший поверх"]
}

export const Filter: React.FC<{
    filterHook: React.Dispatch<React.SetStateAction<Ifilter | undefined>>
}> = ({ filterHook }) => {

    return <div>
        <Divider orientation="left">Фактор інклюзивності</Divider>

        {filters.byFeaturesLabels.map((label, id) => {
            const divRef = useRef<HTMLDivElement>(null)
            return (<div
                ref={divRef}
                key={id}
                onClick={() => filterHook(el => {
                    const value = filters.byFeatures[id]
                    if (el == undefined)
                        return { features: [value], types: [] }
                    let acc = true
                    el.features.filter(ell => {
                        if (ell == value)
                            acc = false
                    })

                    if (divRef.current)
                        divRef.current.style.borderColor = acc ? "#5a8d59" : "#8d5959"

                    if (acc)
                        return { features: [...el.features, value], types: el.types }
                    return { features: el.features.filter(ell => ell != value), types: el.types }
                })}
                className={scss.item + " " + scss.removed}>
                {label}
            </div>)
        })}

        <Divider orientation="left">Тип закладу</Divider>

        {filters.byTypeLabels.map((label, id) => {

            const divRef = useRef<HTMLDivElement>(null)

            return <div
                ref={divRef}
                key={id}
                onClick={() => filterHook(el => {
                    const value = filters.byType[id]
                    if (el === undefined)
                        return { types: [value], features: [] }
                    let acc = true
                    el.types.filter(ell => {
                        if (ell === value)
                            acc = false
                    })

                    if (divRef.current)
                        divRef.current.style.borderColor = acc ? "#5a8d59" : "#8d5959"

                    if (acc)
                        return { types: [...el.types, value], features: el.features }
                    return { types: el.types.filter(ell => ell != value), features: el.features }
                })}
                className={scss.item}>
                {label}
            </div>
        })}
    </div>
}

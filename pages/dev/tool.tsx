import { Icon } from "@iconify/react"
import { hexToRgb } from "helpers/utils/tools"
import { useState } from "react"

export default function Tool() {

  const [color, setColor] = useState('')
  const [rgbColor, setRgbColor] = useState([0, 0, 0])

  function pickColor() {
    // @ts-ignore
    const ed = new EyeDropper()
    ed.open().then((c) => {
      setColor(c.sRGBHex)
      const { r, g, b } = hexToRgb(c.sRGBHex)
      setRgbColor([r, g, b])
    })
  }

  return(
    <div className="p-3 flex items-center flex-wrap">
      <button onClick={pickColor}>
        Color Picker
      </button>
      {
        color !== '' &&
        <div className="mx-3 flex justify-center items-center [&>span]:ml-3 drop-shadow">
          <p className="w-6 h-6 rounded shadow-md" style={{background: color}}></p>
          <span style={{color: color}}>{ color }</span>
          <Icon onClick={() => navigator.clipboard.writeText(color)} className="cursor-pointer ml-3" icon="carbon:copy" />
          <span style={{color: color}}>{ rgbColor.join(',') }</span>
          <Icon onClick={() => navigator.clipboard.writeText(rgbColor.join(','))} className="cursor-pointer ml-3" icon="carbon:copy" />
        </div>
      }
    </div>
  )
}

import Script from 'next/script'

interface NoDataPropsInterface {
  props?: {
    text?: string
  }
}

export function NoData({props}: NoDataPropsInterface) {
  return(
    <div className="nodata w-full h-full flex flex-col items-center justify-center">
      <Script key={props.text} src="https://kit.fontawesome.com/a89919c58a.js" strategy="beforeInteractive"/>
      <i key={props.text} className="fas fa-inbox text-9xl text-gray-600"></i>
      <span key={props.text} className="text-base text-gray-600">{props?.text || '暂无数据'}</span>
    </div>
  )
}
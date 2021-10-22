import { ReactElement } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from './index'
import qrcode from '../../../public/images/qrcode.jpg'

interface BlogPreviewInterface {
  props: {
    type: boolean
  },
  children: ReactElement
}

export default function BlogPreview({ props, children }: BlogPreviewInterface) {
  return (
    <Layout>
      <div className="blog-preview w-full h-full pb-36">
        <header className='m-6'>
          <p className={`text-2xl text-white rounded-lg p-3 ${props.type ? 'bg-red-300' : 'bg-blue-300'}`}>
            Senar的Blog（{ props.type ? "当前" : '归档' }）
          </p>
        </header>
        {children}
        <footer className="fixed bottom-6 right-12 w-36 align-right flex items-center flex-col text-current">
          <Image src={qrcode} width={168} height={168} />
          <p className="w-full flex items-center justify-between">
            <Link href="https://juejin.cn/user/2770425031433598">掘金</Link>|
            <Link href="https://blog.csdn.net/i_am_a_sb">CSDN</Link>|
            <Link href="https://segmentfault.com/u/ldl9527/articles">SF</Link>
          </p>
        </footer>
      </div>
    </Layout>
  )
}
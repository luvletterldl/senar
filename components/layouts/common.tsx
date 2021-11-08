import { ReactElement } from 'react'
import Link from 'next/link'
import Layout from './index'

interface CommonLayoutInterface {
  props: {
    title?: string
    description?: string
  }
  children: ReactElement
  location: string
}

export default function CommonLayout({ props, children, location }: CommonLayoutInterface) {
  return(
    <Layout props={props}>
      <div className="base-wrapper w-full h-full">
        <header className='m-6'>
          <p>
            Senar的个人网站 » <Link href="/"><span className="cursor-pointer text-red-300">首页</span></Link> » {location} 
          </p>
        </header>
        { children }
      </div>
    </Layout>
  )
}
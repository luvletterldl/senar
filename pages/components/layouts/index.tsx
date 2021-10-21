import Head from 'next/head'
import { HTMLAttributes, ReactElement } from 'react'
import style from '../../../styles/Home.module.css'
interface LayoutProps {
  props?: {
    title?: string
    description?: string
  },
  children: ReactElement,
  mainStyle?: HTMLAttributes<HTMLElement>['style']
}
export default function Layout({ props, children, mainStyle }: LayoutProps) {
  return (
    <div className={style.container}>
      <Head>
        <title>{props?.title || 'Senar的个人网站'}</title>
        <meta name="description" content={props?.description || "Senar的个人网站"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style.main} style={mainStyle}>{ children }</main>
    </div>
  )
}
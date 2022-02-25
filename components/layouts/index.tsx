import Head from 'next/head'
import { HTMLAttributes, ReactElement } from 'react'
import style from '@/styles/Home.module.css'
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
      <Head key={props?.title}>
        <title key={props?.title}>{props?.title || 'Senar的个人网站'}</title>
        <meta key={props?.title} name="description" content={props?.description.substr(0, 300) || "Senar的个人网站"} />
        <link key={props?.title} rel="icon" href="/favicon.ico" />
      </Head>
      <main key={props?.title} className={style.main} style={mainStyle}>{ children }</main>
    </div>
  )
}
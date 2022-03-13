import Link from 'next/link'
import Layout from './index'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { hopscotch as mdStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { MdDirs } from 'helpers/constant/enums'
// hopscotch materialDark materialOceanic vscDarkPlus

interface BlogPreviewInterface {
  props: {
    type: MdDirs
    title?: string
    description?: string
    date?: string
    next?: {
      index?: number,
      name?: string
    }
    prev?: {
      index?: number,
      name?: string
    },
    currentIndex: number
    mds: any[]
  },
  children: unknown
}

const BLOG = '/blog/'

export default function BlogPreview({ props }: BlogPreviewInterface) {
  return (
    <Layout props={props}>
      <div key={props?.title} className="blog-preview w-full h-full">
        <header key={props?.title} className='m-6'>
          <p key={props?.title}>
            Senar的个人网站 » <Link key={props?.title} href="/"><span key={props?.title} className="cursor-pointer text-red-300">首页</span></Link>
          </p>
          <div key={props?.title} className={`text-2xl flex flex-col items-start justify-between text-white rounded-lg p-3 ${props.type ? 'bg-red-300' : 'bg-blue-300'}`}>
            <span key={props?.title} className="whitespace-nowrap">Senar的Blog（{ props.type }）</span>
            <ul key={props?.title} className='text-lg'>
              { props.prev && 
                <li key={props?.title}>上一篇：
                  <Link key={props?.title} href={`${BLOG}${props.type}?index=${props.prev.index}`}>{props.prev.name}</Link>
                </li>}
              { props.next && 
                <li key={props?.title}>下一篇：
                  <Link key={props?.title} href={`${BLOG}${props.type}?index=${props.next.index}`}>{props.next.name}</Link>
                </li> }
            </ul>
          </div>
          {
            props.title && <h1>
              {props.title}
              { props.date && <span className={`${props.type ? 'text-red-300' : 'text-blue-300'} text-sm ml-3`}>{props.date}</span> }
            </h1>
          }
        </header>
        <article key={props?.title} className="pb-60 px-6">
          <ReactMarkdown 
            key={props?.title}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={mdStyle}
                    className="rounded-md"
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
            remarkPlugins={[[remarkGfm]]}
          >
            {props.mds[props.currentIndex].content}
          </ReactMarkdown>
        </article>
        <footer key={props?.title} className="bg-white p-3 rounded-lg shadow-lg fixed bottom-6 right-6 w-36 align-right flex items-center flex-col text-current">
          <img key={props?.title} src="/images/qrcode.jpg" width={168} height={168} alt="微信公众号Senar" />
          <p key={props?.title} className="w-full flex items-center justify-between">
            <Link key={props?.title} href="https://juejin.cn/user/2770425031433598">掘金</Link>|
            <Link key={props?.title} href="https://blog.csdn.net/i_am_a_sb">CSDN</Link>|
            <Link key={props?.title} href="https://segmentfault.com/u/senar">SF</Link>
          </p>
        </footer>
      </div>
    </Layout>
  )
}
import { ReactElement } from 'react'
import Layout from './index'

interface BlogPreviewInterface {
  props: {
    type: boolean
  },
  children: ReactElement
}

export default function BlogPreview({ props, children }: BlogPreviewInterface) {
  return (
    <Layout>
      <div className="blog-preview">
        <header>
          <p className="text-2xl">Senar的Blog（{ props.type ? "当前" : '归档' }）</p>
        </header>
        {children}
        <footer></footer>
      </div>
    </Layout>
  )
}
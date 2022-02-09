import { GetStaticProps } from 'next'
import Link from 'next/link'
import Layout from '@/components/layouts'

export default function Home({ imgUrl }) {
  const backStyle = {
    background: `url(${imgUrl}) no-repeat`,
    backgroundSize: 'cover'
  }
  return (
    <Layout mainStyle={backStyle}>
      <div className="home-card">
        <p>Senar的个人网站</p>
        <Link href="/blog/vue">Vue</Link>
        <Link href="/blog/rust">Rust</Link>
        <Link href="/blog/other">杂谈</Link>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await (await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1')).json()
  return {
    props: {
      imgUrl: `https://www.bing.com${res.images[0].url}`
    }
  }
}
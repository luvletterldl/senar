import Layout from "../components/layouts";

export default function Current () {
  const props = {
    title: 'Senar当前的一些文章',
    description: 'Senar当前的一些文章'
  }
  return (
    <Layout props={props}>
      <div className="current">当前</div>
    </Layout>
  )
}
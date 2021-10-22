import BlogPreview from "../components/layouts/blogPreview";

export default function Current () {
  return (
    <BlogPreview props={{type: true}}>
      <div className="current">当前</div>
    </BlogPreview>
  )
}
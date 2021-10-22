import BlogPreview from "@/components/layouts/blogPreview";

export default function Archive () {
  return (
    <BlogPreview props={{type: false}}>
      <div className="current">归档</div>
    </BlogPreview>
  )
}
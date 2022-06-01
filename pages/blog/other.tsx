import { promises as fs } from 'fs';
import { GetStaticProps } from "next";
import BlogPreview from "@/components/layouts/blogPreview";
import { getBlogProps, mdPageStaticProps } from 'helpers/utils';
import { MdDirs } from 'helpers/constant/enums';
const type = MdDirs.OTHER

export default function OtherBlog ({ mds }) {

  const props = getBlogProps(type, mds)
  
  return (
    <BlogPreview props={props}>
    </BlogPreview>
  )
}

export const getStaticProps: GetStaticProps = async () => await mdPageStaticProps(type, fs)

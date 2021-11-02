import BlogPreview from "@/components/layouts/blogPreview";
import { GetStaticPaths, GetStaticProps } from "next";
import ReactMarkdown from 'react-markdown'
import path from "path";
import { promises as fs } from 'fs';
import dayjs from "dayjs";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { hopscotch as mdStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import { useState } from "react";
import { useRouter } from 'next/router'
import { NoData } from "@/components/common/noData";
// hopscotch materialDark materialOceanic vscDarkPlus

export default function Archive ({ mds }) {

  const router = useRouter();
  const { index } = router.query;

  const [currentIndex, updateCurrentIndex] = useState(0)
  if (mds.length && index && Number(index) !== currentIndex) {
    updateCurrentIndex(Number(index))
  }

  const props = mds.length ? {
    type: false,
    date: dayjs(mds[currentIndex].mdate).format('YYYY-MM-DD HH:mm'),
    title: mds[currentIndex].filename.slice(0, -3),
    description: mds[currentIndex].filename.slice(0, -3) + mds[currentIndex].content,
    prev: currentIndex + 1 >= mds.length ? null : {
      index: currentIndex + 1,
      name: mds[currentIndex + 1].filename.slice(0, -3)
    },
    next: currentIndex - 1 >= 0 ? {
      index: currentIndex - 1,
      name: mds[currentIndex - 1].filename.slice(0, -3)
    } : null
  } : {
    type: false,
    title: '暂无数据',
  }

  return mds.length ? (
    <BlogPreview props={props}>
      <ReactMarkdown 
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
        {mds[currentIndex].content}
      </ReactMarkdown>
    </BlogPreview>
  ) : (
    <NoData />
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const mdDirectory = path.join(process.cwd(), 'public/markdown/archive')
  const filenames = await fs.readdir(mdDirectory)
  const mdsPromises = filenames.length ? filenames.map(async (filename) => {
    const filePath = path.join(mdDirectory, filename)
    const fileContents = await fs.readFile(filePath, 'utf8')
    return {
      filename,
      mdate: (await fs.stat(filePath)).mtime.getTime(),
      filePath,
      content: fileContents,
    }
  }): []
  const mds = filenames.length ? await (await Promise.all(mdsPromises)).sort((a, b) => { return b.mdate - a.mdate }) : []
  return {
    props: {
      mds,
    },
  }
}
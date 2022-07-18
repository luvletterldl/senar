import { MdDirs } from 'helpers/constant/enums';
import path from 'path';
import dayjs from 'dayjs'
import { useRouter } from 'next/router';
import { useState } from 'react';

export function assemblyMdProps(mds: any[], currentIndex: number) {
  return {
    date: dayjs(mds[currentIndex].bdate).format('YYYY-MM-DD HH:mm'),
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
  }
}

export async function mdPageStaticProps(dir: string, fs: any) {
  const mdDirectory = path.join(process.cwd(), `public/markdown/${dir}`)
  const filenames = await fs.readdir(mdDirectory)
  const mdsPromises = filenames.map(async (filename) => {
    const filePath = path.join(mdDirectory, filename)
    const fileContents = await fs.readFile(filePath, 'utf8')
    return {
      filename,
      bdate: (await fs.stat(filePath)).birthtimeMs,
      filePath,
      content: fileContents,
    }
  })
  const mds = await (await Promise.all(mdsPromises)).sort((a, b) => { return b.bdate - a.bdate })
  return {
    props: {
      mds,
    },
  }
}

export function getBlogProps(type: MdDirs, mds: any[]) {
  const router = useRouter();
  const { index } = router.query;
  const [currentIndex, updateCurrentIndex] = useState(0)
  if (index && Number(index) !== currentIndex) {
    updateCurrentIndex(Number(index))
  }
  return { type, mds, currentIndex, ...assemblyMdProps(mds, currentIndex) }
}

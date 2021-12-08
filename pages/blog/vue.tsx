import { promises as fs } from 'fs';

import { useState } from "react";
import { useRouter } from 'next/router'
import { GetStaticProps } from "next";
import BlogPreview from "@/components/layouts/blogPreview";
import { assemblyMdProps, mdPageStaticProps } from 'helpers/utils';
import { MdDirs } from 'helpers/constant/enums';

export default function VueBlog ({ mds }) {

  const router = useRouter();
  const { index } = router.query;
  const [currentIndex, updateCurrentIndex] = useState(0)
  if (index && Number(index) !== currentIndex) {
    updateCurrentIndex(Number(index))
  }
  const props = { type: MdDirs.VUE, mds, currentIndex, ...assemblyMdProps(mds, currentIndex) }

  return (
    <BlogPreview props={props}>
    </BlogPreview>
  )
}

export const getStaticProps: GetStaticProps = async () => await mdPageStaticProps(MdDirs.VUE, fs)
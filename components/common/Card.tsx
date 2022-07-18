import { Icon } from '@iconify/react';
import Link from 'next/link';

interface PropsInterface {
  props: {
    logo: string
    text: string
    link: string
  }
}

export default function Card({ props }: PropsInterface ) {
  return (
    <div className='p-3 w-28 h-28 border rounded cursor-pointer hover:shadow'>
      <Link href={props.link}>
        <div className='flex flex-col items-center'>
          <Icon className="text-3xl" icon={`logos:${props.logo}`} />
          <h4 className='text-slate-900'>{props.text}</h4>
        </div>
      </Link>
    </div>
  )
}

import Card from "@/components/common/Card";

const navagation = {
  runtimes: [
    {
      logo: 'nodejs',
      text: 'nodejs',
      link: 'https://nodejs.org/en/'
    },
    {
      logo: 'deno',
      text: 'deno',
      link: 'https://deno.land/'
    },
    {
      logo: 'bun',
      text: 'bun',
      link: 'https://bun.sh/'
    },
    {
      logo: 'npm',
      text: 'npmjs',
      link: 'https://www.npmjs.com/'
    },
    {
      logo: 'pnpm',
      text: 'pnpm',
      link: 'https://pnpm.io/zh/installation'
    },
    {
      logo: 'javascript',
      text: 'es6',
      link: 'http://es6.ruanyifeng.com/'
    },
  ],
  libs: [
    {
      logo: 'vitejs',
      text: 'vite',
      link: 'https://vitejs.dev/'
    },
    {
      logo: 'vue',
      text: 'vue',
      link: 'https://staging-cn.vuejs.org/'
    },
    {
      logo: 'vueuse',
      text: 'vueuse',
      link: 'https://vueuse.org/'
    },
    {
      logo: 'svelte-icon',
      text: 'svelte',
      link: 'https://svelte.dev/docs'
    },
  ],
  native: [
    {
      logo: 'tauri',
      text: 'tauri',
      link: 'https://tauri.app/'
    },
    {
      logo: 'electron',
      text: 'electron',
      link: 'https://www.electronjs.org/docs/latest'
    },
    {
      logo: 'flutter',
      text: 'flutter',
      link: 'https://book.flutterchina.club/'
    },
  ],
  backend: [
    {
      logo: 'nestjs',
      text: 'nestjs',
      link: 'https://docs.nestjs.com/'
    },
    {
      logo: 'fastify-icon',
      text: 'fastify',
      link: 'https://www.fastify.io/docs/latest/'
    },
    {
      logo: 'express',
      text: 'express',
      link: 'https://expressjs.com/'
    },
  ],
  test: [
    {
      logo: 'vitest',
      text: 'vitest',
      link: 'https://vitest.dev/'
    }
  ],
  community: [
    {
      logo: 'discord-icon',
      text: 'discord',
      link: 'https://discord.com/channels/@me'
    },
    {
      logo: 'twitter',
      text: 'twitter',
      link: 'https://twitter.com/home'
    },
    {
      logo: 'github-icon',
      text: 'github',
      link: 'https://github.com/'
    }
  ]
}

export default function Index() {
  return Object.keys(navagation).map(v => (
    <div key={v} className="[&>h3]:px-3">
      <h3>{ v }</h3>
      <div className="flex flex-wrap">
        {
          navagation[v].map(v => {
            return (
              <div key={v.logo} className='m-3'>
                <Card props={v} />
              </div>
            )
          })
        }
      </div>
    </div>
    )
  )
}

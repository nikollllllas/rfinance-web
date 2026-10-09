import { pluginAxios } from '@kubb/plugin-axios'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { defineConfig } from 'kubb'

const group = { type: 'tag' as const, name: ({ group }: { group: string }) => group }

export default defineConfig({
  input: './openapi/spec.json',
  output: {
    path: './lib/api',
    clean: true,
    format: 'biome',
    lint: 'biome'
  },
  plugins: [
    pluginTs({ output: { path: 'schemas' }, group }),
    pluginAxios({ output: { path: '.' }, group, returnType: 'data' }),
    pluginReactQuery({ output: { path: '.' }, hooks: true, suspense: false, group: { ...group, name: ({ group }) => `${group}/hooks` } })
  ]
})

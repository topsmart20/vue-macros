/* eslint-disable unicorn/prefer-string-replace-all */

import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import glob from 'fast-glob'
import VueMacros from '../src/rollup'
import { ToString, getCode } from './_utils'

describe('Rollup', () => {
  describe('fixtures', async () => {
    const root = resolve(__dirname, '..')
    const files = await glob('tests/fixtures/*.{vue,js,ts}', {
      cwd: root,
      onlyFiles: true,
    })

    for (const file of files) {
      it(file.replace(/\\/g, '/'), async () => {
        const filepath = resolve(root, file)

        const unpluginCode = await getCode(filepath, [
          VueMacros({}),
          ToString,
        ]).catch((err) => err)
        expect(unpluginCode).toMatchSnapshot()
      })
    }
  })
})

import { type MagicString } from '@vue-macros/common'
import { type CallExpression, type Node, type TSType } from '@babel/types'

export type Impl = (ctx: {
  s: MagicString
  offset: number
  resolveTSType(type: TSType): Promise<string | undefined>
}) => {
  walkCall(node: CallExpression, parent: Node): string
  genRuntimeProps(): Promise<undefined | string>
}

export function stringifyArray(strs: string[]) {
  return `[${strs.map((s) => JSON.stringify(s)).join(', ')}]`
}

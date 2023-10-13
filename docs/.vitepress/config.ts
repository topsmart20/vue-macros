import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { pwa } from './configs'
import { getLocaleConfig } from './locale'

export default withPwa(
  defineConfig({
    lastUpdated: true,
    locales: {
      root: getLocaleConfig('en'),
      'zh-CN': getLocaleConfig('zh-CN'),
    },
    themeConfig: {
      search: {
        provider: 'local',
        options: {
          locales: {
            'zh-CN': {
              translations: {
                button: {
                  buttonText: '搜索文档',
                  buttonAriaLabel: '搜索文档',
                },
                modal: {
                  noResultsText: '无法找到相关结果',
                  resetButtonTitle: '清除查询条件',
                  footer: {
                    selectText: '选择',
                    navigateText: '切换',
                    closeText: '关闭',
                  },
                },
              },
            },
          },
        },
      },
    },
    sitemap: {
      hostname: 'https://vue-macros.sxzz.moe',
    },
    pwa,
  })
)

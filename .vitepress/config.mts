import { defineConfigWithTheme } from 'vitepress'
import { withSidebar, generateSidebar } from 'vitepress-sidebar'
import escookConfig from '@escook/vitepress-theme/config'
// import set_sidebar from '@/utils/auto-gen-silibar.mjs'

// vitePress配置
const vitePressConfig = {
  extends: escookConfig,
  base: '/docs-peak/',
  title: "Peak的文档知识库",
  description: "你好 我是Peak",
  head: [["link", { rel: "icon", href: "/icon/preserved.svg" }]],
  themeConfig: {
    musicBall: {
      src: '悬溺.mp3'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '前端知识库', link: '/docs/front-end/js基础/基础整理01' },
      { text: '后端知识库', link: '/docs/back-end/study03' },
      {
        text: '计算机基础', items: [
          {
            text: '计算机网络',
            link: '/docs/computer/network/01、OSI-七层模型'
          },
          {
            text: '数据结构',
            link: '/docs/computer/structure/常见的数据结构'
          },
        ]
      },
      { text: '开源经历', link: '/markdown-examples' },
      { text: '教程', link: '/docs/course/同款笔记搭建' },
    ],

    outlineTitle: '文章目录',
    outline: [2, 6],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Peak12138' },
      { icon: 'gitee', link: 'https://gitee.com/wang-haifeng1213' }
    ]
  },
  vite: {
    ssr: {
      noExternal: ['/@escook/vitepress-theme/', 'vitepress']
    }
  }
}

// 侧边栏配置
const vitePressSidebarOptions = [
  { // 前端
    documentRootPath: 'docs',
    scanStartPath: 'front-end',
    basePath: '/docs/front-end/',
    resolvePath: '/docs/front-end/',
    useTitleFromFileHeading: true,
    collapsed: true
  },
  { // 后端
    documentRootPath: 'docs',
    scanStartPath: 'back-end',
    resolvePath: '/docs/back-end/',
    useTitleFromFrontmatter: true
  },
  { // 计算机网络
    documentRootPath: 'docs',
    scanStartPath: 'computer',
    basePath: '/docs/computer/',
    resolvePath: '/docs/computer/',
    useTitleFromFrontmatter: true,
    collapsed: true
  },

]

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme(withSidebar(vitePressConfig, vitePressSidebarOptions))

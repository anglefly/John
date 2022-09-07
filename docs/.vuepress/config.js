import { defaultTheme } from 'vuepress'

export default {
    title: '一头老母猪',
    description: '一个普普通通平平无奇的前端开发',
    base: "/anglefly/", // 保持和仓库名一致，否则样式失效
    theme: defaultTheme({
        subSidebar: 'auto',
        navbar: [
          { text: "首页", link: "/" },
          { text: "vue", link: "/vue/vue2tovue3", activeMatch: '^/vue/', },
          {
            text: "博客",
            children: [
              { text: "Github", link: "https://github.com/anglefly" }
            ]
          }
        ],
        sidebar:  'auto',
      })
}
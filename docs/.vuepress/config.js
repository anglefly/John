export default {
    title: '一头老母猪',
    description: '一个普普通通平平无奇的前端开发',
    base: "/anglefly/", // 保持和仓库名一致，否则样式失效
    themeConfig: {
        subSidebar: 'auto',
        nav: [
          { text: "首页", link: "/" },
          {
            text: "博客",
            items: [
              { text: "Github", link: "https://github.com/anglefly" }
            ]
          }
        ],
        sidebar: [
            {
              title: "欢迎学习",
              path: "/",
              collapsable: false,  // 是否折叠
              children: [{ title: "博客简介", path: "/" }],
            },
            {
              title: "vue",
              path: "/vue/vue2tovue3",
              collapsable: true,
              children: [
                { title: "vue2转vue3", path: "/vue/vue2tovue3" },
              ]
            } 
          ]
      }
}
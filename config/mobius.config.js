module.exports = {
  template: {
    index: {
      title: 'Hello Mobius UI!',
      fonts: [
        '/statics/fonts/Workbench[wdth,wght].woff2',
        '/statics/fonts/Sixtyfour[wdth,wght].woff2'
      ],
      asyncCss: [
        'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap',
        'https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap',
        'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200;300;400;500;600;700;900&display=swap'
      ],
      css: [],
      scripts: [],
      favicon: '/statics/favicons/thoughts-daily.icon.png',
      headHtmlSnippet: `
        <style>
          body { developer: cigaret; wechat: cigaret_bot; email: kcigaret@outlook.com; }
        </style>
      `,
      bodyHtmlSnippet: `
        <div id="app"></div>
      `,
      // from: https://analytics.google.com/analytics/web/
      googleAnalytics: {
        trackingId: false // UA-XXXX-XX
      },
      // from: https://tongji.baidu.com/sc-web/
      baiduAnalytics: {
        trackingId: false // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      }
    }
  }
}

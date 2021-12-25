<p align="center">
  <a href="#" target="_blank" rel="noopener noreferrer">
    <img width="150" src="./public/assets/thoughts-daily.jpg" alt="Thoughts Daily Logo"/>
  </a>
</p>

<p align="center">
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
  <a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly"></a>
  <a href="https://www.jsdelivr.com/package/gh/we-mobius/mobius-gui"><img src="https://data.jsdelivr.com/v1/package/gh/we-mobius/mobius-gui/badge" alt="Commitizen friendly"></a>
</p>

<p align="center">
  <span style="font-weight: bold; color: hsla(96, 100%, 50%, 100%);">📜 English Doc</span>
  &nbsp;|&nbsp;
  <a href="./docs/readme_zh.md" style="color: hsla(264, 100%, 50%, 100%);">📜 中文文档</a>
</p>

<h1 align="center">Mobius GUI - alpha</h1>

🎨 Reactive & Stream & Driver based UI framework build on Mobius Utils, equiped with neumorphism-derived & utility-first styles.

This repo will shows latest stage of Mobius GUI before I surely complete the first stable version. We are now on the **alpha** stage.

The `alpha` stage means that most (over 70%) of the major features have been developed, and while there are still some uncertainties, there are already far fewer than the `preview` stage.

The main tasks in alpha stage are refining the base examples, developing complex components and writing documentation.

> 💬 Check todos & roadmaps for more information.

For a quickest preview: visit [Mobius GUI preview](https://mobius-gui.21yunbox.com/).

## Details

![Mobius GUI Preview Release 20200406](./public/assets/mobiusui-preview-hybrid-20200406.png)

## Instance

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="#Instance" target="_blank">
          <img width='1000px' src="./public/assets/thoughts-avatar-minaqr-258-circle-8cm.jpg"/>
        </a>
        <p style="width: 100%; text-align: center;">Avatar Center</p>
      </td>
      <td align="center" valign="middle">
        <a href="#Instance" target="_blank">
          <img width="1000px" src="./public/assets/mobius-gui-preview-site-qr.jpg"/>
        </a>
        <p style="width: 100%; text-align: center;">Preview Site</p>
      </td>
      <td align="center" valign="middle">
        <a href="#Instance" target="_blank">
          <img width="1000px" src="./public/assets/empty-seat.png"/>
        </a>
        <p style="width: 100%; text-align: center;">Empty Seat...</p>
      </td>
    </tr>
  </tbody>
</table>

## Documentation

Simple Use Example:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobius CSS</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@we-mobius/mobius-gui@0.1.0/release/styles/mobius.css">
</head>

<body>
  <div class="mobius-width--100vw mobius-height--100vh mobius-layout__vertical">
    <div class="mobius-padding--xl mobius-margin--auto mobius-shadow--normal mobius-rounded--base">
      <div class="mobius-layout__vertical mobius-flex-items--center mobius-select--none">
        <img width="200px" src="./assets/mobius-gui-preview-site-qr.jpg" alt="Scan to preview full feature of Mobius GUI">
        <p class="mobius-text--center mobius-text--xl mobius-font--fantasy">
          <span class="mobius-text--3xl">Hi</span>, developers !
        </p>
        <p>
          Scan to meet full features of Mobius GUI.
        </p>
      </div>
    </div>
  </div>
</body>

</html>
```

Visit 🔗[Simple Use Example](https://mobius-gui-example.21yunbox.com/example.html) to see what it looks like.

Since it's just a **pure CSS library**, you can use it in your own projects with confidence.

However, for insurance purposes, before making sure that you and your team are fully familiar with the 'utility-first' way of CSS organization, it is still recommended that first use it in toy projects.

Here are some tips for you:

- 💻 Read **Design Spec.** and check source code of **Preview Site** to know how to use. ~~In the short term, there won't be a User Guide to show you how to use it exactly.~~ Instructions & Documentation are on the way...
- 💡 For developers who prefer local build to `<link>` tag import, it is recommended to enable server compression in production. Due to the large number of verbose variables, use `gzip` will reduce it from ~110 KB to less than 15 KB (84% compressed, `brotli` done better). ~~Later I will build a public CDN with Gzip opened, you can use it with a simple `<link>` tag in your pages instead of local build.~~ jsDelivr is awesome, just use it.
- ⭐ Star & Watch to follow the latest work I've done. If you have any questions or suggestions, feel free to open an ISSUE (Or you can add my wechat for join our initial community) 🤗

All the relative documentations of detail, pls check `./docs`，which contains:

- [Getting Started](./docs/getting_started.md) - How to Build & How to Use
- [Instructions](./docs/instructions.md) - Instructions
- [Design Specification](./docs/design_specification.md) - Design Specification
- [Todos](./docs/todos.md) - Todos & Roadmaps

## Built With

Mobius GUI is inspired by such great works:

- [Neumorphism](https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6) - Michal Malewicz's creative work
- [tailwindcss](https://github.com/tailwindcss/tailwindcss) - Utility-first CSS framework
- [Mobius Utils](https://github.com/we-mobius/mobius-utils) 🤞
- somthing else...

## Author

- **Cigaret**
  - E-mail: kcigaret@outlook.com
  - wechat: cigaret_bot

## License

This project is licensed under the **GPL-3.0** License - see the [LICENSE](LICENSE) file for details.

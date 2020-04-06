<p align="center">
  <a href="#" target="_blank" rel="noopener noreferrer">
    <img width="150" src="./public/assets/thoughts-daily.jpg" alt="Thoughts Daily Logo"/>
  </a>
</p>

<p align="center">
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
  <a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly"></a>
</p>

<h1 align="center">Mobius UI</h1>

🎨 Mobius UI is a uitility-frist UI framework which inspired by Michal Malewicz's work on [Neumorphism](https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6).

And goes far from UI level. This repo will shows preview of Mobius UI before I surely complete the first stable version.

For a quickest preview: visit [Mobius UI preview](https://we-mobius.github.io/mobius-ui/dist/).

## Details

![Mobius UI Preview Release 20200406](./public/assets/mobiusui-preview-hybrid-20200406.png)

## Documentation

Currently mobius is just a preview version, but you can still try it in toy projects. Here are some tips for that case:

- Check **Design Spec.** and visit **Preview Site** to know how to use. In the short term, there won't be a User Guide to show you how to use it exactly.
- Don't be scared by its size (42 KB for current), although the size after minify is 41 KB. Due to the large number of verbose variables, you can enable gzip to reduce it to only 7 KB (80% compressed). Later I will build a public CDN with Gzip opened, you can use it with a simple `<link>` tag in your pages instead of local build.
- Star & Watch to follow the latest work I've done. Don't be shy to open a ISSUE 🤗

All the relative documentations of detail, pls check `./docs`，which contains:

- [Getting Started](./docs/getting_started.md) - How to Build & How to Use
- [Design Specification](./docs/design_specification.md) - Instruction & Design Specification
- [Todos](./docs/todos.md) - Todos & Roadmaps

## Built With

- [cyclejs](https://github.com/cyclejs/cyclejs) - Great Jobs for handle DOMs functionally and reactively 🤞
- [rxjs](https://github.com/ReactiveX/rxjs) - Reactive programming for JavaScript
- [tailwindcss](https://github.com/tailwindcss/tailwindcss) - Utility-first CSS framework

## Author

- **Cigaret** - *Undergraduate of CUC* - kcigaret@outlook.com

## License

This project is licensed under the **GPL-3.0** License - see the [LICENSE](LICENSE) file for details.

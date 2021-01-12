// default configuration: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js

module.exports = {
  theme: {
    extend: {
      screens: {
        xxl: '1440px'
      },
      colors: {
        dark: {
          lighter: 'var(--dark-color-lighter)',
          normal: 'var(--dark-color-normal)',
          default: 'var(--dark-color-normal)',
          darker: 'var(--dark-color-darker)'
        },
        light: {
          lighter: 'var(--light-color-lighter)',
          normal: 'var(--light-color-normal)',
          default: 'var(--light-color-normal)',
          darker: 'var(--light-color-darker)'
        },
        cigaret: {
          lighter: 'var(--cigaret-color-lighter)',
          normal: 'var(--cigaret-color-normal)',
          default: 'var(--cigaret-color-normal)',
          darker: 'var(--cigaret-color-darker)'
        }
      }
    }
  },
  variants: {},
  plugins: []
}

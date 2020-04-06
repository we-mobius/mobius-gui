module.exports = {
  plugins: [
    require('postcss-import'),
    // precss is a pack of list of plugins, options here can be a mix of these plugin's options
    // for details pls cheouk out: https://github.com/jonathantneal/precss/blob/master/src/index.js
    // require('precss')({ stage: 2 }),

    // wipe off nestings before 'postcss-extend-rule' plugin
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'nesting-rules': true
      }
    }),
    require('postcss-extend-rule')({ name: 'extend' }),
    require('postcss-advanced-variables'),
    require('tailwindcss'),
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'nesting-rules': true
      }
    })
  ]
}

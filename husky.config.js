
// Refer to: https://github.com/typicode/husky
//           & https://github.com/conventional-changelog/commitlint

module.exports = {
  hooks: {
    // Problem: seems due to wins permission settings, sometimes lint-staged may cause file lost
    // Refer to: https://github.com/okonet/lint-staged/issues?utf8=%E2%9C%93&q=permission+denied
    // Solution: instead of lint-staged, use npm script to do the precommit lint check
    // 'pre-commit': 'lint-staged',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
  }
}

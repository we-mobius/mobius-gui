
// Refer to: https://github.com/typicode/husky
//           & https://github.com/conventional-changelog/commitlint

module.exports = {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
};

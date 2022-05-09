module.exports = {
  skip: {
    tag: true,
  },
  //types为Conventional Commits标准中定义，目前支持
  //https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
  types: [
    { type: 'feat', section: '新特性' },
    { type: 'fix', section: 'Bug修复' },
    { type: 'docs', section: '文档' },
    { type: 'chore', section: '配置项', hidden: true },
    { type: 'style', section: '格式', hidden: true },
    { type: 'refactor', section: '重构', hidden: true },
    { type: 'perf', section: '性能', hidden: true },
    { type: 'test', section: '测试', hidden: true },
    { type: 'build', section: '构建', hidden: true },
    { type: 'ci', section: 'CI', hidden: true },
    { type: 'revert', section: '回滚', hidden: true },
    { type: 'conflict', section: '冲突', hidden: true },
  ],
  // compareUrlFormat:
  //   'https://github.com/hand-rongjing/polard-component-library/compare/v1.6.7...{{currentTag}}',
  //hash链接
  // commitUrlFormat: "http://gitlab.cmss.com/BI/{{repository}}/commit/{{hash}}",
  // https://github.com/hand-rongjing/polard-component-library/commit/{{hash}}
  //server-version自动commit的模板
  // releaseCommitMessageFormat:
  //   "build: v{{currentTag}}版本发布 \n\nCode Source From: Self Code \nDescription: \nJira: # \n市场项目编号（名称）：",
  //需要server-version更新版本号的文件
  // bumpFiles: [
  //   {
  //     filename: "MY_VERSION_TRACKER.txt",
  //     // The `plain-text` updater assumes the file contents represents the version.
  //     type: "plain-text",
  //   },
  //   {
  //     filename: "package.json",
  //     // The `json` updater assumes the version is available under a `version` key in the provided JSON document.
  //     type: "json",
  //   },
  // ],
};

---
nav:
  title: 更新日志
  order: 2
---

# 更新日志

## v1.7.7 _(2022-07-15)_

- [添加新建多语言](https://www.tapd.cn/34592457/bugtrace/bugs/view/1134592457001027598)

## v1.7.6 _(2022-07-13)_

- [滚动条问题](https://www.tapd.cn/34592457/bugtrace/bugs/view/1134592457001027502)

### v1.7.5 _(2022-07-07)_

- [工作流预览增加财务共享节点](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074172)
- [EditTable 页码优化](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074622)
- [凭证信息增加修改记录](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074121)
- [表格宽度不超出时，如果没有设置宽度则不显示滚动条](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074677)
- [核算工单增加工作流预览](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074735)

### v1.7.4 _(2022-06-21)_

- [信用体系-行编辑问题](https://www.tapd.cn/34592457/bugtrace/bugs/view/1134592457001027275)

### v1.7.3 _(2022-06-16)_

- [所有文件预览无需携带 token](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074187)

### v1.7.2 _(2022-06-15)_

- [附件问题汇总](https://www.tapd.cn/34592457/bugtrace/bugs/view/1134592457001027176)

### v1.7.1 _(2022-06-09)_

- [自选审批弹框优化](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074013)
- [可编辑表格兼容单独设置属性 disabled](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074074)
- [差旅申请头信息添加“包含节假日”标签](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074295)
- [修复提交自选审批人拖拽框与其他拖拽框同时打开报错问题](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001074341)

### v1.7.0 _(2022-05-25)_

- [表头合并的 Table column 可拖动宽度](https://www.tapd.cn/34592457/bugtrace/bugs/view?bug_id=1134592457001026936)

### v1.6.9 _(2022-05-18)_

- [导入组件修改布尔值显示值](https://www.tapd.cn/34592457/bugtrace/bugs/view/1134592457001026969)
- [修复工作流预览多语言、条件节点气泡提示](https://www.tapd.cn/34592457/bugtrace/bugs/view/1134592457001026950)
- [优化工作流预览样式 ](https://www.tapd.cn/34592457/bugtrace/bugs/view?bug_id=1134592457001026932)

### v1.6.8 _(2022-05-12)_

- CustomTable column render-fn 兼容原来的支持返回 {children, props} 对象 - [【智能审核结果查询】报错】](https://www.tapd.cn/34592457/bugtrace/bugs/view?bug_id=1134592457001026880)
- [Lov 组件支持外部自定义 placeholder](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001073671)
- Lov 组件清除问题修复
- [Lov 组件宽度允许修改](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001073092)
- [工作流自选节点如果选择多个人，可以给这多个人排序审批，实现效果参考目前加签选择多人审批的逻辑](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001073469)
- 优化 multiple，将底层改为对象数据，并支持 labelInValue - [费用预提单财务查询-点击单据详情返回后单据类型变 id](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001073091)
- search-area 处理 multiple,tree_select_model 赋值；固定字段为日期类初始值时报错问题 - [差旅申请单财务查询单据状态多选](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001073000)
- [公司部门树形弹出框，第二次勾选会把第一次清空掉](https://www.tapd.cn/34592457/s/2137493)
- [EditTable 组件列字段超出列宽重叠](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001073764)
- [SearchArea 输入框类型超长内容输入显示超出了页面范围](https://www.tapd.cn/34592457/prong/tasks/view/1134592457001073898)

### v1.6.7

- value_list 增加 optionsFilter 可以在 getSystemValueList 之后再过滤一次 options ([8f13641](https://github.com/hand-rongjing/polard-component-library/commit/8f136418f715630d969eab352e6ce146fb0f70db))

### v1.6.6

- upload-file-list 组件在 ie 下载的时候, 模拟 a 标签打开新窗口来下载, 避免 X-FRAME-OPTIONS: SAMEORIGIN 导致无法下载

### v1.6.5

- 优化工作流弹窗样式 ([47cf62e](https://github.com/hand-rongjing/polard-component-library/commit/47cf62e3f4080febd7ddb3b3649477c3e9717a1f))
- 可编辑表格多选优化 ([61b66fa](https://github.com/hand-rongjing/polard-component-library/commit/61b66fa7450386eeeef7f58acb5e0a74c8649968))
- 附件预览 zIndex 修改 ([a8f0a4c](https://github.com/hand-rongjing/polard-component-library/commit/a8f0a4c5bb9eaaf1f2ad6f9e6210e8f7b3978994))

### v1.6.3

- 避免可编辑表格输入框出现 title 提示
- 表格 dataSource 兼容空值

### v1.6.2

- selectPartLoad 的值是 {label, value}, 必须要拆解出 label -【【验收缺陷】【基础组】公司组-新建数据后页面跳转报错】https://www.tapd.cn/34592457/bugtrace/bugs/view?bug_id=1134592457001026300

### v1.6.1

- cascader 组件修复
- 兼容附件上传数量为空

### v1.6.0

- 预算进度增加多语言
- 可编辑表格校验修复
- 附件类型定义-自定义附件上传数量
- 附件上传提示优化
- 附件上传按钮组件增加附件类型控制

### v1.5.8

- lov 下拉分页问题修复
- 文件预览新增 xls

### v1.5.7

- 表格设置列样式修改
- 值列表下拉表格，滚动后关闭弹框，需还原滚动位置避免触发 onPopupScroll
- ie 日期搜索条件样式修改
- ie 浏览器搜素条件下拉显示错位
- ie 搜索框宽度处理

### v1.5.4

- 表格列表设置，若修改了列字段，再开发新字段，界面上选不到需重置
- 查询列表返回页码问题
- 审批历史样式修改
- 可编辑表格 lov 的 label 取值优化
- 可编辑表格增加缓存

### v1.5.3

- lov 三列多选问题修复
- 搜索组件重置修复
- 项目类型定义-列表同一行水平不对齐
- internet explorer 打开搜索条件区域或重叠
- custom-table 表格最后一列文字被设置按钮遮挡
- 付款申请单财务查询查询条件多语言

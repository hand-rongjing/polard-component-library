/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-22 15:13:14
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-07-15 11:07:08
 * @Version: 1.0.0
 * @Description: 定义公有的多语言
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

/**
 *
 * （想法）TODO: 全部抽离到这里是想后续某天，可以将locale下的做得更加灵活，
 * 目前仅打算支持 中文，英文；如果后续要支持更多的语言，可以考虑由项目定义好，
 * 然后借助localeProvider传入
 */
export default {
  'common.please.enter': '请输入',
  'common.please.select': '请选择',
  'common.all': '全部',
  'common.cannot.be.less.than': '不能小于',
  'common.no.empty': '{name}不可为空',
  'common.no.matching.result': '无匹配结果',
  'common.fold': '收起',
  'common.expand': '展开',
  'common.Illegal.digital': '{label}为非法数字',
  'common.search': '搜索',
  'common.reset': '重置',
  'common.enabled': '启用',
  'common.disabled': '禁用',
  'common.fill.in.multilingual': '填写多语言',
  'common.no.more.than.limit': '最多输入{number}个字符',
  'common.approval.history': '审批历史',
  'common.print': '打印',
  'common.select.export.column': '请选择导出列',
  'column.name': '列名',
  'common.columns.to.export': '选择要导出的列',
  'common.export': '导出',
  'common.cancel': '取消',
  'common.export.as': '导出为',
  'common.clear': '清空',
  'common.save': '保存',
  'common.submit': '提交',
  'common.approver': '审批人',
  'common.select.staff': '选择人员',
  'common.staff.code': '人员代码',
  'common.staff.name': '人员名称',
  'common.please.enter...': '请输入...',
  'common.checking.search.field.warning': '存在搜索字段未符合校验逻辑',
  'common.set.successfully': '设置成功',
  'common.delete.filter': '删除筛选条件',
  'common.delete.confirm': '确认删除此条件吗？删除后，以后将无法继续使用此筛选',
  'common.delete.success': '删除成功',
  'common.save.success': '保存成功',
  'common.default': '默认',
  'common.modified': '已修改',
  'common.set.default': '设置默认',
  'common.rename': '重命名',
  'common.save.as': '另存为',
  'common.ok': '确定',
  'common.create': '新建',
  'common.clear.selected': '清除已选',
  'common.set.key.before.save': '请先设置唯一值以关联筛选条件和当前页面',
  'common.rename.filter.criteria': '重命名筛选条件',
  'common.new.filter': '新建筛选条件',
  'common.set.filter.criteria.name': '设置筛选条件名称',
  'common.need.condition.name': '请输入条件名称',
  'common.name.of.warning': '请输入筛选条件名称！',
  'common.name.spaces.warning': '筛选条件名称不能全为空格！',
  'common.add.filter': '添加筛选条件',
  'common.accounting.selected': '已选 {count} 项',
  'common.return': '返回',
  'common.edit': '编辑',
  'common.base.info': '基本信息',
  'common.doc.preview.warning': '该文档无法预览！',
  'common.doc.converting': '该文档正在转换中,请稍后刷新页面重试。',
  'common.doc.conversion.failed': '该文档转换失败,无法预览！',
  'common.download': '下载',
  'common.enlarge': '放大',
  'common.narrow': '缩小',
  'common.rotate': '旋转',
  'common.delete': '删除',
  'common.upload.info': '点击或将文件拖拽到这里上传',
  'common.upload.support.ext': '支持扩展名',
  'common.pic.size.warning': '图片尺寸不符合要求',
  'common.size.big.warning': '尺寸不可大于',
  'common.size.small.warning': '尺寸不可小于',
  'common.attachment.size.limit': '请选择小于{size}{unit}的附件',
  'common.attachment.size.lower': '请选择大于{size}{unit}的附件',
  'common.upload.failed.reason':
    '上传失败，当前附件类型格式设置不支持此类附件格式上传',
  'common.upload.success': '上传成功',
  'common.upload.fail': '上传失败',
  'common.upload.not.allowed.delete': '该状态不允许删除附件',
  'common.operate.success': '操作成功',
  'common.upload.attachment': '附件上传',
  'common.preview': '预览',
  'common.confirm.to.delete': '确定要删除吗？',
  'common.compressed.package.preview': '压缩包预览',
  'common.attachment.upload.instructions': '附件上传说明',
  'common.upload.attachment.format': '可上传附件格式',
  'common.size.of.attachments': '可上传附件大小',
  'common.attachment.any.size': '任意大小',
  'common.attachment.template': '附件模板',
  'common.click.to.upload': '点击上传附件',
  'common.upload.num': '上传失败，最多上传{num}个附件',
  'common.upload.size.range': '上传失败，文件大小应在{range}范围内',
  'common.description': '说明',
  'common.voucher.date': '凭证日期',
  'common.currency': '币种',
  'common.original.currency.debit': '原币借方',
  'common.original.currency.credit': '原币贷方',
  'common.local.currency.debit': '本币借方',
  'common.local.currency.credit': '本币贷方',
  'common.large.class': '大类',
  'common.name': '名称',
  'common.application.type': '申请类型',
  'common.total.of.results': '共{total}条结果',
  'common.total': '共{total}条',
  'common.recently.used': '最近使用',
  'common.line.number': '行号',
  'common.tips': '提示信息',
  'common.reasons.for.submission': '提交原因',
  'common.no.quality.inspection': '未质检',
  'common.under.quality.inspection': '质检中',
  'common.state.finish': '已完成',
  'common.close': '关闭',
  'common.entered': '已录入',
  'common.in.volume': '已成册',
  'common.in.the.book': '成册中',
  'common.entering': '录入中',
  'common.being.destroyed': '销毁中',
  'common.destroyed': '已销毁',
  'efs.boxed': '已入盒',
  'efs.Warehoused': '已入库',
  'common.editing': '编辑中',
  'common.approving': '审批中',
  'common.withdraw': '撤回',
  'common.auditing': '审核中',
  'common.approve.rejected': '审批驳回',
  'common.approved': '审核通过',
  'common.audit.reject': '审核驳回',
  'common.approve.pass': '审批通过',
  'common.pending': '暂挂中',
  'common.canceled': '已取消',
  'common.reviewed': '复核通过',
  'common.rejection.of.review': '复核驳回',
  'common.review.post': '复核(过账)',
  'common.recoil.submitted': '反冲提交',
  'common.recoil.audit': '反冲审核',
  'common.cancel.pending': '取消暂挂',
  'common.pay': '支付',
  'common.payment.return': '退款',
  'common.refund': '退票',
  'acp.payment.reserved': '反冲',
  'common.copy.success': '复制成功',
  'common.attachments': '附件',
  'base.duplicate.odd.number': '复制单号',
  'common.amount': '金额',
  'common.comment': '备注',
  'common.sequence': '序号',
  'budget.control.method': '预算控制方法',
  'common.verification.info': '校验信息',
  'common.budget.verification.info': '预算校验信息',
  'common.got.it': '知道了',
  'common.budget.version': '预算版本',
  'common.budget.structure': '预算表',
  'common.budget.scenarios': '预算场景',
  'common.period': '期间',
  'common.control.period': '控制期段',
  'common.budget.item': '预算项目',
  'common.expense.type': '费用类型',
  'common.company': '公司',
  'common.company.group': '公司组',
  'common.department': '部门',
  'common.department.group': '部门组',
  'common.responsibility.center': '责任中心',
  'common.responsibility.center.group': '责任中心组',
  'common.user': '员工',
  'common.user.group': '员工组',
  'common.budget.item.type': '预算项目类型',
  'common.budget.item.group': '预算项目组',
  'common.budget.amt': '预算额',
  'common.budget.rsv': '保留额',
  'common.budget.usd': '发生额',
  'common.budget.avb': '可用额',
  'common.budget.schedule': '预算进度',
  'common.budget.progress.info': '预算进度信息',
  'exp.type.of.category': '单据大类',
  'common.a': '个',
  'common.batch.download': '附件批量下载',
  'common.choose.download.format': '选择下载格式',
  'common.to.pdf.merge': '转pdf合并',
  'common.original.compression': '原件压缩',
  'common.total.files': '共{number}个文件',
  'common.column.status': '状态',
  'base.successful': '成功',
  'base.fail': '失败',
  'common.error.message': '错误信息',
  'common.status': '状态: {status}',
  'common.spanned.file': '正在生成文件',
  'common.import': '导 入',
  'common.choose.file': '选择文件',
  'base.strip': '条',
  'common.tpl.info.warning': '未定义相关模板信息',
  'common.upload.excel': '请上传Excel文件',
  'common.click.tip': '点击【导入】后将导入成功的数据进行保存',
  'common.upload.again': '请修改错误数据后，重新上传',
  'common.control.results.on.submission': '提交时控制结果',
  'common.please.enter.a.filter.name': '请输入筛选条件名称',
  'common.filter.name.set.first': '请先设置筛选条件名',
  'common.operation': '操作',
  'common.info': '提示',
  'common.table.search.warning':
    '您当前有未保存的更改，如果执行搜索，数据将会重置。',
  'common.table.save.warning': '您当前有未保存的更改，如果跳转数据将会重置。',
  'common.table.new.warning': '有未保存的数据，请先保存！',
  'common.import.success': '导入成功',
  'common.delete.warning': '确认删除？',
  'common.show.total': '显示{range0}-{range1} 共{total}条',
  'common.copy': '复制',
  'common.cancel.fix': '取消固定',
  'common.left.fix': '左固定',
  'common.right.fix': '右固定',
  'common.left.side.fix': '固定在左侧',
  'common.right.side.fix': '固定在右侧',
  'common.no.fix': '不固定',
  'base.establish': '创建',
  'common.download.import.template': '下载导入模板',
  'base.has.choose.count': '已选择 {count} 条',
  'base.count.options': '{count}个选项',
  'common.download.error.data': '下载错误数据',
  'common.yes': '是',
  'common.no': '否',
  'common.has.selected': '已选',
  'common.not.selected': '未选',
  'base.sync.check.subsidiary': '同时勾选下属公司',
  'base.selected.limit.warning': '所选数据不能超过 {count} 条',
  'base.policy.verification.info': '政策校验信息',
  'common.input.name.or.code': '请输入代码或名称',
  'chooser.data.company': '选择公司',
  'common.to.configuration': '前往配置',
  'common.upload.max.num': '最多上传{fileNum}个文件',
  'common.size.of.attachment': '每个附件大小为{upperLimitSize}{unit}',
  'common.size.of.attachment.within':
    '每个附件大小在{lowerLimitSize}{unit}~{upperLimitSize}{unit}以内',
  'common.size.of.attachment.not.less.than':
    '每个附件大小不小于{lowerLimitSize}{unit}',
  'common.size.of.attachment.in': '每个附件大小在{upperLimitSize}{unit}以内',
  'full.screen': '全屏',
  'full.screen.exit': '退出全屏',
  'pre.page': '上一页',
  'next.page': '下一页',
  'common.view.flow.chart': '查看流程图',
  'common.view.flow.remark':
    '注：审批流预览按当前工作流显示，但实际会根据配置变化而改变。',
  'approve.flow.preview': '审批流预览',
  'close.approve.flow.view': '收起审批流预览',
  'common.approve': '审批',
  'common.pending.approval': '待审批',
  'common.end': '结束',
  'workflow.preview': '工作流预览',
  'workflow.node': '节点',
  'workflow.no.settings': '暂无设置',
  'workflow.approval.chain': '审批链',
  'workflow.view.approval.chain': '查看审批链',
  'workflow.dispatch': '调度',
  'workflow.scheduling.plan': '调度计划',
  'workflow.intelligence': '智能',
  'workflow.not.through': '不经过',
  'workflow.node.not.participate': '该节点不参与审批操作',
  'workflow.approval.record': '审批记录',
  'workflow.robot': '机器人',
  'workflow.self.selected.node': '自选节点',
  'workflow.arrived': '已到达',
  'workflow.custom.approval': '自选审批',
  'company.maintain.company.companyLevelName': '公司级别',
  'common.view': '查看',
  'base.sync.check.subsidiary.department': '同时勾选下级部门',
  'common.simultaneous.approval': '同时审批',
  'common.sequential.approval': '顺序审批',
  'peripheral.including.holidays': '包含节假日',
  'common.before.modification': '修改前',
  'common.auditing.people': '审核人',
  'workflow.financial.sharing': '财务共享',
};

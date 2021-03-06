/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-26 11:26:12
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-03-30 14:30:55
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

export const modelInfoMap = {
  '1001': { color: '#4390FF' }, // 分配
  SUBMIT: { color: '#4390FF' }, // 提交
  '1003': { color: '#4390FF' }, // 撤回
  '2004': { color: '#EA4343' }, // 审批退回
  '1002-WORKBENCH': { color: '#3ABFA5' }, // 工作台1002：审核通过
  '1002-WORKFLOW': { color: '#4390FF' }, // 工作流1002：撤回
  PASS: { color: '#3ABFA5' }, // 审批通过
  '2001': { color: '#3ABFA5' }, // 审批通过
  '2002': { color: '#EA4343' }, // 审批驳回
  REJECT: { color: '#EA4343' }, // 审批驳回
  '6001': { color: 'yellow' }, // 暂挂中
  CON_CANCEL: { color: '#EA4343' }, // 已取消（合同取消）
  CON_FINISH: { color: '#3ABFA5' }, // 已完成（合同完成）
  '6004': { color: '#4390FF' }, // 取消暂挂
  APPLICATION_CLOSE: { color: '#EA4343' }, // 关闭（费用申请单关闭）
  TRAVEL_APPLICATION_CLOSE: { color: '#EA4343' }, // 关闭（差旅申请单关闭）
  PAYMENT: {
    color: '#4390FF',
    dot: 'pay-circle-o',
  }, // 支付
  '9002': {
    color: '#4390FF',
    dot: 'down-circle-o',
  }, // 退款
  REFUND: {
    color: '#EA4343',
    dot: 'down-circle-o',
  }, // 退票
  '9004': {
    color: '#4390FF',
    dot: 'clock-circle-o',
  }, // 反冲
  CON_CHANGE: {
    color: '#4390FF',
    dot: 'down-circle-o',
  }, // 变更
  PAYMENT_SUBMIT: { color: '#4390FF' }, // 发起支付
  '9999': { color: '#D5DAE0', isPending: true }, // 待处理
  '9998': { color: '#D5DAE0', isPending: true }, // 等待处理
  DOCUMENT_POST: { color: '#FAAD14' }, // 单据邮寄
  PAYMENT_FAIL: { color: '#EA4343' }, // 支付失败
  CSH_RESERVED: { color: '#EA4343' }, // 付款反冲
  CSH_RETURN: { color: '#EA4343' }, // 付款退款
  DOCUMENT_RETURN: { color: '#EA4343' }, // 单据邮退
  '1004': { color: '#EA4343' }, // 退回至申请人
  '1009': { color: '#EA4343' }, // 申请退回驳回
  '1010': { color: '#EA4343' }, // 强制退回
  default: { color: '#4390FF' }, // 未知
};

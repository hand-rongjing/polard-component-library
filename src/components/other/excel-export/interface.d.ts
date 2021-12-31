/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2021-12-27 11:47:50
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2021-12-31 10:17:34
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
export interface IProps {
  visible: boolean; // 导出弹框是否可见
  onCancel: () => void; // 点击取消回调
  onOk: (result) => void; // 选择导出列回调，
  // afterClose: func;    // 关闭后的回调
  columns: Array<{ [key: string]: string }>; // 需要导出的列
  fileName: string; // 导出的文件名称
  excelItem: string; // 导出文件大类; 这个东东为什么要加，我也不清楚
  canCheckVersion: boolean; // 是否可以修改文件格式，默认为true, 如果为false则全部默认为excel2007
  allowPartEmpty: boolean; // 多页签导出时，是否允许部分sheet导出
}

export interface IState {
  selectedRowKeys: Array<string> | { [key: string]: Array<string> };
  excelVersion: string;
  multiple: boolean;
  sheetKey: string;
}

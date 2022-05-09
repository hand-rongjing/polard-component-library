/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2021-12-27 11:54:12
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-05-09 18:05:59
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
// import nodePolyfills from 'rollup-plugin-node-polyfills';
// import commonjs from 'rollup-plugin-commonjs';

export default {
  esm: 'rollup',
  cjs: 'rollup',
  extractCSS: true,

  // umd: {
  //   name: 'hand-polard',
  //   sourcemap: true,
  //   globals: {
  //     react: 'React',
  //     antd: 'antd'
  //   },
  // },
  // extraRollupPlugins: [
  //   nodePolyfills(),
  // ]
};

import React from 'react';
import BannerImg from './images/banner.png';
import CaseOneImg from './images/case1.png';
import CaseThirdImg from './images/case3.png';
import CaseFourthImg from './images/case4.png';
import CaseFifthImg from './images/case5.png';
import CaseSixthImg from './images/case6.png';
import CaseSeventhImg from './images/case7.png';

export const Banner50DataSource = {
  wrapper: { className: 'home-page-wrapper banner5' },
  page: { className: 'home-page banner5-page' },
  childWrapper: {
    className: 'banner5-title-wrapper',
    children: [
      {
        name: 'title',
        children: (
          <span>
            <p>hand-polard</p>
          </span>
        ),
        className: 'banner5-title',
      },
      {
        name: 'explain',
        className: 'banner5-explain',
        children: '基于AntD的二次封装的组件库文档示例',
      },
      {
        name: 'content',
        className: 'banner5-content',
        children: '提供常用的业务组件，减少技术人员开发时间',
      },
      {
        name: 'button',
        className: 'banner5-button-wrapper',
        children: {
          href: '/#/components/',
          className: 'banner5-button',
          type: 'primary',
          children: '开始使用',
        },
      },
    ],
  },
  image: {
    className: 'banner5-image',
    children: BannerImg,
  },
};
export const Content50DataSource = {
  wrapper: { className: 'home-page-wrapper content5-wrapper' },
  page: { className: 'home-page content5' },
  OverPack: { playScale: 0.3, className: '' },
  titleWrapper: {
    className: 'title-wrapper',
    children: [
      { name: 'title', children: '组件总览', className: 'title-h1' },
      {
        name: 'content',
        className: 'title-content',
        children: '这里展示部分常用的组件缩略图',
      },
    ],
  },
  block: {
    className: 'content5-img-wrapper',
    gutter: 16,
    children: [
      {
        name: 'block0',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          wrapper: {
            className: 'content5-block-content',
            href: '/#/components/basic/custom-table',
          },
          img: {
            children: CaseOneImg,
          },
          content: { children: '表格' },
        },
      },
      {
        name: 'block1',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          wrapper: {
            className: 'content5-block-content',
            href: '/#/components/form/lov',
          },
          img: {
            children: CaseThirdImg,
          },
          content: { children: '值列表' },
        },
      },
      {
        name: 'block2',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          wrapper: {
            className: 'content5-block-content',
            href: '/#/components/form/input-language',
          },
          img: {
            children: CaseFourthImg,
          },
          content: { children: '多语言输入' },
        },
      },
      {
        name: 'block3',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          wrapper: {
            className: 'content5-block-content',
            href: '/#/components/business-components/document-basic-info',
          },
          img: {
            children: CaseFifthImg,
          },
          content: { children: '单据详情' },
        },
      },
      {
        name: 'block4',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          wrapper: {
            className: 'content5-block-content',
            href: '/#/components/business-components/approve-history',
          },
          img: {
            children: CaseSixthImg,
          },
          content: { children: '审批历史' },
        },
      },
      {
        name: 'block5',
        className: 'block',
        md: 8,
        xs: 24,
        children: {
          wrapper: {
            className: 'content5-block-content',
            href: '/#/components/other/common-import',
          },
          img: {
            children: CaseSeventhImg,
          },
          content: { children: 'Excel导入' },
        },
      },
    ],
  },
};
export const Footer00DataSource = {
  wrapper: { className: 'home-page-wrapper footer0-wrapper' },
  OverPack: { className: 'home-page footer0', playScale: 0.05 },
  copyright: {
    className: 'copyright',
    children: (
      <span>
        ©2021 <a href="#">hand-polard</a> All Rights Reserved
      </span>
    ),
  },
};

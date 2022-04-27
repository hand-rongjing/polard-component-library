/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2022-04-24 15:30:55
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-04-24 15:34:07
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React from 'react';
import TagDrag from './TagDrag';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Drag(props) {
  return (
    <DndProvider backend={HTML5Backend}>
      <TagDrag {...props} />
    </DndProvider>
  );
}

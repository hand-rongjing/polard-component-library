/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2022-04-24 11:48:50
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-04-25 10:02:00
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import TagItem from './tagItem';

export default function TagDrag(props) {
  const { list, dragBack } = props;
  const [dragList, setDragList] = useState([]);

  useEffect(() => {
    setDragList([...list]);
  }, [list]);

  const [, drop] = useDrop({
    accept: ['tag'],
    drop() {
      dragBack([...dragList]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      draggingColor: monitor.getItemType(),
    }),
  });

  const dragChange = (res) => {
    setDragList([...res]);
  };

  return (
    <div ref={drop} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {dragList.map((o, index) => (
        <TagItem
          key={o.id}
          data={o}
          {...props}
          hoverIndex={index}
          onChange={dragChange}
        />
      ))}
    </div>
  );
}

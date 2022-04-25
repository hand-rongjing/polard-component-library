/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2022-04-24 16:23:37
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-04-25 14:23:41
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useRef } from 'react';
import { cloneDeep } from 'lodash';
import { Tag } from 'antd';
import { useDrop, useDrag } from 'react-dnd';

export default function TagItem(props) {
  const { data, list, canDrag, handleDel, hoverIndex, onChange } = props;

  console.log('canDrag', canDrag);
  const tagStyle = {
    background: '#f5f5f5',
    border: 0,
    marginRight: 4,
  };
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ['tag'],
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      if (dragIndex === hoverIndex) return;
      const tempList = move(dragIndex, hoverIndex);
      onChange([...tempList]);
    },
  });

  const [{ opacity }, drag] = useDrag({
    type: 'tag',
    item: { type: 'tag', index: hoverIndex, name: data.userName },
    canDrag,
    end: () => {},
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.2 : 1,
    }),
  });

  const move = (sourceIndex, targetIndex) => {
    const newList = cloneDeep(list);
    const source = newList[sourceIndex];
    newList.splice(sourceIndex, 1);
    newList.splice(targetIndex, 0, source);
    return newList;
  };

  drag(drop(ref));

  return (
    <div style={{ marginBottom: 10 }}>
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleDel(list, hoverIndex);
        }}
        ref={ref}
        style={{ opacity, ...tagStyle }}
      >
        {data.userName}
      </Tag>
    </div>
  );
}

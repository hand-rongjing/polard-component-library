/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2022-01-14 14:48:17
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-01-21 16:56:31
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { CloseOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import httpFetch from 'share/httpFetch';
import config from 'config'


function PlatformNotice(props) {
  const {refInstance, isLayout} = props;
  const { globalData } = useModel('useDataModel',
    model => {
      return {
        globalData: model.globalData,
      };
    });

  const globalDataRef = useRef({});
  const [notice, setNotice] = useState([]);
  const interVal = useRef(); // 定时器

  useImperativeHandle(refInstance, () => ({
    removeInterval: () => {
      if (interVal.current) {
        clearInterval(interVal.current);
      }
    },
  }));

  useEffect(() => {
    globalDataRef.current = globalData;
    console.log('interVal', interVal)

  }, [globalData])

  useEffect(() => {
    getPlatformNotice();

    if (interVal.current) {
      clearInterval(interVal.current);
    }
    interVal.current = setInterval(() => {
      getPlatformNotice();
    }, 10000)
  }, [])

  function getPlatformNotice () {
    const tenantId = globalDataRef.current ? globalDataRef.current.user.tenantId : '';
    let url = `${config.mdataUrl}/notification/get/by/tenantId`;
    if (tenantId) {
      url += `?tenantId=${tenantId}`
    }

    httpFetch.get(url).then(res => {
      if (res.data) {
        let cacheList = window.sessionStorage.getItem('notice_cache');
        cacheList = cacheList ? JSON.parse(cacheList) : [];
        const newList = []
        res.data.forEach(item => {
          const index = cacheList.findIndex(o => o.id === item.id && o.content === item.content);
          if (index === -1) {
            newList.push(item);
          }
        })
        setNotice([...newList]);
      } else {
        setNotice([]);
      }
    }).catch(() => {
      setNotice([]);
    })
  }

  // 关闭通知
  function closeNotice (item, index) {
    let cacheList = window.sessionStorage.getItem('notice_cache');
    cacheList = cacheList ? JSON.parse(cacheList) : [];
    cacheList.push(item);
    window.sessionStorage.setItem('notice_cache', JSON.stringify(cacheList));
    notice.splice(index, 1);
    setNotice([...notice]);
  }

  return (
    <div
      className='platform-notice'
      style={{
      position: 'absolute',
      top: (isLayout ? 45 : 0),
      background: 'rgb(255, 255, 255)',
      width: '100%',
      height: (notice.length * 42),
      zIndex: isLayout ? 1001 : 100000,
    }}
    >
      {notice.map((item, index) => {
        const style = {
          position: 'relative',
          width: '100%',
          background: '#FEF2E2',
          color: '#333333',
          textAlign: 'center',
          fontSize: 16,
          padding: '8px 40px 8px 8px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 8px',
        }
        return (
          <div key={item.id} style={style}>
            {item.content}
            <CloseOutlined style={{ position: 'absolute', right: 20, top: 12, fontSize: 14, color: '#666'}} onClick={() => closeNotice(item, index)} />
          </div>
        )
      })}
    </div>
  )
}

export default forwardRef((props, ref) => <PlatformNotice {...props} refInstance={ref} />);

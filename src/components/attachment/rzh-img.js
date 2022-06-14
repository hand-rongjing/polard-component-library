/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2022-06-09 17:02:20
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-06-14 15:11:36
 * @Version: 1.0.0
 * @Description: 图片预览显示原图
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import React, { useEffect, useState } from 'react';
import config from 'config';
import httpFetch from 'share/httpFetch';

function RzhImg(props) {
  const { url } = props;
  const [srcData, setSrcData] = useState(null);

  useEffect(() => {
    if (url) {
      if (url.indexOf('/api/') === 0) {
        // api开头的接口
        httpFetch
          .get(
            `${config.fileUrl}${url}`,
            {},
            {},
            { responseType: 'arraybuffer' },
          )
          .then((res) => {
            const f = `data:image/png;base64,${btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            )}`;
            setSrcData(f);
          });
      } else {
        setSrcData(url);
      }
      // if ( url.indexOf('/view/') === 0 || url.indexOf('data:image/png;base64') === 0 ) { // /view/开头是缩略图静态文件
    }
  }, [url]);

  return <img {...props} src={srcData} />;
}

export default RzhImg;

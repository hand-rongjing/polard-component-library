/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2022-06-09 17:02:20
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-06-09 17:14:07
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
      if (url.indexOf('/view/') === 0) {
        // /view/开头是缩略图静态文件
        setSrcData(url);
      } else {
        // 原图是 /api开头
        httpFetch
          .get(
            `${config.fileUrl}${url}`,
            {},
            {},
            { responseType: 'arraybuffer' },
          )
          .then((res) => {
            let f =
              'data:image/png;base64,' +
              btoa(
                new Uint8Array(res.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  '',
                ),
              );
            setSrcData(f);
          });
      }
    }
  }, [url]);

  return <img {...props} src={srcData} />;
}

export default RzhImg;

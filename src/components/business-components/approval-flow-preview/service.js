/*
 * @Author: zong.wang01@hand-china.com
 * @Date: 2022-03-30 15:53:30
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-03-31 09:33:16
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */
import httpFetch from 'share/httpFetch';

import config from 'config';

const cacheData = {};
const maxLimit = 5;

export default {
  /**
   * 获取画布信息
   * @param documentId,
   * @param documentType,
   * @param taskId,
   */
  getApprovalNodeValue(entityId, entityType, nodeCode, instanceId) {
    let url = `${config.wflUrl}/api/wfl/preview?entityId=${entityId}&entityType=${entityType}`;
    if (instanceId) url = `${url}&instanceId=${instanceId}`;
    if (nodeCode) url = `${url}&parentNodeCode=${nodeCode}`;
    return httpFetch.get(url);
  },
  /**
   * 在待办事项待审批单据获取画布信息
   * @param documentId,
   * @param documentType,
   * @param taskId,
   */
  getApprovalNodeValueByTodo(entityId, entityType, nodeCode) {
    let url = `${config.wflUrl}/api/wfl/preview/by/todo?entityId=${entityId}&entityType=${entityType}`;
    if (nodeCode) url = `${url}&parentNodeCode=${nodeCode}`;
    return httpFetch.get(url);
  },
  /**
   * 在已办事项待审批单据获取画布信息
   * @param documentId,
   * @param documentType,
   * @param taskId,
   */
  getApprovalNodeValueByDone(entityId, entityType, nodeCode) {
    let url = `${config.wflUrl}/api/wfl/preview/by/done?entityId=${entityId}&entityType=${entityType}`;
    if (nodeCode) url = `${url}&parentNodeCode=${nodeCode}`;
    return httpFetch.get(url);
  },

  /**
   * 在待办事项未完成单据获取画布信息
   * @param documentId,
   * @param documentType,
   * @param taskId,
   */
  getApprovalNodeValueByOwner(entityId, entityType, nodeCode) {
    let url = `${config.wflUrl}/api/wfl/preview/by/owner?entityId=${entityId}&entityType=${entityType}`;
    if (nodeCode) url = `${url}&parentNodeCode=${nodeCode}`;
    return httpFetch.get(url);
  },
  /**
   * 获取节点审批历史信息
   */
  getPreviewNodeHistory() {
    const url = `${config.wflUrl}`;
    return httpFetch.get(url);
  },
  getPreviewNodeHistoryAndCache(nodeCode) {
    if (nodeCode in cacheData && cacheData[nodeCode].count <= maxLimit) {
      cacheData[nodeCode].count += 1;
      return new Promise((resolve) => {
        resolve(cacheData[nodeCode].data);
      });
    } else {
      return new Promise((resolve, reject) => {
        const url = `${config.wflUrl}`;
        httpFetch
          .get(url)
          .then((res) => {
            cacheData[nodeCode] = {
              data: res,
              count: 1,
            };
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  },
  /**
   * 获取参数定义 的值
   * @param {*} code
   * @param {*} params
   */
  getParamDefinition(code, params = {}) {
    const url = `${config.baseUrl}/api/param/value/get/by/code?code=${code}`;
    return httpFetch.post(url, params);
  },

  /**
   * 在审批历史中获取画布信息
   * @param entityId,
   * @param entityType,
   */
  getApprovalNodeByHistory(entityId, entityType) {
    const url = `${config.wflUrl}/api/workflow/approval/history?entityType=${entityType}&entityId=${entityId}`;
    console.log('url', url);
    return httpFetch.get(url);
  },
};

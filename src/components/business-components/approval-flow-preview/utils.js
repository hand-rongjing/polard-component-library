import { messages } from '../../utils';
import userIcon from './icons/user.svg';
import addIcon from './icons/ic_addpoint.svg';
import errorIcon from './icons/ic_nothing.svg';

export function uuid() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  const uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uid;
}

// 获取树的深度
export function handleGetTreeDeep(node) {
  let deep = 0;
  if (node.children) {
    node.children.forEach((item) => {
      deep = Math.max(handleGetTreeDeep(item) + 1, deep);
    });
  } else {
    deep += 1;
  }
  if (node.end) {
    deep += handleGetTreeDeep(node.end);
  }
  return deep;
}

// 获取树的广度
export function handleGetTreeExtent(nodes) {
  let extend = 0;
  if (!nodes) return extend;
  nodes.forEach((item) => {
    if (item.children) {
      const n1 = handleGetTreeExtent(item.children);
      if (item.end) {
        const n2 = handleGetTreeExtent([item.end]);
        extend += Math.max(n1, n2);
      } else {
        extend += n1;
      }
    } else if (item.end && item.end.children) {
      const n2 = handleGetTreeExtent(item.end.children);
      extend += n2;
    } else {
      extend += 1;
    }
  });
  return extend;
}

export function createNode(type) {
  switch (type) {
    case 'add': {
      return {
        shape: 'base-node',
        style: {
          cursor: 'pointer',
          fill: 'rgba(0,0,0,0)',
          stroke: 'rgba(0,0,0,0)',
        },

        icon: {
          img: addIcon,
          x: 0,
          y: 0,
          width: 14,
          height: 14,
        },

        type: 'add',
        size: [14, 14],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
      };
    }
    case 'error': {
      return {
        shape: 'base-node',
        style: {
          cursor: 'pointer',
          fill: 'rgba(0,0,0,0)',
          stroke: 'rgba(0,0,0,0)',
        },

        icon: {
          img: errorIcon,
          x: 0,
          y: 0,
          width: 14,
          height: 14,
        },

        type: 'add',
        size: [14, 14],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
      };
    }
    case 'line': {
      return {
        shape: 'base-node',
        style: {
          cursor: 'pointer',
          fill: '#4390FF',
          stroke: 'rgba(0,0,0,0)',
          lineWidth: 0,
        },

        type: 'add',
        size: [1, 14],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
      };
    }
    case 'start': {
      return {
        shape: 'start-node',
        size: [126, 40],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        style: {
          cursor: 'pointer',
          radius: [10],
          fill: '#DDE9FB',
          stroke: '#DDE9FB',
          width: 126,
          height: 40,
        },
      };
    }
    case 'end': {
      return {
        shape: 'end-node',
        size: [126, 40],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        style: {
          cursor: 'pointer',
          radius: [10],
          fill: '#FDE9EC',
          stroke: '#FDE9EC',
          width: 126,
          height: 40,
        },
      };
    }
    case 'approval': {
      return {
        shape: 'approval-node',
        size: [148, 62],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        linkPoints: {
          top: true,
          bottom: true,
          left: true,
          right: true,
          size: 5,
          fill: '#fff',
        },

        type: 'node',
        dataType: 'approval',
        style: {
          cursor: 'pointer',
          radius: [4],
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          width: 148,
          height: 62,
        },
      };
    }
    case 'robot': {
      return {
        shape: 'robot-node',
        size: [148, 62],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        linkPoints: {
          top: true,
          bottom: true,
          left: true,
          right: true,
          size: 5,
          fill: '#fff',
        },

        type: 'node',
        dataType: 'robot',
        style: {
          cursor: 'pointer',
          radius: [4],
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          width: 148,
          height: 62,
        },
      };
    }
    case 'custom-approval': {
      return {
        shape: 'custom-approval-node',
        size: [148, 62],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        linkPoints: {
          top: true,
          bottom: true,
          left: true,
          right: true,
          size: 5,
          fill: '#fff',
        },

        type: 'node',
        dataType: 'custom-approval',
        style: {
          cursor: 'pointer',
          radius: [4],
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          width: 148,
          height: 62,
        },
      };
    }
    case 'approval-chain': {
      return {
        shape: 'approval-chain-node',
        size: [148, 62],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        linkPoints: {
          top: true,
          bottom: true,
          left: true,
          right: true,
          size: 5,
          fill: '#fff',
        },

        type: 'node',
        dataType: 'approval-chain',
        style: {
          cursor: 'pointer',
          radius: [4],
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          width: 148,
          height: 62,
        },
      };
    }
    case 'condition': {
      return {
        shape: 'condition-node',
        size: [148, 40],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        type: 'node',
        dataType: 'condition',
        style: {
          cursor: 'pointer',
          radius: [18],
          fill: '#FEFAE9',
          stroke: '#ccc',
          width: 148,
          height: 40,
          lineDash: [4, 4],
        },
      };
    }
    case 'schedule': {
      return {
        shape: 'scheduling-node',
        size: [148, 62],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        linkPoints: {
          top: true,
          bottom: true,
          left: true,
          right: true,
          size: 5,
          fill: '#fff',
        },
        type: 'node',
        dataType: 'schedule',
        style: {
          cursor: 'pointer',
          radius: [4],
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          width: 148,
          height: 62,
        },
      };
    }
    case 'smart-node': {
      return {
        shape: 'smart-node',
        size: [148, 62],
        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
        linkPoints: {
          top: true,
          bottom: true,
          left: true,
          right: true,
          size: 5,
          fill: '#fff',
        },
        type: 'node',
        dataType: 'schedule',
        style: {
          cursor: 'pointer',
          radius: [4],
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          width: 148,
          height: 62,
        },
      };
    }
    default: {
      return {
        shape: 'base-node',
        label: messages('workflow.node'),
        icon: {
          img: userIcon,
          x: 4,
          y: 4,
        },

        style: {
          fill: '#E7F7FE',
          stroke: '#1890FF',
          cursor: 'pointer',
          radius: [4],
        },

        type: 'node',
        size: [86, 46],
        linkPoints: {
          top: true,
          bottom: true,
          left: false,
          right: false,
          fill: '#fff',
          size: 5,
        },

        anchorPoints: [
          [0.5, 0], // 上中
          [0.5, 1], // 下中
          [0, 0.5], // 左中
          [1, 0.5], // 右中
        ],
      };
    }
  }
}

export function getNodeById(data, id) {
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].id === id) return data[i];
    if (data[i].children) {
      const node = getNodeById(data[i].children, id);
      if (node) return node;
    }
    if (data[i].end) {
      if (data[i].end.id === id) return data[i].end;
      const node = getNodeById([data[i].end], id);
      if (node) return node;
    }
  }
}

function isChinese(temp) {
  const re = /[^\u4e00-\u9fa5]/;
  if (re.test(temp)) return false;
  return true;
}

/**
 *
 * @param {*} string :目标字符串
 * @param {*} maxLen :设置的截取最大字符串长度
 * @param {*} start  : 从下标start开始
 */
export function spliceString(string, maxLen, start = 0) {
  if (!string) return string;
  if (string.replace(/[\u4e00-\u9fa5]/g, '**').length <= maxLen) {
    return string; // 不存在中文且长度小于给定的最大长度时原样返回
  }
  if (isChinese(string)) {
    return string.length > 7 ? `${string.substring(0, 7)}...` : string;
  }
  let len = 0;
  let tmpStr = '';
  const originLen = string.length;
  // 遍历字符串,每有一个中文，len + 2, 当总len 大于 maxLen时结束截取，否则去取源串的当前下标的数据
  for (let i = start; i < originLen; i += 1) {
    if (/[\u4e00-\u9fa5]/.test(string[i])) {
      len += 2;
    } else {
      len += 1;
    }
    if (len > maxLen) {
      break;
    } else {
      tmpStr += string[i];
    }
  }
  return string.length > tmpStr.length ? `${tmpStr}...` : tmpStr;
}

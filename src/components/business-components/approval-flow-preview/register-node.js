/* eslint-disable */
import { messages } from '../../utils';
import approvalIcon from './icons/ic_ex.svg';
import conditionIcon from './icons/ic_condition.svg';
import redpromptIcon from './icons/ic_redprompt.svg';
import robotIcon from './icons/ic_robot.svg';
import customApprovaIcon from './icons/ic_ep.svg';
import approvalChainIcon from './icons/ic_link.svg';
import selectedIcon from './icons/ic_selected_right.svg';
import currentIcon from './icons/pic_present.svg';
import passedIcon from './icons/pic_passed.svg';
import arrivingIcon from './icons/pic_arriving.svg';
import missIcon from './icons/pic_miss.svg';
import withDrewIcon from './icons/pic_withdrew.svg';
import arrivedIcon from './icons/pic_arrived.svg';
import rejectedIcon from './icons/pic_rejected.svg';
import suspendedIcon from './icons/pic_suspended.svg';
import { spliceString } from './utils';
import currentEnIcon from './icons/pic_present_en.svg';
import currentTwIcon from './icons/pic_present_tw.svg';
import passedEnIcon from './icons/pic_passed_en.svg';
import passedTwIcon from './icons/pic_passed_tw.svg';
import arrivingEnIcon from './icons/pic_arriving_en.svg';
import arrivingTwIcon from './icons/pic_arriving_tw.svg';
import missEnIcon from './icons/pic_miss_en.svg';
import missTwIcon from './icons/pic_miss_tw.svg';

import withDrewEnIcon from './icons/pic_withdrew_en.svg';
import withDrewTwIcon from './icons/pic_withdrew_tw.svg';

import arrivedEnIcon from './icons/pic_arrived_en.svg';
import arrivedTwIcon from './icons/pic_arrived_tw.svg';

import rejectedEnIcon from './icons/pic_passed_en.svg';
import rejectedTwIcon from './icons/pic_passed_tw.svg';

import suspendedEnIcon from './icons/pic_suspended_en.svg';
import suspendedTwIcon from './icons/pic_suspended_tw.svg';

import { textOpacity, titleOpacity } from './constant';
import schedulingIcon from './icons/ic_scheduling.svg';

const switchPicture = {
  currentImg: {
    zh_cn: currentIcon,
    en_us: currentEnIcon,
    zh_tw: currentTwIcon,
  },
  passedImg: {
    zh_cn: passedIcon,
    en_us: passedEnIcon,
    zh_tw: passedTwIcon,
  },
  arrivingImg: {
    zh_cn: arrivingIcon,
    en_us: arrivingEnIcon,
    zh_tw: arrivingTwIcon,
  },
  missImg: {
    zh_cn: missIcon,
    en_us: missEnIcon,
    zh_tw: missTwIcon,
  },
  withDrewImg: {
    zh_cn: withDrewIcon,
    en_us: withDrewEnIcon,
    zh_tw: withDrewTwIcon,
  },
  arrivedImg: {
    zh_cn: arrivedIcon,
    en_us: arrivedEnIcon,
    zh_tw: arrivedTwIcon,
  },
  rejectedImg: {
    zh_cn: rejectedIcon,
    en_us: rejectedEnIcon,
    zh_tw: rejectedTwIcon,
  },
  suspendedImg: {
    zh_cn: suspendedIcon,
    en_us: suspendedEnIcon,
    zh_tw: suspendedTwIcon,
  },
};

export default {
  start: () => {
    G6.registerNode(
      'start-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            if (title.length > 5) {
              title = title.substr(0, 5);
              title += '.'.repeat(3);
            }
            group.addShape('text', {
              attrs: {
                x: style.x + 63,
                y: style.y + 20,
                textAlign: 'center',
                textBaseline: 'middle',
                text: title,
                fill: '#4390FF',
                fontSize: 14,
              },
            });
          }
          return shape;
        },
        setState(name, value, item) {
          const group = item.getContainer();
          const { style } = item.getModel();
          if (name === 'selected') {
            const rect = group.getChildByIndex(0);

            if (!style) {
              rect.attr('fill', '#95D6FB');
              return;
            }

            if (value) {
              rect.attr('fill', value);
            } else if (style.selected && style.selected.fill) {
              rect.attr('fill', style.selected.fill);
            } else {
              rect.attr('fill', '#95D6FB');
            }
          }
        },
      },
      'rect',
    );
  },
  end: () => {
    G6.registerNode(
      'end-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            if (title.length > 5) {
              title = title.substr(0, 5);
              title += '.'.repeat(3);
            }
            group.addShape('text', {
              attrs: {
                x: style.x + 63,
                y: style.y + 20,
                textAlign: 'center',
                textBaseline: 'middle',
                text: title,
                fill: '#FF465D',
                fontSize: 14,
              },
            });
          }
          return shape;
        },
        setState(name, value, item) {
          const group = item.getContainer();
          const { style } = item.getModel();
          if (name === 'selected') {
            const rect = group.getChildByIndex(0);

            if (!style) {
              rect.attr('fill', '#95D6FB');
              return;
            }

            if (value) {
              rect.attr('fill', value);
            } else if (style.selected && style.selected.fill) {
              rect.attr('fill', style.selected.fill);
            } else {
              rect.attr('fill', '#95D6FB');
            }
          }
        },
      },
      'rect',
    );
  },
  approval: () => {
    G6.registerNode(
      'approval-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
              stroke: cfg.error ? 'red' : style.stroke,
            },
          });
          group.addShape('image', {
            attrs: {
              x: style.x + 12,
              y: style.y + 16,
              width: 14,
              height: 14,
              img: approvalIcon,
              opacity: cfg.missed ? 0.5 : 1,
            },
          });

          if (cfg.passed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.passedImg[cfg.language || 'zh_cn'],
              },
            });
          } else if (cfg.arriving) {
            // 未到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivingImg[cfg.language || 'zh_cn'],
              },
            });
          } else if (cfg.missed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.missImg[cfg.language || 'zh_cn'],
              },
            });
          } else if (cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.currentImg[cfg.language || 'zh_cn'],
              },
            });
          } else if (cfg.arrived) {
            // 已到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivedImg[cfg.language || 'zh_cn'],
              },
            });
          } else if (cfg.withdrew) {
            // 已撤回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.withDrewImg[cfg.language || 'zh_cn'],
              },
            });
          } else if (cfg.rejected) {
            // 已驳回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.rejectedImg[cfg.language || 'zh_cn'],
              },
            });
          } else if (cfg.suspended) {
            // 暂挂
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.suspendedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          group.addShape('text', {
            attrs: {
              x: style.x + 28,
              y: style.y + 16,
              textAlign: 'left',
              textBaseline: 'top',
              text:
                spliceString(cfg.nodeName, 10) || messages('common.approve'), // 审批
              fill: cfg.missed ? textOpacity : '#999999',
              fontSize: 12,
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            // if (title.length > 6) {
            //   title = title.substr(0, 6);
            //   title += '.'.repeat(3);
            // }
            title = spliceString(title, 12);
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                text: title,
                fill: cfg.missed ? titleOpacity : '#333333',
                fontSize: 14,
              },
            });
          } else {
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                // text: '暂无设置',
                text: messages('workflow.no.settings'),
                fill: '#333333',
                fontSize: 14,
              },
            });
            group.addShape('image', {
              attrs: {
                x: style.x + 88,
                y: style.y + 35,
                width: 14,
                height: 14,
                img: redpromptIcon,
              },
            });
          }

          if (cfg.selected && !cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 7,
                y: style.y - 7,
                width: 14,
                height: 14,
                img: selectedIcon,
                shapeType: 'selected',
              },
            });
          }

          return shape;
        },
        update(cfg, node) {
          const group = node.getContainer();
          const style = node.getKeyShapeStyle();
          if (cfg.selected) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 7,
                y: style.y - 7,
                width: 14,
                height: 14,
                img: selectedIcon,
                shapeType: 'selected',
              },
            });
          } else {
            // group.removeChild(group.getChildByIndex(5));
            // group.removeChild(group.getLast());
            const shape = group.getLast();
            if (shape['_attrs'].shapeType === 'selected') {
              group.removeChild(shape);
            }
          }
        },
        setState(name, value, item) {
          if (name === 'hover' && item) {
            const group = item.getContainer();
            const { style } = item.getModel();
            const children = group.get('children');

            if (!children || !children.length) return;
            const shape = children[0];

            if (value) {
              shape.attr('shadowColor', 'rgba(0,0,0,0.15)');
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 2);
              shape.attr('shadowBlur', 8);
            } else {
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 0);
              shape.attr('shadowBlur', 0);
            }
          }
        },
        getAnchorPoints() {
          return [
            [0.5, 0], // 上中
            [0.5, 1], // 下中
            [0, 0.5], // 左中
            [1, 0.5], // 右中
          ];
        },
      },
      'rect',
    );
  },
  robot: () => {
    G6.registerNode(
      'robot-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
            },
          });

          group.addShape('image', {
            attrs: {
              x: style.x + 12,
              y: style.y + 16,
              width: 14,
              height: 14,
              img: robotIcon,
            },
          });

          if (cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.currentImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.passed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.passedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.arriving) {
            // 未到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivingImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.missed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.missImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.arrived) {
            // 已到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.rejected) {
            // 已驳回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.rejectedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.withdrew) {
            // 已撤回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.withDrewImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.suspended) {
            // 暂挂
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.suspendedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          group.addShape('text', {
            attrs: {
              x: style.x + 28,
              y: style.y + 16,
              textAlign: 'left',
              textBaseline: 'top',
              // text: '机器人',
              text:
                spliceString(cfg.nodeName, 10) || messages('setting.key1249'),
              fill: cfg.missed ? textOpacity : '#999999',
              fontSize: 12,
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            // if (title.length > 6) {
            //   title = title.substr(0, 6);
            //   title += '.'.repeat(3);
            // }
            title = spliceString(title, 12);
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                text: title,
                fill: cfg.missed ? textOpacity : '#333333',
                fontSize: 14,
              },
            });
          } else {
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                // text: '暂无设置',
                text: messages('workflow.no.settings'),
                fill: cfg.missed ? textOpacity : '#333333',
                fontSize: 14,
              },
            });
            group.addShape('image', {
              attrs: {
                x: style.x + 88,
                y: style.y + 35,
                width: 14,
                height: 14,
                img: redpromptIcon,
              },
            });
          }
          return shape;
        },
        setState(name, value, item) {
          const group = item.getContainer();
          const { style } = item.getModel();
          if (name === 'selected') {
            const rect = group.getChildByIndex(0);

            if (!style) {
              rect.attr('fill', '#95D6FB');
              return;
            }

            if (value) {
              rect.attr('fill', value);
            } else if (style.selected && style.selected.fill) {
              rect.attr('fill', style.selected.fill);
            } else {
              rect.attr('fill', '#95D6FB');
            }
          }
          if (name === 'hover' && item) {
            const group = item.getContainer();
            const { style } = item.getModel();
            const children = group.get('children');

            if (!children || !children.length) return;
            const shape = children[0];

            if (value) {
              shape.attr('shadowColor', 'rgba(0,0,0,0.15)');
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 2);
              shape.attr('shadowBlur', 8);
            } else {
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 0);
              shape.attr('shadowBlur', 0);
            }
          }
        },
        getAnchorPoints() {
          return [
            [0.5, 0], // 上中
            [0.5, 1], // 下中
            [0, 0.5], // 左中
            [1, 0.5], // 右中
          ];
        },
      },
      'rect',
    );
  },
  customApproval: () => {
    G6.registerNode(
      'custom-approval-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
            },
          });

          group.addShape('image', {
            attrs: {
              x: style.x + 12,
              y: style.y + 16,
              width: 14,
              height: 14,
              img: customApprovaIcon,
            },
          });

          if (cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.currentImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.passed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.passedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.arriving) {
            // 未到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivingImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.missed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.missImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.arrived) {
            // 已到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.rejected) {
            // 已驳回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.rejectedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.suspended) {
            // 暂挂
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.suspendedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.withdrew) {
            // 已撤回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.withDrewImg[cfg.language || 'zh_cn'],
              },
            });
          }

          group.addShape('text', {
            attrs: {
              x: style.x + 28,
              y: style.y + 16,
              textAlign: 'left',
              textBaseline: 'top',
              // text: '自选审批',
              text:
                spliceString(cfg.nodeName, 10) ||
                messages('workflow.custom.approval'),
              fill: cfg.missed ? textOpacity : '#999999',
              fontSize: 12,
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            // if (title.length > 6) {
            //   title = title.substr(0, 6);
            //   title += '.'.repeat(3);
            // }
            title = spliceString(title, 12);
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                text: title,
                fill: cfg.missed ? textOpacity : '#333333',
                fontSize: 14,
              },
            });
          } else {
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                // text: '暂无设置',
                text: messages('workflow.no.settings'),
                fill: cfg.missed ? textOpacity : '#333333',
                fontSize: 14,
              },
            });
            group.addShape('image', {
              attrs: {
                x: style.x + 88,
                y: style.y + 35,
                width: 14,
                height: 14,
                img: redpromptIcon,
              },
            });
          }
          return shape;
        },
        setState(name, value, item) {
          const group = item.getContainer();
          const { style } = item.getModel();
          if (name === 'selected') {
            const rect = group.getChildByIndex(0);

            if (!style) {
              rect.attr('fill', '#95D6FB');
              return;
            }

            if (value) {
              rect.attr('fill', value);
            } else if (style.selected && style.selected.fill) {
              rect.attr('fill', style.selected.fill);
            } else {
              rect.attr('fill', '#95D6FB');
            }
          }
          if (name === 'hover' && item) {
            const group = item.getContainer();
            const { style } = item.getModel();
            const children = group.get('children');

            if (!children || !children.length) return;
            const shape = children[0];

            if (value) {
              shape.attr('shadowColor', 'rgba(0,0,0,0.15)');
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 2);
              shape.attr('shadowBlur', 8);
            } else {
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 0);
              shape.attr('shadowBlur', 0);
            }
          }
        },
        getAnchorPoints() {
          return [
            [0.5, 0], // 上中
            [0.5, 1], // 下中
            [0, 0.5], // 左中
            [1, 0.5], // 右中
          ];
        },
      },
      'rect',
    );
  },
  approvalChain: () => {
    G6.registerNode(
      'approval-chain-node',
      {
        draw(cfg, group) {
          console.log('cfg:', cfg);
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
            },
          });

          group.addShape('image', {
            attrs: {
              x: style.x + 12,
              y: style.y + 16,
              width: 14,
              height: 14,
              img: approvalChainIcon,
              opacity: cfg.missed ? 0.5 : 1,
            },
          });

          if (cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.currentImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.passed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.passedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.arriving) {
            // 未到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivingImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.missed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.missImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.arrived) {
            // 已到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.rejected) {
            // 已驳回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.rejectedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.suspended) {
            // 暂挂
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.suspendedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.withdrew) {
            // 已撤回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.withDrewImg[cfg.language || 'zh_cn'],
              },
            });
          }

          group.addShape('text', {
            attrs: {
              x: style.x + 28,
              y: style.y + 16,
              textAlign: 'left',
              textBaseline: 'top',
              // text: '审批链',
              text:
                spliceString(cfg.nodeName, 10) ||
                messages('workflow.approval.chain'),
              fill: cfg.missed ? textOpacity : '#999999',
              fontSize: 12,
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            // if (title.length > 6) {
            //   title = title.substr(0, 6);
            //   title += '.'.repeat(3);
            // }
            title = spliceString(title, 12);
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                text: title,
                fill: cfg.missed ? textOpacity : '#333333',
                // fill: cfg.missed ? titleOpacity : '#333333',
                fontSize: 14,
              },
            });
          } else {
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                // text: '暂无设置',
                text: messages('workflow.no.settings'),
                fill: cfg.missed ? textOpacity : '#333333',
                fontSize: 14,
              },
            });
            group.addShape('image', {
              attrs: {
                x: style.x + 88,
                y: style.y + 35,
                width: 14,
                height: 14,
                img: redpromptIcon,
              },
            });
          }

          if (cfg.selected) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 7,
                y: style.y - 7,
                width: 14,
                height: 14,
                img: selectedIcon,
                shapeType: 'selected',
              },
            });
          }
          return shape;
        },
        update(cfg, node) {
          const group = node.getContainer();
          const style = node.getKeyShapeStyle();
          if (cfg.selected) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 7,
                y: style.y - 7,
                width: 14,
                height: 14,
                img: selectedIcon,
                shapeType: 'selected',
              },
            });
          } else {
            // group.removeChild(group.getChildByIndex(5));
            const shape = group.getLast();
            if (shape['_attrs'].shapeType === 'selected') {
              group.removeChild(shape);
            }
            // group.removeChild(group.getLast());
          }
        },
        setState(name, value, item) {
          if (name === 'hover' && item) {
            const group = item.getContainer();
            const { style } = item.getModel();
            const children = group.get('children');

            if (!children || !children.length) return;
            const shape = children[0];

            if (value) {
              shape.attr('shadowColor', 'rgba(0,0,0,0.15)');
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 2);
              shape.attr('shadowBlur', 8);
            } else {
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 0);
              shape.attr('shadowBlur', 0);
            }
          }
        },
        getAnchorPoints() {
          return [
            [0.5, 0], // 上中
            [0.5, 1], // 下中
            [0, 0.5], // 左中
            [1, 0.5], // 右中
          ];
        },
      },
      'rect',
    );
  },
  condition: () => {
    G6.registerNode(
      'condition-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
            },
          });

          group.addShape('image', {
            attrs: {
              x: style.x + 18,
              y: style.y + 12,
              width: 14,
              height: 14,
              img: conditionIcon,
              textBaseline: 'middle',
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            // if (title.length > 6) {
            //   title = title.substr(0, 6);
            //   title += '.'.repeat(3);
            // }
            title = spliceString(title, 12);
            group.addShape('text', {
              attrs: {
                x: style.x + 36,
                y: style.y + 20,
                textAlign: 'left',
                textBaseline: 'middle',
                text: title,
                fill: '#333333',
                fontSize: 14,
              },
            });
          } else {
            group.addShape('text', {
              attrs: {
                x: style.x + 36,
                y: style.y + 20,
                textAlign: 'left',
                textBaseline: 'middle',
                // text: '暂无设置',
                text: messages('workflow.no.settings'),
                fill: '#333333',
                fontSize: 14,
              },
            });
            group.addShape('image', {
              attrs: {
                x: style.x + 96,
                y: style.y + 13,
                width: 14,
                height: 14,
                img: redpromptIcon,
              },
            });
          }
          return shape;
        },
        setState(name, value, item) {
          const group = item.getContainer();
          const { style } = item.getModel();
          if (name === 'selected') {
            const rect = group.getChildByIndex(0);

            if (!style) {
              rect.attr('fill', '#95D6FB');
              return;
            }

            if (value) {
              rect.attr('fill', value);
            } else if (style.selected && style.selected.fill) {
              rect.attr('fill', style.selected.fill);
            } else {
              rect.attr('fill', '#95D6FB');
            }
          }
        },
      },
      'rect',
    );
  },
  error: () => {
    G6.registerNode(
      'error-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
            },
          });

          group.addShape('image', {
            attrs: {
              x: style.x + 18,
              y: style.y + 12,
              width: 14,
              height: 14,
              img: conditionIcon,
              textBaseline: 'middle',
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            // if (title.length > 6) {
            //   title = title.substr(0, 6);
            //   title += '.'.repeat(3);
            // }
            title = spliceString(title, 12);
            group.addShape('text', {
              attrs: {
                x: style.x + 36,
                y: style.y + 20,
                textAlign: 'left',
                textBaseline: 'middle',
                text: title,
                fill: '#333333',
                fontSize: 14,
              },
            });
          } else {
            group.addShape('text', {
              attrs: {
                x: style.x + 36,
                y: style.y + 20,
                textAlign: 'left',
                textBaseline: 'middle',
                // text: '暂无设置',
                text: messages('workflow.no.settings'),
                fill: '#333333',
                fontSize: 14,
              },
            });
            group.addShape('image', {
              attrs: {
                x: style.x + 96,
                y: style.y + 13,
                width: 14,
                height: 14,
                img: redpromptIcon,
              },
            });
          }
          return shape;
        },
        setState(name, value, item) {
          const group = item.getContainer();
          const { style } = item.getModel();
          if (name === 'selected') {
            const rect = group.getChildByIndex(0);

            if (!style) {
              rect.attr('fill', '#95D6FB');
              return;
            }

            if (value) {
              rect.attr('fill', value);
            } else if (style.selected && style.selected.fill) {
              rect.attr('fill', style.selected.fill);
            } else {
              rect.attr('fill', '#95D6FB');
            }
          }
        },
      },
      'rect',
    );
  },
  scheduling: () => {
    G6.registerNode(
      'scheduling-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
              stroke:
                cfg.selected && !cfg.current
                  ? '#1890ff'
                  : cfg.conditionFlag
                  ? '#fa541d'
                  : style.stroke,
            },
          });

          if (cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: currentIcon,
              },
            });
          }

          group.addShape('image', {
            attrs: {
              x: style.x + 12,
              y: style.y + 16,
              width: 10,
              height: 10,
              img: schedulingIcon,
            },
          });

          group.addShape('text', {
            attrs: {
              x: style.x + 28,
              y: style.y + 16,
              textAlign: 'left',
              textBaseline: 'top',
              text: messages('workflow.dispatch'), // 调度
              fill: '#999999',
              fontSize: 12,
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            title = spliceString(title, 12);
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                text: title,
                fill: '#333333',
                fontSize: 14,
              },
            });
          } else {
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                text: messages('workflow.scheduling.plan'), // 调度计划
                fill: '#333333',
                fontSize: 14,
              },
            });
          }

          if (cfg.selected && !cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 9,
                y: style.y - 9,
                width: 18,
                height: 18,
                img: selectedIcon,
                shapeType: 'selected',
              },
            });
          }
          return shape;
        },
        update(cfg, node) {
          const group = node.getContainer();
          const style = node.getKeyShapeStyle();

          if (cfg.delete) {
            group.getFirst().attr('stroke', '#EA4343');
          } else if (cfg.selected) {
            group.getFirst().attr('stroke', '#1890ff');
          } else group.getFirst().attr('stroke', '#FFFFFF');

          if (cfg.selected) {
            const shape = group.getLast();
            if (shape._attrs.shapeType === 'selected') {
              return;
            }
            // group.getFirst().attr("stroke", "#1890ff");
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 9,
                y: style.y - 9,
                width: 18,
                height: 18,
                img: selectedIcon,
                shapeType: 'selected',
              },
            });
          } else {
            if (!cfg.delete) group.getFirst().attr('stroke', '#fff');
            const shape = group.getLast();
            if (shape._attrs.shapeType === 'selected') {
              group.removeChild(shape);
            }
          }
        },
        setState(name, value, item) {
          const group = item.getContainer();
          const { style } = item.getModel();
          if (name === 'selected') {
            const rect = group.getChildByIndex(0);

            if (!style) {
              rect.attr('fill', '#95D6FB');
              return;
            }

            if (value) {
              rect.attr('fill', value);
            } else if (style.selected && style.selected.fill) {
              rect.attr('fill', style.selected.fill);
            } else {
              rect.attr('fill', '#95D6FB');
            }
          }
          if (name === 'hover' && item) {
            const children = group.get('children');

            if (!children || !children.length) return;
            const shape = children[0];

            if (value) {
              shape.attr('shadowColor', 'rgba(0,0,0,0.15)');
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 2);
              shape.attr('shadowBlur', 8);
            } else {
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 0);
              shape.attr('shadowBlur', 0);
            }
          }
        },
        getAnchorPoints() {
          return [
            [0.5, 0], // 上中
            [0.5, 1], // 下中
            [0, 0.5], // 左中
            [1, 0.5], // 右中
          ];
        },
      },
      'rect',
    );
  },
  smart: () => {
    G6.registerNode(
      'smart-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('rect', {
            attrs: {
              ...style,
              stroke:
                cfg.selected && !cfg.current
                  ? '#1890ff'
                  : cfg.conditionFlag
                  ? '#fa541d'
                  : style.stroke,
            },
          });

          if (cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: currentIcon,
              },
            });
          }

          group.addShape('image', {
            attrs: {
              x: style.x + 12,
              y: style.y + 16,
              width: 10,
              height: 10,
              img: schedulingIcon,
            },
          });

          if (cfg.passed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.passedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.arriving) {
            // 未到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivingImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.missed) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.missImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.arrived) {
            // 已到达
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.arrivedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.rejected) {
            // 已驳回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.rejectedImg[cfg.language || 'zh_cn'],
              },
            });
          }

          if (cfg.withdrew) {
            // 已撤回
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 45,
                y: style.y - 1,
                width: 46,
                height: 16,
                img: switchPicture.withDrewImg[cfg.language || 'zh_cn'],
              },
            });
          }

          group.addShape('text', {
            attrs: {
              x: style.x + 28,
              y: style.y + 16,
              textAlign: 'left',
              textBaseline: 'top',
              text: messages('workflow.intelligence') /** 智能 */,
              fill: cfg.missed ? textOpacity : '#999999',
              fontSize: 12,
            },
          });

          if (cfg.title) {
            let { title } = cfg;
            title = spliceString(title, 12);
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                text: title,
                fill: cfg.missed ? titleOpacity : '#333333',
                fontSize: 14,
              },
            });
          } else {
            group.addShape('text', {
              attrs: {
                x: style.x + 28,
                y: style.y + 46,
                textAlign: 'left',
                textBaseline: 'middle',
                // text: '暂无设置',
                text: messages('workflow.no.settings'),
                fill: '#333333',
                fontSize: 14,
              },
            });
            group.addShape('image', {
              attrs: {
                x: style.x + 88,
                y: style.y + 35,
                width: 14,
                height: 14,
                img: redpromptIcon,
              },
            });
          }

          if (cfg.selected && !cfg.current) {
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 9,
                y: style.y - 9,
                width: 18,
                height: 18,
                img: selectedIcon,
                shapeType: 'selected',
              },
            });
          }
          return shape;
        },
        update(cfg, node) {
          const group = node.getContainer();
          const style = node.getKeyShapeStyle();

          if (cfg.delete) {
            group.getFirst().attr('stroke', '#EA4343');
          } else if (cfg.selected) {
            group.getFirst().attr('stroke', '#1890ff');
          } else group.getFirst().attr('stroke', '#FFFFFF');

          if (cfg.selected) {
            const shape = group.getLast();
            if (shape._attrs.shapeType === 'selected') {
              return;
            }
            // group.getFirst().attr("stroke", "#1890ff");
            group.addShape('image', {
              attrs: {
                x: style.x + style.width - 9,
                y: style.y - 9,
                width: 18,
                height: 18,
                img: selectedIcon,
                shapeType: 'selected',
              },
            });
          } else {
            if (!cfg.delete) group.getFirst().attr('stroke', '#fff');
            const shape = group.getLast();
            if (shape._attrs.shapeType === 'selected') {
              group.removeChild(shape);
            }
          }
        },
        setState(name, value, item) {
          const group = item.getContainer();
          const { style } = item.getModel();
          if (name === 'selected') {
            const rect = group.getChildByIndex(0);

            if (!style) {
              rect.attr('fill', '#95D6FB');
              return;
            }

            if (value) {
              rect.attr('fill', value);
            } else if (style.selected && style.selected.fill) {
              rect.attr('fill', style.selected.fill);
            } else {
              rect.attr('fill', '#95D6FB');
            }
          }
          if (name === 'hover' && item) {
            const children = group.get('children');

            if (!children || !children.length) return;
            const shape = children[0];

            if (value) {
              shape.attr('shadowColor', 'rgba(0,0,0,0.15)');
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 2);
              shape.attr('shadowBlur', 8);
            } else {
              shape.attr('shadowOffsetX', 0);
              shape.attr('shadowOffsetY', 0);
              shape.attr('shadowBlur', 0);
            }
          }
        },
        getAnchorPoints() {
          return [
            [0.5, 0], // 上中
            [0.5, 1], // 下中
            [0, 0.5], // 左中
            [1, 0.5], // 右中
          ];
        },
      },
      'rect',
    );
  },
};

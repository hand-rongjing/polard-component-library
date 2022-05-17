import React from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Popover } from 'antd';
import G6 from '@antv/g6';
import { messages } from '../../../utils';
import {
  uuid,
  createNode,
  handleGetTreeExtent,
  handleGetTreeDeep,
} from '../utils';
import registerNode from '../register-node';
import PreviewHistory from './preview-history';
import { nodeStatus } from '../constant';

import '../styles/flow-design.less';

let leftSpan = 100;
const topSpan = 50;

const span = 180;

let ySpan = 54;
const msg = {
  approval: messages('common.approve'), // 审批
  'approval-chian': messages('workflow.approval.chain'), // 审批链
  robot: messages('workflow.robot'), // 机器人
  'custom-approval': messages('workflow.self.selected.node'), // 自选节点
};

class WorkFlow extends React.Component {
  constructor(props) {
    super(props);
    if (props.hiddenAdd) {
      ySpan = 45;
    }
    const id = uuid();
    const data = props.data || {
      id: 'start',
      type: 'node',
      dataType: 'start',
      title: this.$t('workflow.start'),
      children: [
        {
          id,
          parent: 'start',
          type: 'add',
        },
      ],

      end: {
        id: 'end',
        type: 'node',
        dataType: 'end',
        title: this.$t('setting.key1252'),
        start: 'start',
      },
    };

    this.state = {
      nodes: data,
      nodeContextMenuX: 0,
      nodeContextMenuY: 0,
      showNodeMenu: false,
      nodeType: '',
      scale: 1,
      backups: JSON.stringify(data),
      selectedCodes: [],
      currentClickNode: {},
    };
  }

  data = {
    nodes: [],
    edges: [],
  };

  currentNode = null;
  parentNode = null;

  maxWidth = 0;

  componentDidMount() {
    const { nodes } = this.state;

    const {
      onDataChange,
      id = 'flow-box',
      disabledEvent = false,
      customSelectNodeFlag = false,
    } = this.props;
    if (onDataChange) onDataChange(nodes);

    this.maxWidth = handleGetTreeExtent([nodes]);

    this.registerEdge();
    this.registerCustomEdge();
    registerNode.start();
    registerNode.end();
    registerNode.approval();
    registerNode.robot();
    registerNode.customApproval();
    registerNode.approvalChain();
    registerNode.condition();
    registerNode.scheduling();
    registerNode.smart();

    this.graph = new G6.Graph({
      container: id,
      width: window.screen.width - 300,
      height: window.screen.height - 64,
      modes: {
        default: ['drag-canvas'],
      },
    });

    // if (!disabledEvent) {
    // 监听节点上面右键菜单事件node:mouseenter
    this.graph.on('node:mouseenter', (evt) => {
      const { item } = evt;
      const model = item.getModel();

      // if (model.dataType && model.dataType !== 'condition') {
      if (model.dataType) {
        const { x, y, type, id } = model;

        this.currentNode = this.getNodeById([this.state.nodes], id);

        this.parentNode = this.getNodeById(
          [this.state.nodes],
          this.currentNode.parent,
        );

        const point = this.graph.getCanvasByPoint(x, y);
        this.setState({
          nodeContextMenuX: point.x + 80,
          nodeContextMenuY: point.y + 50,
          showNodeMenu: true,
          currentClickNode: model,
        });
      }
      this.graph.setItemState(item, 'hover', true);
    });

    this.graph.on('node:mouseleave', (evt) => {
      const { item } = evt;
      const model = item.getModel();
      if (model.dataType && model.dataType === 'condition') {
        this.setState({
          showNodeMenu: false,
          currentClickNode: {},
        });
      }
      this.graph.setItemState(item, 'hover', false);
    });

    this.graph.on('click', () => {
      this.setState({
        showNodeMenu: false,
      });
    });
    // }

    this.renderGraph(this.state.nodes);
    // this.graph.read(this.data);

    window.onresize = () => {
      this.renderGraph(this.state.nodes);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({ nodes: nextProps.data }, () => {
        const { nodes } = this.state;
        this.data = {
          nodes: [],
          edges: [],
        };

        this.renderGraph(nodes);
        this.setState({
          nodes,
          showNodeMenu: false,
        });
      });
    }
  }

  renderNode = (
    root,
    parent,
    level = 0,
    offset = 0,
    deep = 0,
    total = 0,
    parentX = 0,
  ) => {
    const node = this.createNode(root.type, root.dataType);

    if (parentX) {
      node.x = parentX;
    } else {
      if (offset) {
        if (root.children) {
          const maxChildrenLength = handleGetTreeExtent([root]);
          const temp = (this.maxWidth - offset - maxChildrenLength - total) / 2;
          node.x =
            leftSpan +
            offset * span +
            ((maxChildrenLength - 1) / 2 + temp) * span;
        } else {
          const temp = (this.maxWidth - offset - 1 - total) / 2;
          node.x = leftSpan + offset * span + temp * span;
        }
      } else {
        if (level > 0) {
          node.x = ((this.maxWidth - (total + 1)) / 2) * span + leftSpan;
        } else {
          node.x = ((this.maxWidth - 1) / 2) * span + leftSpan;
        }
      }
    }

    if (deep) {
      node.y = (deep + level) * ySpan + topSpan;
    } else {
      node.y = level * ySpan + topSpan;
    }
    node.id = root.id;

    node.attribute = root.attribute;
    const { language } = this.props;
    node.language = language.local || 'zh_cn';

    const { previewNodeMap = {} } = this.props;
    if (previewNodeMap) {
      // 为节点设置状态
      const nodeState = previewNodeMap[node.id]
        ? previewNodeMap[node.id].nodeStatus
        : '';
      if (nodeState) {
        node[nodeStatus[nodeState]] = true;
      } else {
        node.missed = true;
      }
    }
    node.error =
      previewNodeMap[node.id] &&
      previewNodeMap[node.id].nodeStatus === 'NOT_ARRIVED' &&
      previewNodeMap[node.id].personIds.length === 0;

    node.title =
      root.dataType !== 'condition' && previewNodeMap[node.id]
        ? previewNodeMap[node.id].personsName
        : this.findEnTitle(root);

    if (previewNodeMap[node.id] && previewNodeMap[node.id].nodeName) {
      if (!previewNodeMap[node.id].personsName) {
        node.title = previewNodeMap[node.id].nodeName;
        node.nodeName = msg[node.dataType];
      } else {
        node.nodeName = previewNodeMap[node.id].nodeName;
      }
    }

    if (root.children) {
      this.handleChildren(root, parent, level, offset, deep, total, 0, 0);
    }

    if (root.end) {
      deep += handleGetTreeDeep({ ...root, end: null });
      this.renderNode(root.end, root, level, offset, deep, total, node.x);
    }

    // 父子连线
    if (
      (parent && parent.end && parent.end.id !== root.id) ||
      (parent && !parent.end)
    ) {
      let line;
      if (root.type === 'node') {
        line = this.createLine();
      } else {
        line = this.createLine('add-line');
      }
      line.source = parent.id;
      line.target = root.id;
    }
  };

  handleChildren = (node, parent, level, offset, deep, total, parentX, max) => {
    node.children.forEach((item, index) => {
      let rightLength = 0;
      const length = handleGetTreeExtent([item]) || 1;
      for (let i = index + 1; i < node.children.length; i++) {
        rightLength += handleGetTreeExtent([node.children[i]]) || 1;
      }

      // 闭合连线
      if (node.end) {
        let line;
        let end = item.end;
        while (end && end.end) {
          end = end.end;
        }

        if (node.end.type === 'node') {
          line = this.createLine();
        } else {
          line = this.createLine('add-line');
        }

        if (end) {
          line.source = end.id;
        } else {
          line.source = item.id;
        }
        line.target = node.end.id;
      }
      this.renderNode(
        item,
        node,
        level + 1,
        offset,
        deep,
        total + rightLength,
        parentX,
      );
      offset += length;
    });
  };

  createLine = (shape = 'custom-line') => {
    const line = {
      shape,
      sourceAnchor: 1,
      targetAnchor: 0,
      style: {
        stroke: '#87e8de',
      },
    };

    this.data.edges.push(line);
    return line;
  };

  renderGraph = (nodes) => {
    this.data = {
      nodes: [],
      edges: [],
    };

    const { scale } = this.state;
    this.maxWidth = handleGetTreeExtent([nodes]);
    if (!document.querySelector('.flow-design-preview-box')) {
      return;
    }
    const width = Math.max(
      this.maxWidth * span * scale,
      document.querySelector('.flow-design-preview-box').scrollWidth,
    );
    const height = Math.max(
      (handleGetTreeDeep(nodes) * ySpan + topSpan) * scale,
      window.screen.height - 64,
    );

    leftSpan = width - (this.maxWidth - 1) * span * scale;
    leftSpan = leftSpan / 2 / scale;

    this.graph.changeSize(width, height);
    this.renderNode(nodes);
    this.graph.data(this.data);
    this.graph.render();
    this.graph.zoom(scale);
  };

  getNodeById = (data, id) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) return data[i];
      if (data[i].children) {
        const node = this.getNodeById(data[i].children, id);
        if (node) return node;
      }
      if (data[i].end) {
        if (data[i].end.id === id) return data[i].end;
        const node = this.getNodeById([data[i].end], id);
        if (node) return node;
      }
    }
  };

  createNode = (type, dataType) => {
    const { hiddenAdd } = this.props;
    let node = createNode(type);
    if (type === 'add' && hiddenAdd) {
      node = createNode('line');
    }
    if (type === 'node') {
      node = createNode(dataType);
    }
    this.data.nodes.push(node);
    return node;
  };

  registerEdge() {
    G6.registerEdge('custom-line', {
      draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;

        const shape = group.addShape('path', {
          attrs: {
            stroke: '#4390FF',
            path: [
              ['M', startPoint.x, startPoint.y - 1],
              ['L', endPoint.x, endPoint.y + 1],
            ],

            endArrow: false,
          },
        });

        return shape;
      },
    });

    G6.registerEdge('add-line', {
      draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;

        const shape = group.addShape('path', {
          attrs: {
            stroke: '#4390FF',
            path: [
              ['M', startPoint.x, startPoint.y - 1],
              ['L', startPoint.x, endPoint.y - (ySpan / 2 - 7)],
              ['L', endPoint.x, endPoint.y - (ySpan / 2 - 7)],
              ['L', endPoint.x, endPoint.y + 1],
            ],

            endArrow: false,
          },
        });

        return shape;
      },
    });
  }

  registerCustomEdge() {
    G6.registerNode(
      'base-node',
      {
        draw(cfg, group) {
          const style = this.getShapeStyle(cfg);

          const shape = group.addShape('rect', {
            attrs: {
              ...style,
              width: style.width || 86,
              height: style.height || 46,
            },
          });

          if (cfg.icon && cfg.icon.img) {
            group.addShape('image', {
              attrs: {
                x: style.x + (cfg.icon.x || 0),
                y: style.y + (cfg.icon.y || 0),
                width: cfg.icon.width || 12,
                height: cfg.icon.height || 12,
                img: cfg.icon.img,
              },
            });
          }

          if (cfg.title) {
            let { title } = cfg;
            if (title.length > 5) {
              title = title.substr(0, 5);
              title += '.'.repeat(3);
            }
            group.addShape('text', {
              attrs: {
                x: style.x + style.width / 2,
                y: style.y + style.height / 2,
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
            } else {
              if (style.selected && style.selected.fill) {
                rect.attr('fill', style.selected.fill);
              } else {
                rect.attr('fill', '#95D6FB');
              }
            }
          }
        },
      },
      'rect',
    );
  }

  handleCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) closeModal();
  };

  renderMenu = () => {
    const {
      showNodeMenu,
      nodeContextMenuX,
      nodeContextMenuY,
      scale,
      nodes,
      currentClickNode,
    } = this.state;
    const { previewNodeMap } = this.props;
    const historyData =
      previewNodeMap[currentClickNode.id] &&
      previewNodeMap[currentClickNode.id].historyList;
    const historyFlag =
      historyData && Array.isArray(historyData) && !!historyData.length;

    let xOffset = nodeContextMenuX; // 当超出画布大小时显示在节点左侧
    if (document.querySelector('.flow-design-preview-box')) {
      const maxWidth = document.querySelector(
        '.flow-design-preview-box',
      ).scrollWidth;
      const decrement = historyFlag ? 356 : 294;
      xOffset =
        maxWidth < xOffset + decrement ? xOffset - decrement - 160 : xOffset;
    }
    return (
      <React.Fragment>
        {showNodeMenu && (
          <>
            {currentClickNode.dataType === 'condition' ? (
              <Popover content={currentClickNode.title} trigger="hover">
                <div
                  style={{
                    position: 'absolute',
                    left: currentClickNode.x - currentClickNode.size[0] / 2,
                    top: currentClickNode.y - currentClickNode.size[1] / 2,
                    width: currentClickNode.size[0],
                    height: currentClickNode.size[1],
                    opacity: 0,
                  }}
                ></div>
              </Popover>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  left: xOffset,
                  top: nodeContextMenuY - 64,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.13)',
                  minHeight: 81,
                  fontFamily: 'MicrosoftYaHei',
                  background: '#fff',
                  borderRadius: '2px',
                  width: historyFlag ? 356 : 294,
                }}
              >
                <PreviewHistory
                  {...this.props}
                  node={currentClickNode}
                  historyFlag={historyFlag}
                  previewNodeMap={previewNodeMap}
                />
              </div>
            )}
          </>
        )}
      </React.Fragment>
    );
  };

  // 语言环境切换后，节点title要展示英文
  findEnTitle = (node) => {
    const { language = {} } = this.props;
    if (node.dataType) {
      if (node.dataType === 'start' && node.title)
        return this.$t('workflow.start');
      if (node.dataType === 'end' && node.title)
        return this.$t('setting.key1252');
      if (
        node.attribute &&
        node.attribute.settings &&
        node.attribute.settings.i18n
      ) {
        const remarkList = node.attribute.settings.i18n.remark;
        const tempItem =
          Array.isArray(remarkList) &&
          remarkList.find((item) => item.language === language.local);
        return tempItem ? tempItem.value || node.title : node.title;
      } else return node.title;
    } else return node.title;
  };

  render() {
    const { scale, nodes } = this.state;
    const { id = 'flow-box', miniStyle, returnCodes } = this.props;

    return (
      <div>
        <div id={id}>
          <div
            style={
              miniStyle && JSON.stringify(miniStyle) !== '{}'
                ? miniStyle
                : { position: 'fixed', top: 80, right: 350, zIndex: 103 }
            }
          >
            <Input
              style={{ width: 150, textAlign: 'center' }}
              addonBefore={
                <PlusOutlined
                  onClick={() => {
                    if (scale > 1.5) return;
                    this.setState(
                      { scale: parseFloat((scale + 0.1).toFixed(1)) },
                      () => {
                        this.data = {
                          nodes: [],
                          edges: [],
                        };

                        this.renderGraph(nodes);
                      },
                    );
                  }}
                />
              }
              addonAfter={
                <MinusOutlined
                  onClick={() => {
                    if (scale < 0.5) return;
                    this.setState(
                      { scale: parseFloat((scale - 0.1).toFixed(1)) },
                      () => {
                        this.data = {
                          nodes: [],
                          edges: [],
                        };

                        this.renderGraph(nodes);
                      },
                    );
                  }}
                />
              }
              disabled
              size="small"
              value={`${parseInt(scale * 100)}%`}
            />
          </div>
          {this.renderMenu()}
        </div>
      </div>
    );
  }
}

export default WorkFlow;

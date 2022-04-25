import React, { Component, useContext } from 'react';
import { Modal, Spin } from 'antd';
// import PropTypes from 'prop-types';
import { messages } from '../../utils';
import FlowDesignParcel from './preview-out/flow-design-parcel';
import service from './service';

class ApprovalFlowPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: null, // 节点信息
      spinLoading: true,
      previewNodeMap: {}, // 类似于nodes集合，里面存放了节点对应的状态等信息
      isShowNotPASSNode: true,
    };
    this.flag = true;
  }

  componentDidMount() {
    // 根据参数定义设定的值决定 是否要隐藏 不经过节点
    service
      .getParamDefinition('PREVIEW_DISPLAY')
      .then((res) => {
        this.setState(
          {
            isShowNotPASSNode: ['Y', true].includes(res.data),
          },
          () => {
            this.getNodeList();
          },
        );
      })
      .catch((err) => {
        console.log(err); // 接口调用失败后为了不阻塞 获取画布节点的接口，在catch也执行一下getNodeList
        this.getNodeList();
      });
  }

  handleGetTreeDeep = (node) => {
    const { previewNodeMap, nodes } = this.state;

    if (node.end) {
      this.handleGetTreeDeep(node.end);
    } else {
      const parent = this.getNodeById(nodes, node.parent);
      if (parent && parent.children[0] !== node) {
        this.handleGetTreeDeep(parent.children[0].end);
      }
    }

    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i -= 1) {
        const item = node.children[i];
        this.handleGetTreeDeep(item);
        if (
          (previewNodeMap[item.id] &&
            previewNodeMap[item.id].nodeStatus === 'WITHOUT_PASS') ||
          (!previewNodeMap[item.id] &&
            item.type === 'node' &&
            !['start', 'end'].includes(item.id))
        ) {
          this.deleteNode(item);
          break;
        }
      }
    }
  };

  deleteNode = (record) => {
    const { nodes } = this.state;

    // const ids = this.getDeleteNodesByNode(record);
    // this.deleteRefNode(ids);

    if (!record.parent) {
      delete record.children;
      delete record.end;
      return;
    }
    const parent = this.getNodeById([nodes], record.parent);
    if (parent && parent.children) {
      if (parent.children.length > 2) {
        const index = parent.children.findIndex((o) => o.id === record.id);
        if (index >= 0) {
          parent.children.splice(index, 1);
        }
      } else if (parent.children.length === 2) {
        let otherNode;
        const temp = {};
        if (parent.children[0].id === record.id) {
          [, otherNode] = parent.children;
          // otherNode = parent.children[1];
        } else {
          [otherNode] = parent.children;
          // otherNode = parent.children[0];
        }
        if (otherNode.children && otherNode.children.length) {
          if (
            otherNode.children.length === 1 &&
            otherNode.children[0].dataType === 'condition'
          ) {
            temp.children = otherNode.end.children;
            // otherNode.end.end.start = temp.id;
            temp.end = otherNode.end.end;
            this.flag = false;
          } else {
            temp.children = otherNode.children;
            // otherNode.end.start = temp.id;
            // temp.id = otherNode.end.start;
            temp.end = otherNode.end;
          }
        } else {
          // temp.children = null;
          // temp.end = null;

          delete temp.children;
          delete temp.end;
        }
        if (parent.end && parent.end.children && parent.end.children.length) {
          if (temp.end) {
            let { end } = temp;
            while (end.end) {
              // eslint-disable-next-line prefer-destructuring
              end = end.end;
            }
            end.children = parent.end.children;
            end.children.forEach((item) => {
              item.parent = end.id;
            });
            parent.end.end.start = end.id;
            end.end = parent.end.end;
            // temp.id = end.id;
          } else {
            temp.children = parent.end.children;
            temp.end = parent.end.end;
            //       temp.id = parent.id;
          }
        }
        if (temp.children && temp.end) {
          temp.children.forEach((item) => {
            item.parent = parent.id;
          });
          parent.children = temp.children;
          temp.end.start = parent.id;
          parent.end = temp.end;
        } else {
          // parent.end = null;
          // parent.children = null;
          delete parent.children;
          delete parent.end;
        }
      } else if (parent.children.length === 1) {
        if (parent.id === 'start') {
          parent.children = [
            {
              id: record.id,
              parent: record.parent,
              type: record.type,
            },
          ];
          parent.end = {
            id: 'end',
            type: 'node',
            dataType: 'end',
            title: this.$t('setting.key1252') /** 结束 */,
          };
        } else if (parent.end && parent.end.children) {
          parent.end.children.forEach((item) => {
            item.parent = parent.id;
          });
          parent.children = [...parent.end.children];
          parent.end = parent.end.end;
          parent.end.start = parent.id;
        } else {
          // parent.children = null;
          // parent.end = null;
          // delete parent.children;
          // delete parent.end;
          this.deleteNode(parent);
        }
      }
    }
  };

  getDeleteNodesByNode = (record) => {
    const { nodes } = this.state;
    const result = [];
    if (record.type === 'node') {
      result.push(record.id);
    } else if (record.dataType === 'end') {
      this.getChildrenAndEnd(record, result);
    } else {
      const parent = this.getNodeById([nodes], record.parent);
      if (parent.children.length === 2) {
        const index = parent.children.findIndex((o) => o.id === record.id);
        if (index) {
          if (
            parent.children &&
            parent.children[0].children &&
            parent.children[0].children[0].dataType === 'condition'
          ) {
            result.push(parent.children[0].children[0].id);
          }
        } else if (
          parent.children &&
          parent.children[1].children &&
          parent.children[1].children[0].dataType === 'condition'
        ) {
          result.push(parent.children[1].children[0].id);
        }
      }
      this.getChildrenAndEnd(record, result);
    }
    return result;
  };

  getNodeById = (data, id) => {
    for (let i = 0; i < data.length; i += 1) {
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

  getChildrenAndEnd = (record, result) => {
    if (record.children) {
      record.children.forEach((item) => {
        if (item.type === 'node') {
          result.push(item.id);
        }
        this.getChildrenAndEnd(item, result);
      });
    }
    if (record.end) {
      this.getChildrenAndEnd(record.end, result);
    }
  };

  // 获取节点信息
  getNodeList = () => {
    const { entityType, entityId, flagUrl, instanceId } = this.props;
    let handleMethod;
    switch (flagUrl) {
      case 'todo':
        handleMethod = service.getApprovalNodeValueByTodo;
        break;
      case 'byOwner':
        handleMethod = service.getApprovalNodeValueByOwner;
        break;
      case 'done':
        handleMethod = service.getApprovalNodeValueByDone;
        break;
      default:
        handleMethod = service.getApprovalNodeValue;
        break;
    }
    if (entityId && entityType) {
      handleMethod(entityId, entityType, null, instanceId)
        .then((res) => {
          const temp = {};
          if (res && res.data) {
            const { data } = res.data;
            const nodeInfo = res.data.processContent
              ? JSON.parse(res.data.processContent)
              : null;
            temp.nodes = nodeInfo;
            temp.previewNodeMap =
              data && Array.isArray(data) && data[0]
                ? data[0].previewNodeMap
                : {};
            // const nodeInfo = JSON.parse(s.processContent);
            // temp.nodes = nodeInfo;
            // temp.previewNodeMap = s.data[0].previewNodeMap;
          }
          this.setState(temp, () => {
            const { nodes, isShowNotPASSNode } = this.state;
            if (!isShowNotPASSNode) {
              this.handleGetTreeDeep(nodes);
              if (!this.flag) {
                this.handleGetTreeDeep(nodes);
              }
            }
            this.setState({ spinLoading: false });
          });
        })
        .catch((err) => {
          console.error(err);
          this.setState({ spinLoading: false });
        });
    }
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  /**
   * 优先从redux中取数据，如果没有则判断外界是否传入，使用外界的，否则则使用默认的
   * @returns
   */
  getLanguageInfo = () => {
    const { languages } = this.props;
    const { getState } = window?.g_app?._store || {};
    if (getState) {
      const { languages } = getState?.();
      if (languages?.local && languages?.languageType) {
        return languages;
      }
    }
    if (languages) {
      return languages;
    }
    return {};
  };

  render() {
    const { visible, entityType, entityId, taskId, instanceId, flagUrl } =
      this.props;
    const { spinLoading, nodes, previewNodeMap, isShowNotPASSNode } =
      this.state;
    const language = this.getLanguageInfo();
    return (
      <Modal
        visible={visible}
        title={messages('workflow.preview') /* 工作流预览 */}
        footer={null}
        width="90vw"
        destroyOnClose
        onCancel={this.handleCancel}
        bodyStyle={{ minHeight: '580px', padding: 0 }}
        wrapClassName="approval-flow-preview-modal"
      >
        <Spin spinning={spinLoading} delay={300}>
          <div className="flow-design-preview-box">
            {nodes && !spinLoading && (
              <div
                style={{
                  overflow: 'scroll',
                  height: '580px',
                  backgroundColor: '#F7F8FA',
                  position: 'relative',
                }}
              >
                <FlowDesignParcel
                  previewNodeMap={previewNodeMap}
                  data={nodes}
                  disabledEvent
                  hiddenAdd
                  id="approval-flow-preview-out"
                  miniStyle={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 103,
                  }}
                  entityType={entityType}
                  entityId={entityId}
                  instanceId={instanceId}
                  flagUrl={flagUrl}
                  taskId={taskId}
                  language={language}
                  isShowNotPASSNode={isShowNotPASSNode}
                />
              </div>
            )}
          </div>
        </Spin>
      </Modal>
    );
  }
}

// ApprovalFlowPreview.propTypes = {
//   visible: PropTypes.bool,
// };

ApprovalFlowPreview.defaultProps = {
  visible: false,
};

export default ApprovalFlowPreview;

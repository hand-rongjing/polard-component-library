import React, { Component } from 'react';
import { Spin, Select, Tag } from 'antd';
import { messages } from '../../../utils';
import FlowDesignInner from './flow-design-inner';
import service from '../service';

class PreviewInner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinLoading: true,
      nodes: null,
      curPreviewNodeMap: {},
      group: [],
      curGroupId: '',
    };
    this.flag = true;
  }

  componentDidMount() {
    this.getInnerApprovalNode();
  }

  handleGetTreeDeep = (node) => {
    const { curPreviewNodeMap: previewNodeMap } = this.state;
    if (node.end) {
      this.handleGetTreeDeep(node.end);
    }
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i -= 1) {
        const item = node.children[i];
        // this.handleGetTreeDeep(item);
        if (
          (previewNodeMap[item.id] &&
            previewNodeMap[item.id].nodeStatus === 'WITHOUT_PASS') ||
          (!previewNodeMap[item.id] &&
            item.type === 'node' &&
            !['start', 'end', 'add', null].includes(item.id))
        ) {
          this.deleteNode(item);
          break;
        }
        this.handleGetTreeDeep(item);
      }
    }
  };

  deleteNode = (record) => {
    const { nodes } = this.state;
    // const ids = this.getDeleteNodesByNode(record);

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
          // otherNode = parent.children[1];
          [, otherNode] = parent.children;
        } else {
          // otherNode = parent.children[0];
          [otherNode] = parent.children;
        }
        if (otherNode.children && otherNode.children.length) {
          if (
            otherNode.children.length === 1 &&
            otherNode.children[0].dataType === 'condition'
          ) {
            temp.children = otherNode.end.children;
            temp.end = otherNode.end.end;
            this.flag = false;
          } else {
            temp.children = otherNode.children;
            temp.end = otherNode.end;
          }
        } else {
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
          } else {
            temp.children = parent.end.children;
            temp.end = parent.end.end;
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
  getInnerApprovalNode = () => {
    const {
      entityType,
      entityId,
      currentClickNodeId,
      isShowNotPASSNode,
      instanceId,
      flagUrl,
    } = this.props;

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

    if (entityId && entityType && currentClickNodeId) {
      handleMethod(entityId, entityType, currentClickNodeId, instanceId)
        .then((res) => {
          const temp = {};
          if (res && res.data) {
            const { data } = res.data;
            temp.nodes = res.data.processContent
              ? JSON.parse(res.data.processContent)
              : null;
            temp.curPreviewNodeMap =
              data && Array.isArray(data) && data[0]
                ? data[0].previewNodeMap
                : {};
            temp.curGroupId =
              data && Array.isArray(data) && data[0] ? data[0].groupId : '';
            if (Array.isArray(data) && data.length >= 1 && data[0].groupId) {
              temp.group = data;
            }
          }
          this.setState(temp, () => {
            const { nodes } = this.state;
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

  handleChangeGroup = (value) => {
    if (value) {
      const { group } = this.state;
      const temp = group.find((item) => item.groupId === value);
      this.setState({
        curPreviewNodeMap: temp.previewNodeMap,
        curGroupId: value,
      });
    }
  };

  render() {
    const { spinLoading, nodes, group, curGroupId, curPreviewNodeMap } =
      this.state;
    const { language } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        {Array.isArray(group) && !!group.length && (
          <Select
            onChange={this.handleChangeGroup}
            style={{
              width: '200px',
              position: 'absolute',
              zIndex: 10004,
              top: 10,
              left: 10,
            }}
            getPopupContainer={(node) => node.parentNode}
            value={curGroupId}
          >
            {group.map((item) => {
              return (
                <Select.Option key={item.groupId}>
                  <span>{item.title}</span>
                  {item.currentFlag ? (
                    <Tag
                      style={{
                        background: '#FDE9EC',
                        border: '1px solid #FF465D',
                        borderRadius: '2px',
                        fontSize: '8px',
                        color: '#FF465D',
                        marginLeft: '20px',
                        display: 'inline',
                        verticalAlign: 'middle',
                      }}
                    >
                      {messages('common.approving')}
                    </Tag>
                  ) : null}
                </Select.Option>
              );
            })}
          </Select>
        )}

        <Spin spinning={spinLoading} delay={300}>
          <div className="flow-design-preview-box">
            {nodes && !spinLoading && (
              <div
                style={{
                  overflow: 'scroll',
                  height: '450px',
                  backgroundColor: '#F7F8FA',
                  position: 'relative',
                }}
              >
                <FlowDesignInner
                  previewNodeMap={curPreviewNodeMap}
                  curGroupId={curGroupId}
                  data={nodes}
                  disabledEvent
                  hiddenAdd
                  id="approval-flow-preview-inner"
                  miniStyle={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 103,
                  }}
                  language={language}
                />
              </div>
            )}
          </div>
        </Spin>
      </div>
    );
  }
}

export default PreviewInner;

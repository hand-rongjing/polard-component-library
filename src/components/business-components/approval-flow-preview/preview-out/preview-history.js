import React, { Component } from 'react';
import { Card, Modal, Row, Col, Popover } from 'antd';
import moment from 'moment';
import { messages } from '../../../utils';
import PreviewInner from '../preview-inner';
import {
  statusStyle,
  nameStyle,
  fontStyle,
  approvalNameStyle,
  smartNodeStyle,
} from '../constant.js';
import '../style.less';

class PreviewHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      historyData: null,
      currentClickNodeId: '',
    };
  }

  componentDidMount() {
    const { previewNodeMap, node } = this.props;
    this.setState({
      historyData:
        previewNodeMap[node.id] && previewNodeMap[node.id].historyList,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { node } = this.props;
    if (nextProps.node.id !== node.id) {
      const { previewNodeMap } = nextProps;
      this.setState({
        historyData:
          previewNodeMap[nextProps.node.id] &&
          previewNodeMap[nextProps.node.id].historyList,
      });
    }
  }

  // 查看审批链详情
  handlePreviewChain = (e, node) => {
    if (e) e.preventDefault();
    this.setState({
      modalVisible: true,
      currentClickNodeId: node.id,
    });
  };

  handleCloseModal = () => {
    this.setState({
      modalVisible: false,
      currentClickNodeId: '',
    });
  };

  renderDetail = () => {
    const { node, previewNodeMap = {} } = this.props;
    const { dataType, missed, current } = node;
    const personName = previewNodeMap[node.id]
      ? previewNodeMap[node.id].personsName
      : '';
    // 条件节点只显示审批状态
    const isOnlyApprovalState = dataType !== 'condition';

    // 智能审核节点不显示审批人，因为没有审批人（后端说是通过nodeType字段判断）
    const smartNodeFlag = node?.shape === 'smart-node';

    /** passed: 已通过， arriving: 未到达, missed: 不经过 */
    if (current) {
      return (
        <div>
          <div>
            <span style={statusStyle}>
              {messages('common.approving') /* 审批中 */}
            </span>
            {dataType === 'approval-chain' && (
              <a
                style={{ float: 'right' }}
                onClick={(e) => {
                  this.handlePreviewChain(e, node);
                }}
              >
                {messages('workflow.view.approval.chain') /*查看审批链*/}
              </a>
            )}
          </div>
          {isOnlyApprovalState && !smartNodeFlag ? (
            <p style={approvalNameStyle}>
              {messages('common.approver') /*审批人*/}：
              <span style={{ color: '#666' }}>
                {this.renderPersonsName(personName)}
              </span>
            </p>
          ) : (
            <p style={smartNodeStyle} />
          )}
        </div>
      );
    } else if (previewNodeMap[node.id]?.nodeStatus) {
      return (
        <div>
          <div>
            <span style={statusStyle}>
              {previewNodeMap[node.id]?.nodeStatusDesc}
            </span>
            {dataType === 'approval-chain' && (
              <a
                style={{ float: 'right' }}
                onClick={(e) => {
                  this.handlePreviewChain(e, node);
                }}
              >
                {messages('workflow.view.approval.chain')}
              </a>
            )}
          </div>
          {isOnlyApprovalState && !smartNodeFlag ? (
            <p style={approvalNameStyle}>
              {messages('common.approver') /*审批人*/}：
              <span style={{ color: '#666' }}>
                {this.renderPersonsName(personName)}
              </span>
            </p>
          ) : (
            <p style={smartNodeStyle} />
          )}
        </div>
      );
    } else if (missed) {
      return (
        <div>
          <div>
            <span style={statusStyle}>
              {messages('workflow.not.through') /*不经过*/}
            </span>
          </div>
          <p style={{ ...approvalNameStyle, color: '#666' }}>
            {messages('workflow.node.not.participate') /*该节点不参与审批操作*/}
          </p>
        </div>
      );
    }
  };

  renderHistory = () => {
    const { historyData } = this.state;
    if (historyData) {
      return (
        <div>
          <div
            style={{
              fontSize: '12px',
              color: '#666666',
              lineHeight: '14px',
              marginBottom: '16px',
            }}
          >
            {messages('workflow.approval.record') /*审批记录*/}
          </div>
          {Array.isArray(historyData) &&
            historyData.map((item, index) => {
              const dataIndex = `history${index}`;
              return (
                <Row key={dataIndex} style={{ marginBottom: '24px' }}>
                  <Col span={4}>
                    <div style={nameStyle}>
                      {String(item.userName).slice(-2)}
                    </div>
                  </Col>
                  <Col span={20} style={fontStyle}>
                    <div style={{ color: '#333', marginBottom: 8 }}>
                      {item.operationDesc}
                      <span style={{ float: 'right', color: '#999' }}>
                        {item.userName}
                      </span>
                    </div>
                    <div style={{ color: '#666', marginBottom: 8 }}>
                      {item.operationRemark}
                    </div>
                    <div style={{ color: '#999' }}>
                      {moment(item.lastUpdatedDate).format(
                        'YYYY-MM-DD HH:mm:ss',
                      )}
                    </div>
                  </Col>
                </Row>
              );
            })}
        </div>
      );
    }
  };

  renderPersonsName = (name) => {
    return <Popover content={name}> {name}</Popover>;
    // const { historyFlag } = this.props;
    // const maxLen = historyFlag ? 34 : 22;
    // if (name && name.length > maxLen) {
    //   return (
    //     <Popover content={name}>{`${name.substring(0, maxLen)}...`}</Popover>
    //   );
    // } else return name;
  };

  render() {
    const { modalVisible, currentClickNodeId } = this.state;
    const { historyFlag } = this.props;

    return (
      <div className="approval-flow-preview">
        <Card
          headStyle={{ padding: '18px 20px 16px' }}
          bodyStyle={historyFlag ? { padding: '12px 20px' } : { padding: 0 }}
          title={this.renderDetail()}
        >
          {historyFlag && this.renderHistory()}
        </Card>
        <Modal
          visible={modalVisible}
          title={messages('workflow.approval.chain')}
          onCancel={this.handleCloseModal}
          width="90vw"
          footer={null}
          destroyOnClose
          bodyStyle={{ minHeight: 300 }}
        >
          <PreviewInner
            {...this.props}
            currentClickNodeId={currentClickNodeId}
          />
        </Modal>
      </div>
    );
  }
}

export default PreviewHistory;

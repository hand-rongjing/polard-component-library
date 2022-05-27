import React, { Component } from 'react';
import { Card, Row, Col, Popover } from 'antd';
import moment from 'moment';
import { messages } from '../../../utils';
import {
  statusStyle,
  nameStyle,
  fontStyle,
  approvalNameStyle,
} from '../constant.js';

class PreviewHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyData: null,
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

  renderDetail = () => {
    const { node, previewNodeMap = {} } = this.props;
    const { dataType, passed, arriving, missed, current, arrived } = node;
    const personName = previewNodeMap[node.id]
      ? previewNodeMap[node.id].personsName
      : '';

    // 条件节点只显示审批状态
    const isOnlyApprovalState = dataType !== 'condition';
    /** passed: 已通过， arriving: 未到达, missed: 不经过 */
    if (current) {
      return (
        <div>
          <div>
            <span style={statusStyle}>
              {dataType === 'financial-shared'
                ? messages('common.auditing' /* 审核中 */)
                : messages('common.approving')}
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
          {isOnlyApprovalState && (
            <p style={approvalNameStyle}>
              {dataType === 'financial-shared'
                ? messages('common.auditing.people')
                : messages('common.approver')}
              ：
              <span style={{ color: '#666' }}>
                {this.renderPersonsName(personName)}
              </span>
            </p>
          )}
        </div>
      );
    } else if (arriving) {
      return (
        <div>
          <div>
            <span style={statusStyle}>
              {messages('common.pending.approval') /*待审批*/}
            </span>
          </div>
          {isOnlyApprovalState && (
            <p style={approvalNameStyle}>
              {messages('common.approver')}：
              <span style={{ color: '#666' }}>
                {this.renderPersonsName(personName)}
              </span>
            </p>
          )}
        </div>
      );
    } else if (missed) {
      return (
        <div>
          <div>
            <span style={statusStyle}>{messages('workflow.not.through')}</span>
          </div>
          <p style={{ ...approvalNameStyle, color: '#666' }}>
            {messages('workflow.node.not.participate')}
          </p>
        </div>
      );
    } else if (passed) {
      return (
        <div>
          <div>
            <span style={statusStyle}>{messages('common.approve.pass')}</span>
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
          {isOnlyApprovalState && (
            <p style={approvalNameStyle}>
              {messages('common.approver')}：
              <span style={{ color: '#666' }}>
                {this.renderPersonsName(personName)}
              </span>
            </p>
          )}
        </div>
      );
    } else if (arrived) {
      return (
        <div>
          <div>
            <span style={statusStyle}>{messages('workflow.arrived')}</span>
          </div>
          {isOnlyApprovalState && (
            <p style={approvalNameStyle}>
              {messages('common.approver')}：
              <span style={{ color: '#666' }}>
                {this.renderPersonsName(personName)}
              </span>
            </p>
          )}
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
            {messages('workflow.approval.record')}
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
                    <div
                      style={{ color: '#333', marginBottom: 8, minHeight: 12 }}
                    >
                      {item.operationDesc}
                      <span style={{ float: 'right', color: '#999' }}>
                        {`${item.userName}`}
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
    const { historyFlag } = this.props;
    const maxLen = historyFlag ? 32 : 22;
    if (name && name.length > maxLen) {
      return (
        <Popover content={name}>{`${name.substring(0, maxLen)}...`}</Popover>
      );
    } else return name;
  };

  render() {
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
      </div>
    );
  }
}

export default PreviewHistory;

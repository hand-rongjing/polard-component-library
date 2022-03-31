import React from 'react';
import { Collapse, Timeline, Spin, Row, Col, Empty, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
// @ts-ignore
import httpFetch from 'share/httpFetch';
// @ts-ignore
import config from 'config';
import ApprovalFlowPreview from '../approval-flow-preview';
import { IProps, IState } from './interface';
import { modelInfoMap } from './config';
import { messages } from '../../utils';
import Waring from './images/waring.svg';
import './style.less';
/**
 * 审批历史
 */
interface IModel {
  text: string;
  color: string;
  dot?: string;
  isPending?: Boolean;
}

class WorkFlowApproveHistory extends React.Component<IProps, IState> {
  static defaultProps = {
    entityType: '',
    documentId: '',
    infoData: [],
    slideFrameFlag: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      historyData: [],
      loading: false,
      expenseColorFlag: false,
      showWaitDo: false, // 是否显示等待处理
      viewVisible: false, // 显示工作流
    };
  }

  componentDidMount() {
    this.getHistoryData();
  }

  componentWillReceiveProps(nextProps) {
    const { infoData, entityType, documentId, url, params } = this.props;
    if (
      (infoData && infoData.length !== nextProps.infoData.length) ||
      nextProps.entityType !== entityType ||
      nextProps.documentId !== documentId ||
      nextProps.params?.businessId !== params?.businessId ||
      nextProps.url !== url
    ) {
      this.getHistoryData(nextProps);
    }
  }

  getHistoryData = (props = this.props) => {
    const { entityType, documentId, infoData, url, methodType, params } = props;
    if (!infoData || !infoData.length) {
      this.setState({ loading: true });
      if (!url) {
        if (!entityType || !documentId) {
          this.setState({ loading: false });
          return;
        }
        console.log(
          `${config.wflUrl}/api/workflow/approval/history?entityType=${entityType}&entityId=${documentId}`,
        );
        httpFetch
          .get(
            `${config.wflUrl}/api/workflow/approval/history?entityType=${entityType}&entityId=${documentId}`,
          )
          .then((res) => {
            console.log(res.data, 'res');
            this.setState({ historyData: res.data, loading: false });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ loading: false });
          });
      } else {
        if (params.businessId) {
          httpFetch[methodType || 'get'](url, params)
            .then((res) => {
              this.setState({
                historyData: res.data,
                loading: false,
                expenseColorFlag: true,
              });
            })
            .catch((err) => {
              console.log(err);
              this.setState({ loading: false });
            });
        }
        this.setState({ loading: false });
      }
    } else {
      this.setState({
        historyData: infoData,
        loading: false,
      });
    }
  };

  getHistory = () => {
    const { historyData, showWaitDo } = this.state;
    const children = [];
    if (showWaitDo) {
      historyData.forEach((item, i) => {
        children.push(this.getHistoryRender(item, i));
      });
    } else {
      historyData.forEach((item, i) => {
        if (item.operationType !== '9998') {
          // 9998: 等待处理
          children.push(this.getHistoryRender(item, i));
        }
      });
    }
    return children;
  };

  getColor = (value) => {
    const model: IModel = {} as IModel;
    model.text = value.operationDesc;
    switch (value.operationType) {
      case 1000:
        if (value.operation === 1001) {
          // 新建
          model.color = '#4390FF';
        } else if (value.operation === 1002) {
          // 提交
          model.color = '#4390FF';
        } else if (value.operation === 3011) {
          // 自动转交
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 1003) {
          // 撤回
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else if (value.operation === 1004) {
          // 审批通过
          model.color = '#3ABFA5';
          model.dot = 'check-circle-o';
        } else if (value.operation === 1005) {
          // 审批驳回
          model.color = '#EA4343';
          model.dot = 'close-circle-o';
        } else if (value.operation === 6001) {
          // 暂挂中
          model.color = '#4390FF';
        } else if (value.operation === 6002) {
          // 已取消
          model.color = '#4390FF';
        } else if (value.operation === 6003) {
          // 已完成
          model.color = '#4390FF';
        } else if (value.operation === 6004) {
          // 取消暂挂
          model.color = '#4390FF';
        } else if (value.operation === 7001) {
          // 关闭
          model.color = '#4390FF';
          model.dot = 'close-circle';
        } else if (value.operation === 9001) {
          // 支付
          model.color = '#4390FF';
          model.dot = 'pay-circle-o';
        } else if (value.operation === 9002) {
          // 退款
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else if (value.operation === 9003) {
          // 退票
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else if (value.operation === 9004) {
          // 反冲
          model.color = '#4390FF';
          model.dot = 'clock-circle-o';
        } else if (value.operation === 6005) {
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
          model.text = '变更';
        } else {
          // 未知
          model.color = '#4390FF';
        }
        break;
      case 1009:
        if (value.operation === 1000) {
          // 工作台--入池
          model.color = '#4390FF';
        } else if (value.operation === 1001) {
          // 工作台--分配
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else {
          /**
           * 1002(工作台--通过)  <'workflow.workbench.log.approve'>
           * 1003(退回至上一节点)  <'workflow.workbench.log.returnFrontNode'>
           * 1004(退回至申请人)  <'workflow.workbench.log.reject'>
           * 1005(暂挂)  <'workflow.workbench.log.hold'>
           * 1006(取消暂挂)  <'workflow.workbench.log.cancelHold'>
           * 1007(申请退回)  <'workflow.workbench.log.applyReturn'>
           * 1008(申请退回通过)  <'workflow.workbench.log.applyReturnApprve'>
           * 1009(申请退回驳回)  <'workflow.workbench.log.applyReturnReject'>
           * 1010(强制申请退回)  <'workflow.workbench.log.forceApplyReturn'>
           */
          model.dot = 'down-circle-o';
          model.color = '#4390FF';
        }
        break;
      default:
        if (value.operation === 1001) {
          // 提交
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 3011) {
          // 自动转交
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 1002) {
          // 撤回
          model.color = '#4390FF';
          model.dot = 'down-circle-o';
        } else if (value.operation === 2001) {
          // 审批通过
          model.color = '#3ABFA5';
          model.dot = 'check-circle-o';
        } else if (value.operation === 2002) {
          // 审批驳回
          model.color = '#EA4343';
          model.dot = 'close-circle-o';
        } else if (value.operation === 2004) {
          // 审批退回
          model.color = '#4390FF';
          model.dot = 'left-circle-o';
        } else if (value.operation === 3001) {
          // 转交
          model.color = '#4390FF';
          model.dot = 'solution-o';
        } else if (value.operation === 3002) {
          // 加签
          model.color = '#4390FF';
          model.dot = 'solution-o';
        } else if (value.operation === 3003) {
          // 重启
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 3004) {
          // 关闭
          model.color = '#EA4343';
        } else if (value.operation === 3009) {
          // 跳转
          model.color = '#4390FF';
          model.dot = 'sync-o';
        } else if (value.operation === 5004) {
          // 还款提交
          model.color = '#4390FF';
          model.dot = 'up-circle-o';
        } else if (value.operation === 5009) {
          // 添加会签
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 9101) {
          // 邮寄
          model.color = '#4390FF';
          model.dot = 'check-circle-o';
        } else if (value.operation === 9102) {
          // 签收
          model.color = '#4390FF';
          model.dot = 'check-circle-o';
        } else if (value.operation === 9103) {
          // 邮退
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 9104) {
          // 核对通过
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 9105) {
          // 核对驳回
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 9106) {
          // 通知补寄
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        } else if (value.operation === 'CANCEL_APPROVAL') {
          // 撤销（撤销审批）
          model.color = '#EA4343';
        } else if (value.operation === '9999' || value.operation === '9998') {
          // 待处理 等待处理
          // 待处理
          model.color = '#D5DAE0'; // 灰色
          model.isPending = true;
        } else {
          // 其他
          model.color = '#4390FF';
          model.dot = 'close-circle-o';
        }
        break;
    }
    return model;
  };

  getExpenseColor = (value) => {
    const operationType =
      value.operationType == '1002'
        ? `${value.operationType}-${value.source}`
        : value.operationType;
    const model: IModel = {
      text: value.operationTypeName,
      ...modelInfoMap[operationType || 'default'],
    };
    return model;
  };

  showApproveFlow = (viewVisible) => {
    this.setState({ viewVisible });
  };

  /**
   * 自动转交时有换行符需要进行转换
   */
  operationRemarkTransfer = (item) => {
    if (item.operationRemark && item.operationRemark.indexOf('\n')) {
      return item.operationRemark.split('\n').map((itemChild) => (
        <div>
          <div>{itemChild}</div>
          <br />
        </div>
      ));
    }
    return item.operationRemark;
  };

  getHistoryRender = (item, i) => {
    const { expenseColorFlag, historyData } = this.state;
    if (item) {
      const model =
        expenseColorFlag || item.hasOwnProperty('operationTypeName')
          ? this.getExpenseColor(item)
          : this.getColor(item);
      const description = item.hasOwnProperty('description')
        ? item.description
        : this.operationRemarkTransfer(item);
      const typeList = historyData.map((o) => o.operationType);
      const wLastIndex = typeList.lastIndexOf('9998'); // 查找等待处理最后一个元素的下标
      const isLatest =
        historyData[wLastIndex + 1].operationType == '9999'
          ? i == wLastIndex + 2
          : i == wLastIndex + 1; // 最新节点展示颜色
      return (
        <Timeline.Item
          dot={
            <div
              className={
                model.isPending
                  ? 'circle-dot'
                  : isLatest
                  ? 'solid-dot-l'
                  : 'solid-dot'
              }
              style={{ background: isLatest ? model.color : '' }}
            />
          }
          color={isLatest ? model.color : '#D5DAE0'}
          key={i}
          label={
            item.lastUpdatedDate ? (
              <div>
                <div>{moment(item.lastUpdatedDate).format('YYYY-MM-DD')}</div>
                <div className="time">
                  {moment(item.lastUpdatedDate).format('HH:mm')}
                </div>
              </div>
            ) : (
              ''
            )
          }
          className={model.isPending ? 'pending-line' : ''}
        >
          <Row>
            <Col span={24}>
              <div
                style={{
                  marginBottom: 8,
                  color: item.operationType === '9998' ? '#BFC7DC' : '#333333',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{model.text}</span>
                <span style={{ margin: '0 8px' }}>{item.approvalNodeName}</span>
                <span>
                  {item.operationMethodName === 'ROBOT'
                    ? `${item.userName}`
                    : item.hasOwnProperty('createdByName')
                    ? `${item.createdByName ? item.createdByName : ''}${
                        item.createdByCode ? '-' + item.createdByCode : ''
                      }`
                    : `${item.userName ? item.userName : ''}${
                        item.userCode ? `-${item.userCode}` : ''
                      }`}
                </span>
              </div>
              {description ? (
                <div
                  className={`times-desc ${
                    item.operationType === '2002' ? 'times-desc-warning' : ''
                  }`}
                >
                  {item.operationType === '2002' ? (
                    <img src={Waring} className="waring" alt="" />
                  ) : (
                    ''
                  )}
                  {description}
                </div>
              ) : (
                <div style={{ height: 15 }} />
              )}
            </Col>
          </Row>
        </Timeline.Item>
      );
    }
    return '';
  };

  changeShowWaitDo = (flag) => {
    this.setState({ showWaitDo: flag });
  };

  viewFlowRender = () => {
    const { showWaitDo, historyData } = this.state;
    const hasWaitDo = historyData.filter((o) => o.operationType === '9998');
    return (
      <div>
        <div className="view-flow">
          <Button type="primary" onClick={() => this.showApproveFlow(true)}>
            {messages('common.view.flow.chart') /* 查看流程图 */}
          </Button>
          <span className="subtext">
            {
              messages(
                'common.view.flow.remark',
              ) /* 注：审批流预览按当前工作流显示，但实际会根据配置变化而改变。 */
            }
          </span>
        </div>
        {hasWaitDo.length > 0 && (
          <div className="show-waitdo">
            {showWaitDo ? (
              <Button type="link" onClick={() => this.changeShowWaitDo(false)}>
                {messages('close.approve.flow.view') /* 收起审批流预览 */}
                <UpOutlined />
              </Button>
            ) : (
              <Button type="link" onClick={() => this.changeShowWaitDo(true)}>
                {messages('approve.flow.preview') /* 审批流预览 */}
                <DownOutlined />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  render() {
    const { loading, historyData, viewVisible } = this.state;
    const { slideFrameFlag, expandIcon, header, documentId, entityType } =
      this.props;
    return (
      <Spin spinning={loading}>
        <div className="approve-history">
          {slideFrameFlag ? (
            <div>
              <div
                className="common-item-title"
                style={{ marginTop: 20, marginBottom: 16 }}
              >
                {header || messages('common.approval.history')}
              </div>
              {this.viewFlowRender()}
              {historyData.length ? (
                <Timeline className="times">{this.getHistory()}</Timeline>
              ) : (
                <Empty style={{ textAlign: 'center' }} />
              )}
            </div>
          ) : (
            <div style={{ borderRadius: 4 }} className="collapse">
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIconPosition="right"
                expandIcon={expandIcon}
              >
                <Collapse.Panel
                  header={header || messages('common.approval.history')}
                  key="1"
                >
                  <div style={{ paddingLeft: 18, marginTop: 8 }}>
                    {this.viewFlowRender()}
                    {historyData.length ? (
                      <Timeline className="times">{this.getHistory()}</Timeline>
                    ) : (
                      <Empty style={{ textAlign: 'center' }} />
                    )}
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          )}
        </div>

        {documentId && (
          <ApprovalFlowPreview
            visible={viewVisible}
            onCancel={() => this.showApproveFlow(false)}
            entityId={documentId}
            entityType={entityType}
            flagUrl="byHistory"
          />
        )}
      </Spin>
    );
  }
}

export default WorkFlowApproveHistory;

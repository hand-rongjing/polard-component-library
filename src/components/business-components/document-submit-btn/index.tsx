/*
 * @Author: binfeng.long@hand-china.com
 * @Date: 2021-10-29 14:23:27
 * @LastEditors: zong.wang01@hand-china.com
 * @LastEditTime: 2022-04-25 14:35:28
 * @Version: 1.0.0
 * @Description:
 * @Copyright: Copyright (c) 2021, Hand-RongJing
 */

import React, { Component, useState } from 'react';
import { Button, Modal, Form, Row, Col, Radio } from 'antd';
import config from 'config';
import httpFetch from 'share/httpFetch';
import { messages } from '../../utils';
import WrappedForm from '../../wrapped-form';
import { IProps, IState } from './interface';
import Lov from '../../form/lov';
import Drag from './drag';

import './style.less';

/**
 * 点击该组件，自动调用接口判断是否要展示模态框，并选取人员范围数据
 * 如果接口返回了数据，表示弹窗，根据数据渲染Form.Item，
 * 经选取值后 保存，保存成功后继续执行原父组件中单据提交的原函数
 * 如果接口没返回数据，则直接执行原父组件中单据提交事件
 */
export default function DocumentSubmitBtn(props: IProps) {
  // @ts-ignore
  const { $goBack } = React.Component.prototype;
  const [form] = Form.useForm();
  const {
    btnLoading = false,
    url = '',
    onClick = () => {},
    approvalRule = '',
    block,
    className,
  } = props;

  const [showModalVisible, setShowModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState<Array<any>>([]);

  const selectorItem = {
    title: 'common.select.staff',
    url: `${config.wflUrl}/api/wfl/identity/optional/query/by/document`,
    searchForm: [
      { type: 'input', id: 'userCode', label: 'common.staff.code' },
      { type: 'input', id: 'userName', label: 'common.staff.name' },
    ],
    columns: [
      { title: 'common.staff.code', dataIndex: 'userCode', width: '25%' },
      { title: 'common.staff.name', dataIndex: 'userName', width: '25%' },
    ],
    key: 'userId',
    method: 'post',
  };

  // 提交按钮-是否展示模态框
  const handleModalShow = () => {
    if (['RETURN_NODE', 'RETURN_WORKBANCH'].includes(approvalRule)) {
      onClick();
      return;
    }
    setLoading(true);
    httpFetch
      .get(url)
      .then((res: any) => {
        const { data } = res;
        if (data && data.length) {
          setShowModalVisible(true);
          setItemList(data);
          setLoading(false);
        } else {
          setLoading(false);
          onClick();
        }
      })
      .catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
  };

  // 删除审批人
  const handleDel = (list: any, index: number, itemIndex: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    const field = itemList[itemIndex].approvalNodeId;
    form.setFieldsValue({ [field]: newList });
    itemList[itemIndex].lovList = [...newList];
    setItemList([...itemList]);
  };

  // 拖拽回调
  const dragBack = (data: any, index: number) => {
    const field = itemList[index].approvalNodeId;
    form.setFieldsValue({ [field]: data });
    itemList[index].lovList = [...data];
    setItemList([...itemList]);
  };

  const lovChange = (value: any, index: number) => {
    const newList = [...itemList];
    newList[index].lovList = [...value];
    setItemList([...newList]);
  };

  const radioChange = (value: any, index: number) => {
    console.log('orderType', value);
    const newList = [...itemList];
    newList[index].orderType = value;
    setItemList([...newList]);
  };

  // 渲染Form.Item
  const renderFormItem = () => {
    console.log('itemList', itemList);
    if (Array.isArray(itemList) && itemList.length) {
      return itemList.map((item: any, index) => {
        const itemIndex = `item${index}`;
        const approveList = item.lovList;
        const canDrag = item.orderType || 1;
        return (
          <Row key={itemIndex} wrap={false} className="doc-submit-btn-wfl">
            <Col
              flex="130px"
              style={{ textAlign: 'right', paddingTop: 5, marginBottom: 16 }}
            >
              {item.title}：
            </Col>

            <Col flex="auto">
              {item.multiSelectFlag && approveList?.length > 0 && (
                <Row align="middle" style={{ paddingTop: 5 }}>
                  <Col>
                    <Drag
                      list={approveList}
                      itemIndex={index}
                      handleDel={(list: any, delIndex: number) =>
                        handleDel(list, delIndex, index)
                      }
                      dragBack={(data: any) => dragBack(data, index)}
                      canDrag={canDrag && canDrag === 2}
                    />
                  </Col>
                </Row>
              )}
              <Row align="middle">
                <Col flex="240px">
                  <Form.Item
                    className={item.multiSelectFlag ? 'lov-hidden-val' : ''}
                    name={item.approvalNodeId}
                    rules={[
                      {
                        required: item.required,
                        message: messages('common.please.select'),
                      },
                    ]}
                  >
                    <Lov
                      // @ts-ignore
                      selectorItem={selectorItem}
                      labelKey="userName"
                      valueKey="userId"
                      showDetail={false}
                      listExtraParams={{}}
                      single={!item.multiSelectFlag || false}
                      method={selectorItem.method}
                      requestBody={item}
                      lovType="chooser"
                      onChange={(val: any) => lovChange(val, index)}
                    />
                  </Form.Item>
                </Col>
                {item.multiSelectFlag && (
                  <Col flex="182px" style={{ marginLeft: 16 }}>
                    <Form.Item
                      name={`order-${item.approvalNodeId}`}
                      initialValue={1}
                    >
                      <Radio.Group
                        value={1}
                        style={{ display: 'flex' }}
                        onChange={(e) => radioChange(e.target.value, index)}
                      >
                        <Radio value={1} style={{ flex: 'none' }}>
                          {messages(
                            'common.simultaneous.approval' /* 同时审批 */,
                          )}
                        </Radio>
                        <Radio value={2} style={{ flex: 'none' }}>
                          {messages(
                            'common.sequential.approval' /* 顺序审批 */,
                          )}
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        );
      });
    }
  };

  // 关闭弹窗
  const handleCancel = () => {
    setShowModalVisible(false);
    setLoading(false);
    setSubmitLoading(false);
    form.resetFields();
  };

  // 模态框确认按钮回调-收集参数值
  const handleOk = (e: any) => {
    e.preventDefault();
    setSubmitLoading(true);
    form
      .validateFields()
      .then((values) => {
        let temp: any[] = [];
        itemList.forEach((item) => {
          const key = item.approvalNodeId;
          if (!values[key]) {
            return false;
          }
          const approveOrder = values[`order-${key}`];
          if (approveOrder === 2) {
            values[key].forEach((o: any, i: number) => {
              temp.push({ ...o, sequence: i + 1 });
            });
          } else {
            values[key].forEach((o: any) => {
              temp.push({ ...o, sequence: 1 });
            });
          }
        });
        const formParams = {
          entityId:
            Array.isArray(itemList) &&
            itemList.length > 0 &&
            itemList[0]?.entityId,
          entityType:
            Array.isArray(itemList) &&
            itemList.length > 0 &&
            itemList[0]?.entityType,
          records: [...temp],
        };
        handleSaveRangeInfo(formParams);
      })
      .catch((err) => {
        setSubmitLoading(false);
        console.log(err);
      });
  };

  // 存储模态框选择的人员范围数据--调接口保存,完了之后正常提交 onClick的事件'
  const handleSaveRangeInfo = (params: any) => {
    const url = `${config.wflUrl}/api/wfl/identity/optional/choose/optional/select`;
    httpFetch
      .post(url, params)
      .then((res: any) => {
        if (res) {
          setShowModalVisible(false);
          setSubmitLoading(false);
          onClick(goBack);
          form.resetFields();
        }
      })
      .catch((err: any) => {
        setSubmitLoading(false);
        console.error(err);
      });
  };

  // 操作后返回到上个页面
  const goBack = () => {
    if ($goBack) {
      $goBack();
    }
  };

  return (
    <>
      <Button
        block={block}
        className={className}
        type="primary"
        loading={loading || btnLoading}
        onClick={handleModalShow}
      >
        {messages('common.submit')}
      </Button>
      <Modal
        visible={showModalVisible}
        title={messages('common.approver') /** 自选审批人 */}
        footer={null}
        width={620}
        bodyStyle={{ maxHeight: '400px', overflow: 'auto' }}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form form={form}>
          <div style={{ marginBottom: '48px' }}>{renderFormItem()}</div>
          <div
            className="slide-footer"
            style={{
              textAlign: 'right',
              height: '48px',
              lineHeight: '48px',
              paddingRight: '28px',
            }}
          >
            <Button
              className="btn"
              type="primary"
              onClick={handleOk}
              loading={submitLoading}
              style={{ minWidth: '72px' }}
            >
              {messages('common.save')}
            </Button>
            <Button
              className="btn"
              onClick={handleCancel}
              style={{ minWidth: '72px' }}
            >
              {messages('common.cancel')}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

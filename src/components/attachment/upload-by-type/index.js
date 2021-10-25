/**
 * 分类附件上传
 */
import React from 'react';
import {
  InfoCircleOutlined,
  UploadOutlined,
  UsbTwoTone,
} from '@ant-design/icons';
import { Tooltip, Upload, message } from 'antd';
import httpFetch from 'share/httpFetch';
import config from 'config';
import Folder from '@/assets/folder@2x.png';
import UploadFileList from '../upload-file-list';

import './upload-by-type.less';

const sizeDes = {
  1001: 'MB',
  1002: 'KB',
  1003: 'GB',
};
const sizeDividend = {
  1001: 1024 * 1024,
  1002: 1024,
  1003: 1024 * 1024 * 1024,
};

class UploadByType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Oids: [], // 附件oid
      fileList: [], // 附件列表
      accept: '.rar,.zip,.doc,.docx,.pdf,.jpg,.png', // 可上传附件格式
      params: {}, // 附件类型信息
      isExpand: false,
    };
  }

  componentDidMount() {
    this.setDefaultFile(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { defaultFileList } = this.props;
    if (nextProps.defaultFileList.length !== defaultFileList.length) {
      this.setDefaultFile(nextProps);
    }
  }

  // 获取默认附件列表
  setDefaultFile = (props) => {
    const {
      defaultFileList,
      params,
      isExpand,
      params: { attachmentFormatsList },
    } = props;
    const finalFormatList = attachmentFormatsList
      ? attachmentFormatsList.map((item) => `.${item.format.trim()}`)
      : [];
    const fileList = defaultFileList.map((item) => {
      const file = { ...item, ...(item.response || {}) };
      return file;
    });
    this.setState({
      accept: finalFormatList.length ? finalFormatList.join() : '',
      isExpand: !!isExpand,
      fileList,
      params,
    });
    this.setDefaultOids(defaultFileList);
  };

  // 把默认的fileList的Oid赋值给Oids
  setDefaultOids = (fileList) => {
    if (fileList.length) {
      // 在未传defaultOids的情况下
      const fileListOid = [];
      fileList.map((item) => {
        const attachmentOid = item.id || (item.response && item.response.id);
        if (attachmentOid) {
          fileListOid.push(attachmentOid);
        }
        return true;
      });
      this.setState({ Oids: fileListOid });
    }
  };

  // 附件类型标题
  renderTitle = () => {
    const { required, compact, titleClassName } = this.props;
    const {
      params: {
        attachmentName,
        formatFlag,
        sizeFlag,
        lowerLimit,
        upperLimit,
        sizeUnit,
        attachments,
      },
      isExpand,
      fileList,
      accept,
    } = this.state;
    const curSizeDes = sizeUnit ? sizeDes[sizeUnit] : 'MB';

    const title = (
      <div>
        <div className="tips-title">
          {this.$t('base.attachment.upload.instructions') /* 附件上传说明 */}
        </div>
        <div className="nowrap">
          {
            this.$t(
              this.$t('base.upload.attachment.format'),
            ) /* 可上传附件格式 */
          }
          ：{formatFlag ? this.$t('base.all') : accept.replace(/,/g, '/')}
        </div>
        <div className="nowrap">
          {this.$t('base.size.of.attachments') /* 可上传附件大小 */}：
          {sizeFlag
            ? this.$t('base.attachment.any.size')
            : `${lowerLimit}${curSizeDes}-${upperLimit}${curSizeDes}`}
        </div>
        <div className="type-template">
          <span className="template-label">
            {this.$t('base.attachment.template') /* 附件模板 */}：
          </span>
          <span className="type-template-list">
            {Array.isArray(attachments) && (
              <UploadFileList fileList={attachments} showRemoveIcon={false} />
            )}
          </span>
        </div>
      </div>
    );
    return (
      <span
        className={`clearfix upload-title ${titleClassName || ''}`}
        onClick={this.onExpand}
      >
        <span
          className="expand-ico-wrap"
          style={{ width: compact ? 'auto' : undefined }}
        >
          {!!fileList.length && (
            <span
              className={`ant-table-row-expand-icon ${
                isExpand
                  ? 'ant-table-row-expand-icon-expanded'
                  : 'ant-table-row-expand-icon-collapsed'
              }`}
            />
          )}
          {required ? <span className="required">*</span> : ''}
        </span>
        <img src={Folder} alt="folder" className="folder-ico" />
        <span className="upload-title-name over-range" title={attachmentName}>
          {attachmentName}
        </span>
        {!!fileList.length && (
          <span className="upload-num">({fileList.length})</span>
        )}
        <Tooltip placement="top" title={title} overlayClassName="type-tips">
          <InfoCircleOutlined className="tips-ico" />
        </Tooltip>
      </span>
    );
  };

  // 删除附件
  handleRemove = (info, index) => {
    const { disabled, isUseAttachmentId, backToNoType } = this.props;
    if (disabled) {
      message.warn(
        this.$t('upload.not.allowed.delete' /* 该状态不允许删除附件 */),
      );
      return;
    }
    if (info.fromNoType && backToNoType) {
      // 退回至待分类
      const {
        params: { attachmentCode },
      } = this.props;
      const result = this.deleteHandle(info, index);
      backToNoType([info], result, attachmentCode);
      return null;
    }
    let deleteUrl;
    if (isUseAttachmentId) {
      deleteUrl = `${config.fileUrl}/api/attachments?id=${
        info.response ? info.response.id : info.id
      }`;
    } else {
      deleteUrl = `${config.fileUrl}/api/attachments/${
        info.response ? info.response.id : info.id
      }`;
    }
    httpFetch
      .delete(deleteUrl)
      .then(() => {
        this.deleteHandle(info, index);
        message.success(this.$t('common.operate.success'));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 删除数据
  deleteHandle = (info, index) => {
    const { Oids, fileList } = this.state;
    Oids.map((Oid) => {
      if (Oid === (info.response ? info.response.id : info.id)) {
        Oids.delete(Oid);
      }
      return true;
    });

    fileList.splice(index, 1);

    this.setState({ fileList, Oids }, () => {
      const { uploadHandle, fileListChange } = this.props;
      if (uploadHandle) {
        uploadHandle(Oids, fileList);
      }
      if (fileListChange) {
        fileListChange(fileList);
      }
    });
    return { fileList, Oids };
  };

  // 附件上传按钮
  uploadComponent = () => {
    const { uploadUrl, multiple, disabled, isScan } = this.props;
    const { fileList, accept } = this.state;
    const uploadHeaders = {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      Accept: 'application/json, text/plain, */*',
    };
    return (
      <>
        {!!isScan && (
          <UsbTwoTone
            className="theme-color"
            style={{ marginRight: '8px' }}
            onClick={this.scanning}
          />
        )}

        <Upload
          name="file"
          action={uploadUrl}
          headers={uploadHeaders}
          data={this.handleData}
          fileList={fileList}
          multiple={multiple}
          disabled={disabled}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          showUploadList={false}
          accept={accept}
        >
          <UploadOutlined
            className="upload-ico theme-color"
            title={this.$t('base.click.upload.attachment') /* 点击上传附件 */}
          />
        </Upload>
      </>
    );
  };

  // 附件上传前的钩子函数
  beforeUpload = (file) => {
    const {
      fileList,
      accept,
      params: { formatFlag, sizeFlag, upperLimit, lowerLimit, sizeUnit },
    } = this.state;
    const { fileNum } = this.props;
    const curUnit = sizeUnit ? sizeDes[sizeUnit] : 'MB';
    const dividend = sizeUnit ? sizeDividend[sizeUnit] : 1024;
    const isLimitUpper = sizeFlag || file.size / dividend <= upperLimit;
    const isLimitLower = sizeFlag || file.size / dividend >= lowerLimit;
    const fileName = file.name || file.fileName || '';
    const fileType = fileName.split('.').pop().toLowerCase();
    const isType = formatFlag || accept.split(',').includes(`.${fileType}`);
    const isLimitNum = fileList.length < fileNum;
    if (!isLimitNum) {
      message.error(
        `${fileName} ${this.$t('base.upload.failed.at.fileNum', { fileNum })}`,
      );
      // 上传失败，最多上传${fileNum}个附件
    } else if (!isType) {
      message.error(
        `${fileName} ${this.$t(
          'base.upload.failed.the.current.attachment.type.format',
        )}`,
      );
      // 上传失败，当前附件类型格式设置不支持此类附件格式上传
    } else if (!isLimitUpper || !isLimitLower) {
      // `上传失败，文件大小应在${lowerLimit}${curUnit}-${upperLimit}${curUnit}范围内`
      message.error(
        `${fileName} ${this.$t('base.upload.failed.for.file.size.range.limit', {
          range: `${lowerLimit}${curUnit}-${upperLimit}${curUnit}`,
        })}`,
      );
    }
    const result = isLimitUpper && isLimitLower && isType && isLimitNum;

    return result;
  };

  // 附件上传时的参数
  handleData = () => {
    const {
      attachmentType,
      pkValue,
      pkName,
      bucketName,
      params: { attachmentCode },
    } = this.props;
    return {
      attachmentType: attachmentType || attachmentCode,
      pkValue,
      bucketName,
      pkName,
    };
  };

  // 扫描
  scanning = () => {};

  // 上传文件改变时
  handleChange = (info) => {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    const { Oids, fileList: oldFileList } = this.state;
    const {
      fileList,
      file: { status, response },
    } = info;

    this.setState(
      { fileList: status ? [...fileList] : oldFileList, isExpand: true },
      () => {
        if (status === 'done') {
          message.success(
            `${info.file.name} ${this.$t('upload.success' /* 上传成功 */)}`,
          );
          Oids.push(info.file.response.id);

          this.setState({ Oids }, () => {
            const { uploadHandle, fileListChange } = this.props;
            if (uploadHandle) {
              uploadHandle(Oids, fileList);
            }
            if (fileListChange) {
              fileListChange(fileList);
            }
          });
        } else if (status === 'error') {
          if (response && response.message) {
            message.error(response.message);
          } else {
            message.error(
              `${info.file.name} ${this.$t('upload.fail' /* 上传失败 */)}`,
            );
          }
        }
      },
    );
  };

  onExpand = () => {
    const { onRowClick } = this.props;
    const { isExpand, fileList } = this.state;
    this.setState({ isExpand: !isExpand });
    if (onRowClick) {
      onRowClick(fileList);
    }
  };

  render() {
    const { fileList, isExpand } = this.state;
    const { readOnly, noDelete, onPreview } = this.props;

    return (
      <div className="upload-by-type">
        <div className="upload-by-type-tree">
          <div className="upload-by-type-tree-title">{this.renderTitle()}</div>
          {isExpand && !!fileList.length && (
            <div className="upload-by-type-file">
              <UploadFileList
                {...this.props}
                fileList={fileList}
                onPreview={onPreview}
                onRemove={this.handleRemove}
                showRemoveIcon={!noDelete && !readOnly}
              />
            </div>
          )}
        </div>
        <span className="upload-component">
          {!readOnly && this.uploadComponent()}
        </span>
      </div>
    );
  }
}

UploadByType.defaultProps = {
  defaultFileList: [],
  uploadUrl: `${config.fileUrl}/api/upload/attachment`,
  multiple: true,
  disabled: false,
  isUseAttachmentId: false,
  uploadHandle: () => {},
  fileNum: Infinity, // Infinity
  noDelete: false,
  bucketName: undefined,
  required: false,
  readOnly: false,
  attachmentType: undefined,
  pkValue: undefined,
};

export default UploadByType;

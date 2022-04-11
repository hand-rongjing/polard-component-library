import React from 'react';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { Tooltip, Popconfirm, Col, Row, Progress } from 'antd';
import config from 'config';
import httpFetch from 'share/httpFetch';
import { getImgIcon, messages, getBrowserInfo } from '../../utils';
import DownloadIcon from '../../../assets/upload/download';
import PreviewIcon from '../../../assets/upload/preview';
import DeleteIcon from '../../../assets/upload/delete';
import FilePreview from '../image-preview';
import ZipFileView from '../zip-preview';
import './index.less';

class RenderUploadFileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
      previewVisible: false,
      treeData: {},
      zipFileVisible: false,
    };
  }

  // 渲染按钮组
  renderOperationGroup = (index, isSuccess, item) => {
    const { showRemoveIcon, showPreviewIcon, showDownloadIcon, disabled } =
      this.props;

    const isRemoveFunc = typeof showRemoveIcon === 'function';
    const isPreviewFunc = typeof showPreviewIcon === 'function';
    const isDownloadFunc = typeof showDownloadIcon === 'function';

    return (
      <div>
        {getImgIcon(item.fileName || item.name, true) &&
        showPreviewIcon &&
        isSuccess
          ? isPreviewFunc
            ? showPreviewIcon()
            : this.renderSingleOperation('preview', index, false, item)
          : null}
        {showDownloadIcon && isSuccess
          ? isDownloadFunc
            ? showDownloadIcon()
            : this.renderSingleOperation('download', index, false, item)
          : null}
        {showRemoveIcon && !disabled
          ? isRemoveFunc
            ? showRemoveIcon()
            : this.renderSingleOperation('remove', index, isSuccess, item)
          : null}
      </div>
    );
  };

  // 触发预览
  handlePreview = (index, item) => {
    const { onPreview } = this.props;
    if (typeof onPreview === 'function') {
      onPreview(index, item);
      return;
    }
    this.setState({
      previewVisible: true,
      imageIndex: index,
    });
  };

  // 渲染单个按钮
  renderSingleOperation = (type, index, isSuccess, tempItem) => {
    const { onRemove, fileList, onDownload, popupContainer } = this.props;
    const item = tempItem.response ? tempItem.response : tempItem;
    switch (type) {
      case 'preview':
        return item && item.fileType && item.fileType.includes('zip') ? (
          <Tooltip title={messages('common.preview')}>
            <Icon
              component={PreviewIcon}
              className="operation-btn preview"
              onClick={() => {
                this.zipFileView(index, item.id ? item.id : item.response.id);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={messages('common.preview')}>
            <Icon
              component={PreviewIcon}
              className="operation-btn preview"
              onClick={() => {
                this.handlePreview(index, item);
              }}
            />
          </Tooltip>
        );
      case 'remove':
        return (
          <Tooltip title={messages('common.delete')}>
            <Popconfirm
              title={messages('common.confirm.to.delete')}
              onConfirm={() => {
                onRemove(fileList[index], index);
              }}
              overlayStyle={{ whiteSpace: 'nowrap' }}
              getPopupContainer={(node) =>
                popupContainer
                  ? document.querySelector(popupContainer)
                  : node.parentElement
              }
            >
              <Icon
                component={DeleteIcon}
                className={`operation-btn delete ${
                  isSuccess ? '' : 'error-ico'
                }`}
              />
            </Popconfirm>
          </Tooltip>
        );
      case 'download':
        return (
          <Tooltip title={messages('common.download')}>
            <Icon
              component={DownloadIcon}
              className="operation-btn preview"
              onClick={() => {
                if (onDownload) {
                  onDownload(fileList[index], index);
                } else {
                  const attachmentOid =
                    fileList[index] && fileList[index].response
                      ? fileList[index].response.id
                      : fileList[index].id;
                  this.handleDownload(attachmentOid);
                }
              }}
            />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  // 触发预览
  zipFileView = (index, id) => {
    httpFetch
      .get(`${config.fileUrl}/api/attachments/view/zip/tree?id=${id}`)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            zipFileVisible: true,
            treeData: res.data,
            imageIndex: index,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 预览翻上页
  handlePrevious = () => {
    const { imageIndex } = this.state;
    if (imageIndex === 0) return;
    this.setState({ imageIndex: imageIndex - 1 });
  };

  // 预览翻下页
  handleLast = () => {
    const { imageIndex } = this.state;
    const { fileList } = this.props;
    if (imageIndex + 1 === fileList.length) return;
    this.setState({ imageIndex: imageIndex + 1 });
  };

  // 下载
  handleDownload = (attachmentOid) => {
    if (!attachmentOid) return;
    const downloadURL = `${
      config.fileUrl
    }/api/attachments/download/${attachmentOid}?access_token=${sessionStorage.getItem(
      'token',
    )}`;

    // X-FRAME-OPTIONS: SAMEORIGIN iframe 打开下载链接 ie11 不能正常下载
    // 设置一个 a标签 并模拟点击一下让它在新标签里面打开正常下载, 浏览器会有个短暂的闪烁业务接受此方式
    if (getBrowserInfo().name === 'IE') {
      const aTag = document.createElement('a');
      aTag.setAttribute('target', '_blank');
      aTag.setAttribute('href', downloadURL);
      aTag.style.position = 'absolute';
      aTag.style.visibility = 'hidden';
      document.body.appendChild(aTag);
      setTimeout(() => {
        document.body.removeChild(aTag);
      }, 500);
      aTag.click();
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = downloadURL;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    }
  };

  // 文件大小转换
  renderSize = (value) => {
    if (!value) return '0B';
    const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let index = 0;
    const srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    let size = srcsize / 1024 ** index;
    size = size.toFixed(2);
    return size + unitArr[index];
  };

  // 渲染上传进度
  renderProgress = (name, item, percent) => {
    const isError = item.status === 'error';
    const isUploading = item.status === 'uploading';
    return (
      <div>
        <span
          className="upload-file-list-name over-range"
          title={name}
          onClick={() => this.onRowClick(item)}
        >
          {name}
        </span>
        <div>
          <span>
            {isUploading
              ? `${this.renderSize((item.size * percent) / 100)}/`
              : ''}
            {this.renderSize(item.size)}
          </span>
          <span className="upload-file-list-progress-tip">
            {isError ? '上传失败' : isUploading ? '上传中...' : '上传成功'}
          </span>
          {isUploading ? (
            <React.Fragment>
              <Progress strokeWidth={3} percent={percent} showInfo={false} />
              <LoadingOutlined />
            </React.Fragment>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  };

  fileListContent = (item, index) => {
    const { showProgress, percent } = this.props;
    const dataIndex = `upload${index}`;
    const name = item.fileName || item.name;
    const isError = item.status === 'error';
    return (
      <div
        className={`upload-file-list-title upload-${item.status} ${
          showProgress ? 'upload-progress' : ''
        }`}
        key={dataIndex}
      >
        <img
          src={getImgIcon(name)}
          alt="Icon"
          className="upload-file-list-img"
        />
        {showProgress ? (
          this.renderProgress(name, item, percent)
        ) : (
          <span
            className="upload-file-list-name over-range"
            title={name}
            onClick={() => this.onRowClick(item)}
          >
            {name}
          </span>
        )}
        <span className="upload-file-list-operation">
          {item.status && item.status === 'uploading'
            ? !showProgress && <LoadingOutlined />
            : this.renderOperationGroup(index, !isError, item)}
        </span>
      </div>
    );
  };

  onRowClick = (file) => {
    const { onRowClick } = this.props;
    if (onRowClick) {
      onRowClick(file);
    }
  };

  render() {
    const {
      fileList,
      onRemove,
      wrapHandle,
      style,
      showRemoveIcon,
      span = 1,
    } = this.props;
    const { imageIndex, previewVisible, treeData, zipFileVisible } = this.state;
    const attachment =
      (fileList || [])[imageIndex] && (fileList || [])[imageIndex].response
        ? (fileList || [])[imageIndex].response
        : (fileList || [])[imageIndex];
    const isLast = imageIndex + 1 === (fileList || []).length;

    return (
      <div className="upload-file-list" style={style}>
        <Row>
          {Array.isArray(fileList) && !!fileList.length ? (
            fileList.map((item, index) => {
              return (
                <React.Fragment key={item.id || item.uid}>
                  {wrapHandle ? (
                    wrapHandle(this.fileListContent(item, index), item)
                  ) : (
                    <Col span={24 / span} style={{ paddingRight: 4 }}>
                      {this.fileListContent(item, index)}
                    </Col>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <span />
          )}
        </Row>
        {/* 预览 */}
        {attachment && attachment.id && !attachment.fileType.includes('zip') && (
          <FilePreview
            {...this.props}
            attachmentOid={attachment.id}
            staticFileUrl={attachment.staticFileUrl}
            conversionStatus={attachment.conversionStatus}
            onClose={() => {
              this.setState({ previewVisible: false });
            }}
            visible={previewVisible}
            url={attachment.thumbnailUrl}
            title={attachment.fileName}
            onDownload={this.handleDownload}
            onDelete={
              showRemoveIcon &&
              ((oid, index) => {
                onRemove(attachment, index);
                if (isLast) {
                  this.setState({ previewVisible: false });
                }
              })
            }
            first={imageIndex === 0}
            last={isLast}
            onPrevious={this.handlePrevious}
            onLast={this.handleLast}
            index={imageIndex}
          />
        )}

        {attachment && attachment.id && attachment.fileType?.includes('zip') && (
          <ZipFileView
            {...this.props}
            onClose={() => {
              this.setState({ zipFileVisible: false });
            }}
            visible={zipFileVisible}
            treeData={treeData}
            title={attachment.fileName}
            attachment={attachment}
          />
        )}
      </div>
    );
  }
}

// RenderUploadFileItem.propTypes = {
//   fileList: PropTypes.array,
//   showRemoveIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   showPreviewIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   showDownloadIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
//   onRemove: PropTypes.func,
//   showProgress: PropTypes.bool,
//   percent: PropTypes.number,

// };

RenderUploadFileItem.defaultProps = {
  fileList: [],
  showRemoveIcon: true,
  showPreviewIcon: true,
  showDownloadIcon: true,
  onRemove: () => {},
  showProgress: false,
  percent: 0,
};

export default RenderUploadFileItem;

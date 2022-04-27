/**
 * upload 可拖拽上传组件
 */
import React, { Fragment } from 'react';
import { Upload, message } from 'antd';
// import PropTypes from 'prop-types';
import config from 'config';
import { InboxOutlined } from '@ant-design/icons';
import httpFetch from 'share/httpFetch';
import { isNil } from 'lodash';
import { messages } from '../../utils';
import UploadFileList from '../upload-file-list';

class CustomUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: props.defaultFileList || [], // 受控，上传的文件数据集，回抛外部
      valueList: props.defaultOids || [], // 兼容以前组件设定的字段名，存放附件的id/oid list
      maxFileNum: 0, // 限制文件数量
      lowerLimitSize: 0, // 限制文件最小大小
      upperLimitSize: 0, // 限制文件最大大小
      sizeUnit: 'MB', // 文件大小单位
      acceptList: [], // 文件格式
      acceptName: '',
    };
    this.sizeMap = {
      GB: 3,
      MB: 2,
      KB: 1,
      B: 0,
    };
    this.sizeUnitList = {
      // 附件大小单位
      1001: 'MB',
      1002: 'KB',
      1003: 'GB',
    };
  }

  componentDidMount() {
    const {
      attachmentType,
      useCustomConfig,
      fileNum,
      fileSize,
      lowerLimitFileSize,
      unitSize,
      extensions,
      extensionName,
    } = this.props;
    httpFetch
      .get(
        `${config.fileUrl}/api/attachment/type/query/code?attachmentType=${attachmentType}`,
      )
      .then((res) => {
        if (useCustomConfig) {
          this.setState({
            maxFileNum: fileNum,
            lowerLimitSize: lowerLimitFileSize, // 限制文件最小大小
            upperLimitSize: fileSize, // 限制文件最大大小
            sizeUnit: unitSize, // 文件大小单位
            acceptList: extensions, // 文件格式
            acceptName: extensionName,
          });
        } else {
          const formatList = res.data.formatList || [];
          this.setState({
            maxFileNum: res.data.attachmentCount,
            lowerLimitSize: res.data.lowerLimit, // 限制文件最小大小
            upperLimitSize: res.data.upperLimit, // 限制文件最大大小
            sizeUnit: this.sizeUnitList[res.data.sizeUnit || '1001'], // 文件大小单位
            acceptList: formatList.map((item) => item.format), // 文件格式
            acceptName: formatList.map((item) => `.${item.format}`).join(', '),
          });
        }
      })
      .catch(() => {
        this.setState({
          maxFileNum: fileNum,
          lowerLimitSize: lowerLimitFileSize, // 限制文件最小大小
          upperLimitSize: fileSize, // 限制文件最大大小
          sizeUnit: unitSize, // 文件大小单位
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    const { defaultFileList } = this.props;
    const { defaultFileList: nextFileList, defaultOids } = nextProps;
    if (defaultFileList.length !== nextFileList.length) {
      this.setState(
        {
          fileList: nextFileList,
        },
        () => {
          this.handleSetDefaultValueList(nextFileList, defaultOids);
        },
      );
    }
  }

  /**
   * 根据外传的fileList联动设置当前组件内部的valueList
   * @param {array} nextFileList
   * @param {array} nextValueList
   */
  handleSetDefaultValueList = (nextFileList, nextValueList) => {
    if (nextFileList.length !== nextValueList.length) {
      // 在未传defaultOids的情况下
      const newValueList = [];
      const { valueKey } = this.props;
      nextFileList.forEach((item) => {
        if (item[valueKey]) {
          newValueList.push(item[valueKey]);
        }
      });
      this.setState({ valueList: [...nextValueList, ...newValueList] });
    }
  };

  /**
   * 设置上传组件需要的额外参数
   * @returns object 上传接口的额外参数
   */
  handleSetExtraData = () => {
    const { pkName, pkValue, attachmentType } = this.props;
    return { pkName, pkValue, attachmentType };
  };

  /**
   * 渲染可拖拽式上传组件的外部展示
   * @returns reactDOM
   */
  renderAppearance = () => {
    const { onFaceLift } = this.props;
    const { maxFileNum, lowerLimitSize, upperLimitSize, sizeUnit, acceptName } =
      this.state;
    // onFaceLift(): 支持外部重定义UI视觉，需要返回reactDom节点
    if (typeof onFaceLift === 'function') {
      return onFaceLift();
    }
    let fileSizeMsg = '';
    if (lowerLimitSize && upperLimitSize) {
      fileSizeMsg =
        lowerLimitSize === upperLimitSize
          ? messages(
              'common.size.of.attachment',
              {
                params: { upperLimitSize, unit: sizeUnit },
              } /* 每个附件大小为{upperLimitSize}{unit} */,
            )
          : messages(
              'common.size.of.attachment.within',
              {
                params: { upperLimitSize, lowerLimitSize, unit: sizeUnit },
              } /* 每个附件大小在{lowerLimitSize}{unit}~{upperLimitSize}{unit}以内 */,
            );
    } else if (lowerLimitSize) {
      fileSizeMsg = messages('common.size.of.attachment.not.less.than', {
        params: { lowerLimitSize, unit: sizeUnit },
      }); /* 每个附件大小不小于{lowerLimitSize}{unit} */
    } else if (upperLimitSize) {
      fileSizeMsg = messages('common.size.of.attachment.in', {
        params: { upperLimitSize, unit: sizeUnit },
      }); /* 每个附件大小在{upperLimitSize}{unit}以内 */
    }
    return (
      <Fragment>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {messages('common.upload.info') /* 点击或将文件拖拽到这里上传 */}
        </p>
        <p className="ant-upload-hint">
          {messages('common.upload.support.ext') /* 支持扩展名 */}：
          {acceptName || '全部'}
        </p>
        <p className="ant-upload-hint">
          {maxFileNum > 0 &&
            `${
              messages('common.upload.max.num', {
                params: { fileNum: maxFileNum },
              }) /* 最多上传{fileNum}个文件 */
            }${fileSizeMsg ? ', ' : ''}${fileSizeMsg}`}
        </p>
      </Fragment>
    );
  };

  /**
   *
   * @param {object} file
   * @returns boolean
   */
  handleCheckImgSize = (file) => {
    const { type } = file;
    const reg = /image\/[a-z]+/g;
    if (!reg.test(type)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const { maxHeightSize, maxWidthSize, minHeightSize, minWidthSize } =
        this.props;
      if (
        !isNil(maxWidthSize) ||
        !isNil(maxHeightSize) ||
        !isNil(minWidthSize) ||
        !isNil(minHeightSize)
      ) {
        const url = window.URL || window.webkitURL;
        const img = new Image(); // 手动创建一个Image对象
        img.src = url.createObjectURL(file); // 创建Image的对象的url
        img.onload = function onLoad() {
          if (
            (!isNil(maxWidthSize) && maxWidthSize < this.width) ||
            (!isNil(maxHeightSize) && maxHeightSize < this.height) ||
            (!isNil(minHeightSize) && minHeightSize > this.height) ||
            (!isNil(minWidthSize) && minWidthSize > this.width)
          ) {
            let errorMessage = messages('common.pic.size.warning'); // 图片尺寸不符合要求
            if (!isNil(maxWidthSize) && !isNil(maxHeightSize)) {
              errorMessage = `${errorMessage}，${messages(
                'common.size.big.warning',
              )}${maxWidthSize}*${maxHeightSize}`; // 图片尺寸不符合要求，尺寸不可大于x*x
            }
            if (!isNil(minHeightSize) && !isNil(minWidthSize)) {
              errorMessage = `${errorMessage}，${messages(
                'common.size.small.warning',
              )}${minWidthSize}*${minHeightSize}`; // 图片尺寸不符合要求，尺寸不可小于x*x
            }
            message.error(errorMessage);
            return reject();
          }
          return resolve();
        };
      } else return resolve();
    });
  };

  /**
   * 校验附件大小
   * @param {number} size 上传的附件大小
   * @returns boolean 返回 false 则停止上传
   */
  handleCheckFileSize = (size) => {
    const { lowerLimitSize, upperLimitSize, sizeUnit } = this.state;
    if (upperLimitSize) {
      // size 单位是 B
      const isInMax = size / 1024 ** this.sizeMap[sizeUnit] <= upperLimitSize;
      if (!isInMax) {
        message.error(
          messages('common.attachment.size.limit', {
            params: {
              size: upperLimitSize,
              unit: sizeUnit,
            },
          }),
        );
        return false;
      }
    }
    if (lowerLimitSize) {
      const isInMin = size / 1024 ** this.sizeMap[sizeUnit] >= lowerLimitSize;
      if (!isInMin) {
        message.error(
          messages('common.attachment.size.lower', {
            params: {
              size: lowerLimitSize,
              unit: sizeUnit,
            },
          }),
        );
        return false;
      }
    }
    return true;
  };

  /**
   * 校验附件类型
   * 使用文件名字截取是因为 file.type返回的值与extensionName（常人认知的值不一致）
   * @param {*} fileName 附件名字
   * @returns boolean
   */
  handleCheckFileType = (fileName) => {
    const { acceptList } = this.state;
    if (!acceptList || (Array.isArray(acceptList) && acceptList.length === 0))
      return true;
    // fileType: image/jpeg / text/html / application/x-zip-compressed ....
    const type = fileName.split('.').pop();
    const isQualified = acceptList.includes(type);
    if (!isQualified) {
      message.error(messages('common.upload.failed.reason'));
    }
    return isQualified;
  };

  /**
   * 上传前的校验，antd v4.x 做出修改，这里即便return false,依旧会触发onChange
   * @param {object} file 当前上传的文件
   * @returns boolean 返回boolean值决定file是否符合预期
   */
  handleBeforeUpload = (file, fileList) => {
    const { maxFileNum, fileList: originFileList } = this.state;
    const passList = originFileList.filter(
      (o) => o.status === 'done' || o.pass === true,
    );
    if (maxFileNum && passList.length + fileList.length > maxFileNum) {
      if (file.uid === fileList[0].uid) {
        // 如果存在同时上传多个文件时，只在第一个文件判断时作出提示，避免这个提示出现多次
        message.error(
          messages('common.upload.max.num', {
            params: { fileNum: maxFileNum },
          }) /* 最多上传{fileNum}个文件 */,
        );
      }
      return false;
    }
    if (!this.handleCheckFileType(file.name)) return false;
    if (!this.handleCheckFileSize(file.size)) return false;
    return this.handleCheckImgSize(file)
      .then(() => {
        // 当执行到这一步的时候，表示上传的附件符合预期，加上pass标记方便onChange使用
        file.pass = true;
        return Promise.resolve();
      })
      .catch(() => {
        return Promise.reject();
      });
  };

  /**
   * 监听附件上传的回调
   * @param {object} info 附件
   */
  handleChange = (info) => {
    // 不存在pass表示校验失败，change方法的后续逻辑可以不执行了
    if (!info.file.pass) return;
    const { uploadHandle, needAllResponse, onChange, valueKey } = this.props;
    let { fileList } = info;
    let { valueList } = this.state;

    fileList = this.handleCutArray(fileList);
    this.setState({ fileList }, () => {
      const { status } = info.file;
      if (status === 'done') {
        message.success(
          `${info.file.name} ${
            messages('common.upload.success') /* 上传成功 */
          }`,
        );
        valueList.push(info.file.response[valueKey]);

        valueList = this.handleCutArray(valueList);
        this.setState({ valueList }, () => {
          uploadHandle(needAllResponse ? fileList : valueList);
          if (onChange) {
            onChange(valueList);
          }
        });
      } else if (status === 'error') {
        message.error(
          `${info.file.name} ${messages('common.upload.fail') /* 上传失败 */}`,
        );
      }
    });
  };

  // 删除前 执行以下逻辑校验是否可以执行删除操作
  handleBeforeRemove = () => {
    const { disabled } = this.props;
    if (disabled) {
      message.warn(
        messages('common.upload.not.allowed.delete' /* 该状态不允许删除附件 */),
      );
      return true;
    }
    return false;
  };

  /**
   * 删除
   * @param {object} info 当前执行删除的附件信息
   * @returns undefined 打断函数执行
   */
  handleRemove = (info) => {
    if (this.handleBeforeRemove()) return;

    const { uploadHandle, onChange, needAllResponse, valueKey } = this.props;
    const { valueList, fileList } = this.state;

    const newValueList = valueList.filter(
      (value) =>
        value !== (info.response ? info.response[valueKey] : info[valueKey]),
    );
    const newFileList = fileList.filter((file) => {
      return (
        (file.response ? file.response[valueKey] : file[valueKey]) !==
        (info.response ? info.response[valueKey] : info[valueKey])
      );
    });

    this.setState(
      { valueList: [...newValueList], fileList: [...newFileList] },
      () => {
        uploadHandle(needAllResponse ? newFileList : newValueList);
        if (onChange) {
          onChange(newValueList);
        }
      },
    );
    this.handleRemoveByInterface(
      info.response ? info.response[valueKey] : info[valueKey],
    );
  };

  /**
   * 调用删除接口删除上传的附件
   * @param {string} key 附件的唯一值，如id，oid之类
   */
  handleRemoveByInterface = (key) => {
    const { isUseAttachmentId } = this.props;
    let deleteUrl = `${config.fileUrl}/api/attachments`;
    deleteUrl += isUseAttachmentId ? `?id=${key}` : `/${key}`;

    httpFetch
      .delete(deleteUrl)
      .then(() => {
        message.success(messages('common.operate.success'));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * 从后向前截取数组
   * @param {array} list 截取前的数组
   * @returns array 截取后的数组
   */
  handleCutArray = (list) => {
    const { maxFileNum } = this.state;
    if (maxFileNum) {
      return list.slice(parseInt(`-${maxFileNum}`, 10));
    }
    return list;
  };

  // 自定义上传
  handleCustomUpload = (options) => {
    const formData = new FormData();
    const { uploadUrl } = this.props;
    if (options.data) {
      Object.keys(options.data).forEach((key) => {
        formData.append(key, options.data[key]);
      });
    }
    formData.append('file', options.file);
    httpFetch
      .post(uploadUrl, formData)
      .then((res) => {
        if (res.data) {
          options.onSuccess(res.data, options.file);
        } else {
          options.onError();
        }
      })
      .catch((error) => {
        options.onError();
        console.log(error);
      });
  };

  checkUploadIsDone = () => {
    const { fileList } = this.state;
    const result = fileList.every((file) => {
      return file.status !== 'uploading';
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const {
      uploadUrl,
      disabled,
      defaultFileList,
      style,
      showRemoveIcon,
      showPreviewIcon,
      showDownloadIcon,
    } = this.props;
    const { fileList: originFileList, acceptList } = this.state;
    // 设置上传的请求头部
    const uploadHeaders = {
      Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
      Accept: 'application/json, text/plain, */*',
    };
    const fileList = originFileList.filter(
      (file) => file.status === 'done' || file.pass === true,
    );

    return (
      <div className="upload">
        <Upload.Dragger
          name="file"
          action={uploadUrl}
          headers={uploadHeaders}
          data={this.handleSetExtraData}
          disabled={disabled}
          style={{ padding: '20px 0' }}
          defaultFileList={defaultFileList}
          multiple
          fileList={fileList}
          showUploadList={false}
          beforeUpload={this.handleBeforeUpload}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          customRequest={this.handleCustomUpload}
          accept={acceptList.map((item) => `.${item}`).join(',')}
        >
          {this.renderAppearance()}
        </Upload.Dragger>
        <UploadFileList
          style={{
            marginTop: 6,
            ...style,
          }}
          fileList={fileList}
          disabled={disabled}
          // 属性作用详情参考uploadFileList组件，简要：是否展示删除，预览，下载按钮
          showRemoveIcon={showRemoveIcon}
          showPreviewIcon={showPreviewIcon}
          showDownloadIcon={showDownloadIcon}
          onRemove={this.handleRemove}
        />
      </div>
    );
  }
}

// CustomUpload.propTypes = {
// useCustomConfig: PropTypes.bool, // 是否使用客制化配置，该参数主要用来判断附件大小、数量、单位是否采用组件传入的参数，false表示采用数据库中的附件类型配置信息，true则采用组件传入的信息
//   uploadUrl: PropTypes.string, // 上传URL
//   disabled: PropTypes.bool, // 是否禁用组件
//   defaultFileList: PropTypes.array, // 默认上传的文件列表，每项必须包含：uid，name
//   pkName: PropTypes.string, // 业务类型
//   pkValue: PropTypes.string, // 业务类型
//   uploadHandle: PropTypes.func, // 回调事件，获取上传后的数据
//   attachmentType: PropTypes.string, // 上传组件额外参数，由后端提供
//   style: PropTypes.object, // 附件展示列的样式
//   // eslint-disable-next-line react/require-default-props
//   fileNum: PropTypes.number, // 限制上传的数量
//   valueKey: PropTypes.string, // 指定使用 接口返回的附件attachment中使用的值字段,方便以后修改
//   isUseAttachmentId: PropTypes.bool, // 从代码反推，该字段是用来决定使用哪个删除接口
//   needAllResponse: PropTypes.bool, // 是否返回上传文件的所有内容，为false时只返回 valueKey指定的值，默认id list
//   fileSize: PropTypes.number, // 附件大小限制
//   unitSize: PropTypes.oneOf(['MB', 'KB', 'B']), // 附件大小 的单位，默认是兆
//   extensions: PropTypes.array, // 限制上传类型
//   extensionName: PropTypes.string, // 附件支持的扩展名
//   //  showRemoveIcon
//   //  showPreviewIcon
//   //  showDownloadIcon
//   //  onFaceLift 自定义UI展示内容
//   defaultOids: PropTypes.array,
// };
CustomUpload.defaultProps = {
  useCustomConfig: false,
  uploadUrl: `${config.fileUrl}/api/upload/static/attachment`,
  disabled: false,
  defaultFileList: [],
  uploadHandle: () => {},
  attachmentType: 'default',
  pkName: '',
  pkValue: '',
  style: {},
  valueKey: 'id',
  isUseAttachmentId: false,
  needAllResponse: false,
  unitSize: 'MB',
  fileSize: 100,
  lowerLimitFileSize: 0,
  fileNum: undefined,
  extensionName: '.rar .zip .doc .docx .pdf .jpg .jpeg .png .txt .xls .xlsx...',
  extensions: [],
  defaultOids: [],
};
export default CustomUpload;

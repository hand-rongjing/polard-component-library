import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Rnd } from 'react-rnd';
import {
  RotateRightOutlined,
  CloudDownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { Result, Popconfirm } from 'antd';
import { WaterMark } from '@ant-design/pro-layout';
import Connect from '../../custom-connect';
import { messages, getImgIcon } from '../../utils';
import nextPageImg from './assets/next-page.svg';
import './index.less';

function FilePreview(props) {
  const {
    visible,
    title,
    onClose,
    attachmentOid,
    onDelete,
    onDownload,
    staticFileUrl,
    first,
    last,
    onPrevious,
    onLast,
    index,
    conversionStatus,
  } = props;

  const rndRef = useRef();
  const [pressed, setPressed] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [lastTop, setLastTop] = useState(0);
  const [lastLeft, setLastLeft] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [scale, setScale] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false); // 是否全屏显示
  const rndOption = {
    x: (document.body.clientWidth - 1040) / 2,
    y: (document.body.clientHeight - 680) / 2,
    width: 1040,
    height: 680,
  };

  useEffect(() => {
    setPressed(false);
    setTop(0);
    setLeft(0);
    setLastTop(0);
    setLastLeft(0);
    setRotateZ(0);
    setScale(1);
  }, [visible]);

  const type = getFileType(title);
  const imgs = ['png', 'jpg', 'bmp', 'jpeg', 'gif'];
  const isImg = imgs.includes(type);

  function close() {
    if (onClose) {
      onClose();
    }
  }

  function mouseDown(e) {
    setLastTop(e.clientY);
    setLastLeft(e.clientX);
    setPressed(true);
  }

  function mouseUp() {
    setPressed(false);
  }

  function mouseMove(e) {
    e.stopPropagation();
    if (!pressed) return;
    let y = top;
    let x = left;
    y += e.clientY - lastTop;
    x += e.clientX - lastLeft;
    const position = calcPosition(x, y);
    setTop(position.y);
    setLeft(position.x);
    setLastTop(e.clientY);
    setLastLeft(e.clientX);
  }

  // 计算图片移动的边界
  function calcPosition(x, y) {
    const ele = document.getElementById(`img-${attachmentOid}`);
    const isRotate = !(rotateZ % 180 === 0); // 判断宽高是否旋转
    const eleWidth = isRotate ? ele.height * scale : ele.width * scale; // 图片旋转和放大后的宽度
    const eleHeight = isRotate ? ele.width * scale : ele.height * scale; // 图片旋转和放大后的高度
    const bodyEle = document.getElementById(`rnd-content-body`);
    const leftOffset = bodyEle.offsetWidth / 2 - eleWidth / 2; // 图片距离左边的距离,也是图片可往左边移动的距离
    const topOffset = bodyEle.offsetHeight / 2 - eleHeight / 2; // 图片距离顶部的距离,也是图片可往顶部移动的距离
    // console.log('移动中的left', x, 'top', y)
    // console.log('topOffset', topOffset, 'rnd-content-body高度', bodyEle.offsetHeight / 2, '图片高度', eleHeight / 2)
    // console.log('leftOffset', leftOffset, 'rnd-content-body宽度', bodyEle.offsetWidth / 2, '图片宽度', eleWidth / 2)
    if (leftOffset > 0) {
      // 图片宽度<body宽度
      if (x < 0 && Math.abs(x) >= leftOffset) {
        // 如果图片左移的距离>可移动的距离，则限制图片最左侧的位置
        x = -leftOffset;
      }
      if (x > 0 && x >= leftOffset) {
        // 如果图片右移的距离>可移动的距离，则限制图片最右侧的位置
        x = leftOffset;
      }
    } else if (leftOffset < 0) {
      // 图片宽度>body宽度
      if (x > 0 && x >= Math.abs(leftOffset)) {
        // 如果图片左移的距离>可移动的距离，则限制图片最左侧的位置
        x = -leftOffset;
      } else if (x <= leftOffset) {
        // 如果图片右移的距离>可移动的距离，则限制图片最右侧的位置
        x = leftOffset;
      }
    } else {
      // 图片宽度 = body宽度
      x = 0;
    }

    if (topOffset > 0) {
      // 图片高度<body高度
      if (y < 0 && Math.abs(y) >= topOffset) {
        // 如果图片左移的距离>可移动的距离，则限制图片最左侧的位置
        y = -topOffset;
      }
      if (y > 0 && y >= topOffset) {
        // 如果图片右移的距离>可移动的距离，则限制图片最右侧的位置
        y = topOffset;
      }
    } else if (topOffset < 0) {
      // 图片高度>body高度
      if (y > 0 && y >= Math.abs(topOffset)) {
        // 如果图片左移的距离>可移动的距离，则限制图片最左侧的位置
        y = -topOffset;
      } else if (y <= topOffset) {
        // 如果图片右移的距离>可移动的距离，则限制图片最右侧的位置
        y = topOffset;
      }
    } else {
      // 图片高度 = body高度
      y = 0;
    }

    return { x, y };
  }

  function handleOperateImage(operate) {
    const imageDom = document.querySelector(`#img-${attachmentOid}`);
    const transformStyle = imageDom.style.transform;
    let newRotateZ = 0;
    let newScale = 1;
    // 得到rotateZ值
    transformStyle.replace(/rotateZ\(((\d+)|(-\d+))deg\)/, (target, $1) => {
      newRotateZ = Number($1);
      return target;
    });
    // 得到scale值
    transformStyle.replace(/scale\(((\d+.\d+)|(\d+))\)/, (target, $1) => {
      newScale = Number($1);
      return target;
    });
    switch (operate) {
      // 放大，最大4
      case 'plus': {
        if (newScale < 4) newScale += 0.5;
        break;
      }
      // 缩小，最小0.1
      case 'minus': {
        if (newScale > 0.5) newScale -= 0.5;
        break;
      }
      // 向左旋转
      case 'left': {
        newRotateZ -= 90;
        break;
      }
      // 向又旋转
      case 'right': {
        newRotateZ += 90;
        break;
      }
      default: {
        break;
      }
    }
    setRotateZ(newRotateZ);
    setScale(newScale);
  }

  function renderContent() {
    if (!getImgIcon(title, true)) {
      return renderResult(messages('common.doc.preview.warning'));
    }

    if (isImg) {
      return renderImage();
    } else if (conversionStatus === 'CONVERTING') {
      return renderResult(messages('common.doc.converting'));
    } else if (conversionStatus === 'FAILURE') {
      return renderResult(messages('common.doc.conversion.failed'));
    } else if (conversionStatus === 'SUCCESS') {
      return renderDocument();
    } else {
      return renderResult(messages('common.doc.conversion.failed'));
    }
  }

  function renderResult(text) {
    return (
      <div
        id={`img-${attachmentOid}`}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Result status="warning" title={text} />
      </div>
    );
  }

  function renderImage() {
    const { user } = props;
    return (
      <WaterMark
        content={`${user.userCode} - ${user.userName}`}
        style={{ position: 'absolute', bottom: 0, top: 0, left: 0, right: 0 }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
          }}
        >
          <img
            id={`img-${attachmentOid}`}
            src={`${staticFileUrl}?access_token=${sessionStorage.getItem(
              'token',
            )}`}
            alt="pic"
            className="img-attach"
            style={{
              top,
              left,
              transform: `rotateZ(${rotateZ}deg) scale(${scale}) translate(-50%, -50%)`,
            }}
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            draggable={false}
            onLoad={loadImage}
          />
        </div>
      </WaterMark>
    );
  }

  function loadImage(e) {
    const { width, height, style } = e.target;
    const { offsetWidth, offsetHeight } = e.target.parentNode;
    style.width = 'auto';
    style.height = 'auto';
    if (offsetWidth < width && offsetHeight < height) {
      if (width > height) {
        style.width = '100%';
        style.height = 'auto';
      } else {
        style.width = 'auto';
        style.height = '100%';
      }
    } else if (offsetWidth < width) {
      style.width = '100%';
      style.height = 'auto';
    } else if (offsetHeight < height) {
      style.width = 'auto';
      style.height = '100%';
    }
    style.display = 'block';
    setTop(0);
    setLeft(0);
    setLastTop(0);
    setLastLeft(0);
    setRotateZ(0);
    setScale(1);
  }

  function renderDocument() {
    const { user } = props;
    const reg = /.pdf$/;
    const flag = reg.test(staticFileUrl.toLowerCase());
    let fileUrl;
    if (!flag) {
      fileUrl = `.${staticFileUrl}?access_token=${sessionStorage.getItem(
        'token',
      )}`;
    } else {
      fileUrl = `/pdfjs/web/viewer.html?file=${window.encodeURIComponent(
        `${staticFileUrl}?access_token=${sessionStorage.getItem('token')}`,
      )}`;
    }
    return (
      <WaterMark
        content={`${user.userCode} - ${user.userName}`}
        style={{ position: 'absolute', bottom: '0', top: 0, left: 0, right: 0 }}
      >
        <iframe
          title={title}
          src={fileUrl}
          style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
        />
      </WaterMark>
    );
  }

  function handlePrevious() {
    if (onPrevious) {
      onPrevious();
    }
  }

  function handleLast() {
    if (onLast) {
      onLast();
    }
  }

  function getFileType(name) {
    return (name || '').split('.').pop().toLowerCase();
  }

  // 全屏
  function fullscreen(fullFlag) {
    if (fullFlag) {
      setIsFullScreen(true);
      rndRef.current.updatePosition({ x: 0, y: 0 });
      rndRef.current.updateSize({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      });
    } else {
      const { x, y, width, height } = rndOption;
      setIsFullScreen(false);
      rndRef.current.updatePosition({ x, y });
      rndRef.current.updateSize({ width, height });
    }
  }

  return ReactDOM.createPortal(
    visible && (
      <Rnd
        default={rndOption}
        minWidth={320}
        minHeight={250}
        ref={rndRef}
        bounds="window"
        className="preview-rnd"
        cancel=".cancel-drag"
      >
        <div className="rnd-content">
          <div className="rnd-content-header">
            <div className="rnd-content-header-right">
              {onDownload && (
                <CloudDownloadOutlined
                  className="rnd-opera-img cancel-drag"
                  title={messages('common.download')}
                  onClick={() => onDownload(attachmentOid)}
                />
              )}
              {!props.disabled && onDelete && (
                <Popconfirm
                  title={messages('common.confirm.to.delete')}
                  onConfirm={() => onDelete(attachmentOid, index)}
                  okText={messages('common.ok')}
                  cancelText={messages('common.cancel')}
                >
                  <DeleteOutlined
                    className="rnd-opera-img cancel-drag"
                    title={messages('common.delete')}
                  />
                </Popconfirm>
              )}
              {isImg && (
                <>
                  <ZoomInOutlined
                    className="rnd-opera-img cancel-drag"
                    title={messages('common.enlarge')}
                    onClick={() => handleOperateImage('plus')}
                  />
                  <ZoomOutOutlined
                    className="rnd-opera-img cancel-drag"
                    title={messages('common.narrow')}
                    onClick={() => handleOperateImage('minus')}
                  />
                  <RotateRightOutlined
                    className="rnd-opera-img cancel-drag"
                    title={messages('common.rotate')}
                    onClick={() => handleOperateImage('right')}
                  />
                </>
              )}
              {isFullScreen ? (
                <FullscreenExitOutlined
                  className="rnd-opera-img cancel-drag"
                  title={messages('full.screen.exit' /* 退出全屏 */)}
                  onClick={() => fullscreen(false)}
                />
              ) : (
                <FullscreenOutlined
                  className="rnd-opera-img cancel-drag"
                  title={messages('full.screen' /* 全屏 */)}
                  onClick={() => fullscreen(true)}
                />
              )}
            </div>
            <div className="rnd-content-header-left">
              <CloseCircleOutlined
                className="rnd-opera-img cancel-drag"
                title={messages('common.close' /* 关闭 */)}
                onClick={close}
              />
            </div>
          </div>
          <div
            className="rnd-content-body cancel-drag"
            id="rnd-content-body"
            onMouseUp={mouseUp}
            onMouseMove={mouseMove}
          >
            {renderContent()}
          </div>
          <div className="rnd-content-bottom">
            {!first && (
              <img
                src={nextPageImg}
                className="pre-icon cancel-drag"
                alt={messages('pre.page' /* 下一页 */)}
                onClick={handlePrevious}
              />
            )}
            <span className="file-title">{title}</span>
            {!last && (
              <img
                src={nextPageImg}
                className="next-icon cancel-drag"
                alt={messages('next.page' /* 下一页 */)}
                onClick={handleLast}
              />
            )}
          </div>
        </div>
      </Rnd>
    ),
    document.body,
  );
}

function mapStateToProps(state) {
  return {
    user: state.user.currentUser,
  };
}

export default Connect(mapStateToProps)(FilePreview);

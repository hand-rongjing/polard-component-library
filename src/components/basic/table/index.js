import React from 'react';
import Connect from '../../custom-connect';
import { Table, ConfigProvider, Empty } from 'antd';
import { Resizable } from 'react-resizable';

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      draggableOpts={{ enableUserSelectHack: false }}
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class BasicTable extends React.Component {
  state = {
    columns: [],
    expandedRows: [],
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  componentDidMount() {
    const { columns: columnsFromProps } = this.props;
    this.setState({
      columns: columnsFromProps,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      columns: nextProps.columns,
    });
  }

  handleResize =
    (index) =>
    (e, { size }) => {
      this.setState(({ columns }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: size.width,
        };
        return { columns: nextColumns };
      });
    };

  /**
   * 切换页码
   * @param pagination1
   */
  onTableChange = (pagination1, ...rest) => {
    const { pagination, onChange } = this.props;
    if (onChange) {
      onChange({ ...pagination, ...pagination1 }, ...rest);
    }
  };

  onExpandedRowsChange = (keys) => {
    const { onExpandedRowsChange } = this.props;
    if (onExpandedRowsChange) {
      onExpandedRowsChange(keys);
    } else {
      this.setState({ expandedRows: keys });
    }
  };

  /**
   * 获取当前页面表格可滚动高度
   */
  getScrollY = () => {
    const { dataSource } = this.props;
    try {
      if (dataSource.length <= 5) return null; // 解决表格数据少，Popover Dropdown弹出框定位问题，同时避免详情页数据设置高度
      const { getState } = window?.g_app?._store || {};
      const state = getState ? getState() : {};
      const currentPage = state?.pageTab?.currentPage;
      const contentDom = document.querySelector(`#${currentPage.pageCode}`);
      const scrollWrapDom = contentDom.parentElement; // .scroll-wrapped
      let initScrollY = scrollWrapDom.offsetHeight - 48 - 56; // 表头48px，页码56px
      const footerDom = contentDom.querySelector('.content-footer');
      if (footerDom) {
        initScrollY -= footerDom.clientHeight;
      }
      console.log('initScrollY', initScrollY, currentPage.pageCode);
      return initScrollY < 200 ? 200 : initScrollY;
    } catch (e) {
      console.log('getScrollY error', e);
      return null;
    }
  };

  render() {
    const {
      noReSize,
      onExpandedRowsChange,
      expandedRowKeys,
      pagination,
      scrollXWidth,
      scroll,
    } = this.props;
    const { columns: columnsFromState } = this.state;
    const columns = noReSize
      ? columnsFromState
      : columnsFromState &&
        columnsFromState.map((col, index) => ({
          ...col,
          onHeaderCell: (column) => ({
            width: parseInt(column.width, 10) || 120,
            onResize: this.handleResize(index),
          }),
        }));
    const { expandedRows } = this.state;
    const initScrollY = this.getScrollY();

    return (
      <ConfigProvider renderEmpty={() => <Empty />}>
        <Table
          components={this.components}
          {...this.props}
          scroll={{
            x: scrollXWidth || scroll?.x || 1000,
            y: scroll?.y || initScrollY,
          }}
          pagination={pagination}
          onChange={this.onTableChange}
          columns={columns}
          expandedRowKeys={
            onExpandedRowsChange ? expandedRowKeys : expandedRows
          }
          onExpandedRowsChange={this.onExpandedRowsChange}
        />
      </ConfigProvider>
    );
  }
}

BasicTable.defaultProps = {
  dataSource: [],
  prefixCls: 'ant-table',
  useFixedHeader: false,
  className: '',
  size: 'default',
  loading: false,
  bordered: true,
  locale: {},
  dropdownPrefixCls: '',
  onChange: () => {},
  columns: [],
};

function mapStateToProps(state) {
  return {
    // currentPage: state?.pageTab?.currentPage,
  };
}

export default Connect(mapStateToProps)(BasicTable);

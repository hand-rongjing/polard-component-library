import React from 'react';
import { connect } from 'dva';
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
    const { pageTab, currentPage } = this.props;
    let initScrollY = 500;
    try {
      const contentDom = document.querySelector(`#${currentPage.pageCode}`);
      console.log(
        'pageTab, currentPage：',
        pageTab,
        currentPage,
        currentPage.pageCode,
        contentDom,
      );
      const scrollWrapDom = contentDom.parentElement; // .scroll-wrapped
      initScrollY = scrollWrapDom.offsetHeight - 48 - 56; // 表头48px，页码56px
      const footerDom = contentDom.querySelector('.content-footer');
      if (footerDom) {
        initScrollY -= footerDom.clientHeight;
      }
      initScrollY = initScrollY < 100 ? 100 : initScrollY;
    } catch (e) {
      console.log(e);
      initScrollY = 500;
    }
    return initScrollY;
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

export default connect(({ pageTab }) => ({
  pageTab,
  currentPage: pageTab.currentPage,
}))(BasicTable);

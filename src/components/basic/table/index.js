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
    (indexList) =>
    (e, { size }) => {
      this.setState(({ columns }) => {
        const nextColumns = [...columns];
        const [firstIndex, ...restIndex] = indexList;
        let col = nextColumns[firstIndex];
        for (const index of restIndex) {
          col = col.children[index];
        }
        col.width = size.width;
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
      if (dataSource?.length <= 10) return null; // 解决表格数据少，Popover Dropdown弹出框定位问题，同时避免详情页数据设置高度
      const initScrollY = document.body.offsetHeight - 88 - 48 - 56; // 表头48px，页码56px
      return initScrollY < 200 ? 200 : initScrollY;
      // const { getState } = window?.g_app?._store || {};
      // const state = getState ? getState() : {};
      // const currentPage = state?.pageTab?.currentPage;
      // const contentDom = document.querySelector(`#${currentPage.pageCode}`);
      // const scrollWrapDom = contentDom.parentElement; // .scroll-wrapped
      // let initScrollY = scrollWrapDom.offsetHeight - 48 - 56; // 表头48px，页码56px
      // const footerDom = contentDom.querySelector('.content-footer');
      // if (footerDom) {
      //   initScrollY -= footerDom.clientHeight;
      // }
      // // console.log('initScrollY', initScrollY, currentPage.pageCode);
      // return initScrollY < 200 ? 200 : initScrollY;
    } catch (e) {
      // console.log('getScrollY Error', e);
      return null;
    }
  };

  deepInInitResize = (columns, indexList = []) => {
    columns.forEach((col, index) => {
      if (col.children) {
        this.deepInInitResize(col.children, [...indexList, index]);
      } else {
        col.onHeaderCell = (column) => {
          // console.log('column: ', column)
          return {
            width: parseInt(column.width, 10) || 120,
            onResize: this.handleResize([...indexList, index]),
          };
        };
      }
    });
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
    if (!noReSize) {
      this.deepInInitResize(columnsFromState);
    }
    const columns = columnsFromState.map((col) => {
      const { render } = col;
      // console.log('render', render);
      if (render) {
        return {
          ...col,
          render: (...args) => {
            // console.log('new render 1');
            return render(...args);
          },
        };
      }
      return col;
    });
    const { expandedRows } = this.state;
    const initScrollY = this.getScrollY();

    return (
      <ConfigProvider renderEmpty={() => <Empty />}>
        <Table
          components={this.components}
          {...this.props}
          scroll={{
            x: scrollXWidth ?? scroll?.x,
            y: scroll?.y ?? initScrollY,
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

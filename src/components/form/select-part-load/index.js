import React, { Component } from 'react';
import { Select, Spin, Pagination, Tag, Space, Tooltip, Input } from 'antd';
import httpFetch from 'share/httpFetch';
import _ from 'lodash';
import { messages } from '../../utils';
import CloseSvg from './images/close';
import SearchSvg from './images/search';
import MultipleOptionsRender from './multipleOptionsRender';
import './index.less';

class SelectPartLoad extends Component {
  static defaultProps = {
    method: 'get',
    valueKey: 'id',
    showSearch: true,
    lazyLoad: true,
    labelInValue: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      options: [],
      loading: false,
      size: props.pageSize || 10,
      page: 0,
      canLoadMore: true,
      total: 0,
      searchText: null,
      open: false,
      extraOptions: Array.isArray(props.extraOptionList)
        ? props.extraOptionList
        : [],
      forceGetList: props.forceGetList,
      searchInputValue: '',
    };
    this.canGetList = true;
    this.fetchTimes = 0;
    this.onSearch = _.debounce(this.onSearch, props.time || 250);
  }

  componentWillMount() {
    const { defaultGetList } = this.props;
    if (defaultGetList) {
      this.getList();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, defaultGetList, params, url, requestBody } = this.props;
    const { options } = this.state;
    if (value !== nextProps.value) {
      const result = this.formatValue(nextProps.value);
      this.setState({ value: result });
    }
    if (!defaultGetList && nextProps.defaultGetList && !options.length) {
      this.getList(nextProps);
    }
    if (
      url !== nextProps.url ||
      params !== nextProps.params ||
      requestBody !== nextProps.requestBody
    ) {
      this.setState({ forceGetList: true });
    }
  }

  formatValue = (value) => {
    const { mode } = this.props;
    if (
      (Array.isArray(value) && value.length === 0) ||
      (value instanceof Object && Object.keys(value).length === 0)
    ) {
      return undefined;
    } else if (mode === 'singleTag' && value) {
      return [value];
    } else {
      return value;
    }
  };

  getList = (
    curProps,
    { formZero: flag, page: curPage, size: curSize } = {},
  ) => {
    const {
      url,
      params,
      method,
      showPagination,
      searchKey,
      labelKey,
      extraOptionList,
      listExtraParams,
    } = curProps || this.props;
    const {
      page: statePage,
      size: stateSize,
      options,
      searchText,
    } = this.state;
    const searchField = searchKey || labelKey;
    const searchParams = searchField ? { [searchField]: searchText } : {};
    const page = curPage === undefined ? statePage : curPage;
    const size = curSize === undefined ? stateSize : curSize;
    const queryParams = {
      ...(params || {}),
      ...searchParams,
      ...listExtraParams,
      page,
      size,
    };
    this.setState({ loading: true });
    this.fetchTimes += 1;
    const curTimes = this.fetchTimes; // 支持post

    let { requestBody } = curProps || this.props;
    const { paramAsBody } = curProps || this.props;
    let isQueryFlag = false;
    if (paramAsBody) {
      requestBody = { ...(requestBody || {}), ...queryParams };
    } else if (method === 'get') {
      // get请求，params放到requestBody上， 原本的requestBody绝对不可能需要使用
      requestBody = queryParams;
    } else if (
      method === 'post' &&
      queryParams.constructor === Object &&
      Object.keys(queryParams).length
    ) {
      isQueryFlag = !!(
        queryParams.constructor === Object && Object.keys(queryParams).length
      );
      // post请求，且有额外参数要放到请求头上，那么将flag置为true,在axios上传第五参数
    }

    if (!url) {
      let extraOptions = [];
      if (
        Array.isArray(extraOptionList) &&
        searchField &&
        (!showPagination || page === 0)
      ) {
        extraOptions = searchText
          ? extraOptionList.filter((item) =>
              String(item[searchField]).includes(searchText),
            )
          : extraOptionList;
      }
      this.setState({
        options: extraOptions,
        canLoadMore: false,
        loading: false,
      });
      return;
    }

    httpFetch[method](
      url,
      requestBody,
      null,
      null,
      isQueryFlag ? queryParams : {},
    )
      .then((res) => {
        if (!Array.isArray(res.data) || curTimes !== this.fetchTimes) return;
        const total = Number(res.headers['x-total-count'] || 0);
        const replaceOrAdd = showPagination || flag;

        let extraOptions = [];
        if (
          Array.isArray(extraOptionList) &&
          searchField &&
          (!showPagination || page === 0)
        ) {
          extraOptions = searchText
            ? extraOptionList.filter((item) =>
                String(item[searchField]).includes(searchText),
              )
            : extraOptionList;
        }

        const curData = replaceOrAdd ? res.data : [...options, ...res.data];

        this.allOptions = (this.allOptions || []).concat(res.data);

        const curTotal = Math.round((page + 1) * size);
        const canLoadMore = total ? total > curTotal : false;
        this.canGetList = true;
        this.setState({
          options: curData,
          extraOptions,
          loading: false,
          canLoadMore,
          total: total || curData.length,
          page,
          size,
        });
      })
      .catch(() => {
        this.canGetList = true;
        this.setState({ loading: false });
      });
  };

  onPopupScroll = (e) => {
    const { clientHeight, scrollHeight, scrollTop } = e.target;
    const { canLoadMore, page } = this.state;
    const isBottom = clientHeight + scrollTop >= scrollHeight - 30;

    if (this.canGetList && isBottom && canLoadMore) {
      this.canGetList = false;
      this.getList(null, { page: page + 1 });
    }
  };

  dropdownRender = (menu) => {
    const { loading, total, page, options, extraOptions, searchInputValue } =
      this.state;
    const { showPagination, showSearch } = this.props;
    const hasData = !![...options, ...extraOptions].length;
    return (
      <div className="custom-dropdown-wrap">
        {showSearch && (
          <div
            className="select-dropdown-title"
            style={{
              padding: '5px 16px 4px',
              borderBottom: '1px solid #f0f0f0',
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              prefix={<SearchSvg style={{ marginRight: 8 }} />}
              placeholder={messages('common.search' /* 搜索 */)}
              value={searchInputValue}
              onChange={(e) => {
                this.setState({ searchInputValue: e.target.value });
                this.onSearch(e.target.value);
              }}
              ref={(ref) => {
                this.searchInput = ref;
              }}
              style={{
                padding: '4px 0',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
              }}
            />
          </div>
        )}
        {hasData ? (
          <Spin spinning={!!showPagination && loading}>{menu}</Spin>
        ) : (
          <div className="empty-tips">
            {messages('common.no.matching.result' /* 无匹配结果 */)}
          </div>
        )}
        <div
          style={{ lineHeight: '30px' }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {showPagination && !!total && (
            <Pagination
              size="small"
              total={total}
              current={page + 1}
              onChange={this.onPaginationChange}
              style={{ margin: 10 }}
              simple
            />
          )}
        </div>
      </div>
    );
  };

  onPaginationChange = (page, size) => {
    this.getList(null, { page: page - 1, size });
  };

  renderOptions = () => {
    const { options, extraOptions } = this.state;
    const {
      valueKey,
      labelKey,
      labelKeySelect,
      renderOptions,
      componentType,
      optionLabelProp,
    } = this.props;
    const currentOptions = [...extraOptions, ...options];
    if (renderOptions) {
      return renderOptions(currentOptions);
    } else {
      return currentOptions.map((item) => {
        const label = this.getLabel(labelKeySelect || labelKey, item);
        return (
          <Select.Option
            key={item[valueKey]}
            value={item[valueKey]}
            title={label}
            data={componentType === 'select' ? item : undefined}
            label={item[optionLabelProp || labelKey]}
          >
            {label}
          </Select.Option>
        );
      });
    }
  };

  getLabel = (label, item) => {
    const multipleLabel = String(label).includes('-');
    if (multipleLabel) {
      return String(label)
        .split('-')
        .map(
          (field) =>
            item[field.replace('{', '').replace('}', '').replace('$', '')],
        )
        .filter((value) => value)
        .join('-');
    } else {
      const { componentType, showLabel, renderLabel } = this.props; // 判断lov中的下拉框
      if (componentType === 'select') {
        if (showLabel) return item[showLabel] || item[label];
        else if (item.code) return `${item.code}-${item[label]}`;
        else if (renderLabel && typeof renderLabel === 'function')
          return renderLabel(item);
        else return item[label];
      } else return item[label];
    }
  };

  onSearch = (value) => {
    this.setState({ page: 0, searchText: value }, () => {
      const { open } = this.state;
      if (open) {
        this.getList(null, { formZero: true });
      }
    });
  };

  onDropdownVisibleChange = (isOpen) => {
    const { options, searchText, forceGetList } = this.state;
    const { showSearch, mode, beforeOpen } = this.props;
    if (isOpen) {
      if (beforeOpen) beforeOpen();
      this.setState({ open: true, searchText: null });
      if (!options.length || forceGetList) {
        this.canGetList = false;
        const { forceGetList: propsGet } = this.props;
        this.setState(
          {
            page: 0,
            total: 0,
            options: [],
            forceGetList: propsGet,
          },
          () => {
            this.getList();
          },
        );
      }
      showSearch &&
        mode !== 'multiple' &&
        setTimeout(() => {
          // 有搜索框才聚焦
          this.searchInput?.focus?.(); // 打开页面 下拉框中搜索框聚焦
        }, 300);
    } else {
      this.setState({ open: false, searchText: null });
      showSearch &&
        mode !== 'multiple' &&
        this.searchInput &&
        setTimeout(() => {
          this.setState({ searchInputValue: '' }); // 关闭页面清空 下拉框中搜索框的值
        }, 300);
      if (searchText) {
        this.setState({ page: 0, total: 0, options: [] });
      }
    }
  };

  // 渲染下拉框中的额外内容
  dropDownMultipleRender = () => {
    const { loading, options, extraOptions, value, open, total } = this.state;
    const {
      showPagination,
      showSearch,
      valueKey,
      labelKey,
      componentType,
      optionLabelProp,
    } = this.props;

    return (
      <MultipleOptionsRender
        selectValue={value}
        loading={loading}
        showSearch={showSearch}
        showPagination={showPagination}
        options={options}
        extraOptions={extraOptions}
        valueKey={valueKey}
        labelKey={labelKey}
        componentType={componentType}
        optionLabelProp={optionLabelProp}
        getLabel={this.getLabel}
        onSearch={this.onSearch}
        onChange={this.onChange}
        onSelect={this.handleSelectValue}
        onDeselect={this.handleDesSelectValue}
        onPopupScroll={this.onPopupScroll}
        open={open}
        total={total}
      />
    );
  };

  // Selec中 allowClear清除所有、删除单个tag，触发该方法
  onChange = (value, rest) => {
    const { componentType, onChange, mode } = this.props;
    const { value: stateValue } = this.state;
    if (componentType === 'select') {
      /**
       * 这行是为了兼容 onSelect，onDesSelect时，
       * 由于用户点击清除图标来控制数据，因内部allowClear触发的是onChange事件
       * 故判断如果value不存在或者value为 “ [] ”，执行一次onChange
       */
      if (!value || Array.isArray(value)) {
        const ids = value.map((o) => o.value ?? o);
        const newRest = stateValue.filter((o) => ids.includes(o.value ?? o));
        onChange(newRest, newRest);
        return;
      }
      return;
    }
    let result = value;
    if (mode === 'singleTag' && Array.isArray(result)) {
      // eslint-disable-next-line prefer-destructuring
      result = result[result.length - 1];
      this.setState({ open: false });
    }
    if (mode === 'singleTag' && !result) {
      // 清空
      this.selectRef.blur();
    }
    if (onChange) {
      onChange(result, rest);
    }
  };

  /**
   * lov模式下渲染的select组件取值：
   * handleSelectValue、handleDesSelectValue模拟onChange
   * @param {*} value
   * @param {*} option
   * @returns
   */
  handleSelectValue = (value, option) => {
    const { componentType, onChange, mode } = this.props;
    if (componentType !== 'select') return;
    if (mode !== 'multiple' && onChange) {
      onChange(option.data);
      return;
    }
    const { value: valueFromState } = this.state;
    if (onChange) onChange([...(valueFromState || []), option.data]);
  };

  // 反选
  handleDesSelectValue = (value) => {
    const { componentType, valueKey, onChange, mode } = this.props;
    if (componentType !== 'select') return;
    if (mode !== 'multiple') {
      onChange(undefined);
      return;
    }
    const { value: valueFromState } = this.state;
    const index = valueFromState.findIndex(
      (selected) => (selected[valueKey] || selected.value) === value.value,
    );
    if (~index && onChange) {
      const temp = [...valueFromState];
      temp.splice(index, 1);
      onChange(temp);
    }
  };

  removeRepeatData = (array, key, extraKey) => {
    const obj = {};
    return array.reduce((prev, next) => {
      obj[next[key] || next[extraKey]]
        ? ''
        : (obj[next[key] || next[extraKey]] =
            true && (next[key] || next[extraKey]) && prev.push(next));
      return prev;
    }, []);
  };

  filterProps = (rest = {}) => {
    const props = { ...rest };
    const filterFields = [
      'valueKey',
      'labelKey',
      'searchKey',
      'renderOptions',
      'extraOptionList',
    ];
    for (const key in props) {
      if ({}.hasOwnProperty.call(props, key) && filterFields.includes(key)) {
        delete props[key];
      }
    }
    return props;
  };

  tagRender = (props) => {
    const { label, closable, onClose } = props;
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        className="ant-select-selection-item"
        title={label}
        closeIcon={<CloseSvg onMouseDown={this.preventDefault} />}
      >
        <span className="ant-select-selection-item-content">{label}</span>
      </Tag>
    );
  };

  onDeleteValue = (target) => {
    const { value } = this.state;
    const { valueKey, onChange } = this.props;
    if (Array.isArray(value)) {
      const others = value.filter(
        (selected) =>
          (selected[valueKey] || selected.value) !==
          (target[valueKey] || target.value),
      );
      if (onChange) onChange(others);
    }
  };

  renderMaxTagPlaceholder = (omittedValues) => {
    return (
      <Tooltip
        placement="top"
        title={omittedValues.map((op, index) => (
          <span key={op.value}>
            {`${op.label}${index === omittedValues.length - 1 ? '' : '、'}`}
          </span>
        ))}
        overlayStyle={{ maxWidth: 300, maxHeight: 300, overflowY: 'unset' }}
        visible={omittedValues.length ? undefined : false}
      >
        {messages('base.count.options' /* {count}个选项 */, {
          params: { count: omittedValues.length },
        })}
        ...
      </Tooltip>
    );
  };

  handleControlOpen = (e) => {
    this.preventDefault(e);
    const { open } = this.state;
    this.onDropdownVisibleChange(!open);
  };

  preventDefault = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 给外部用来 聚焦 select的
  handleFocus = () => {
    this.selectRef.focus();
  };

  render() {
    const {
      allowClear,
      lazyLoad,
      showPagination,
      mode,
      componentType,
      onBlur,
      dropdownMatchSelectWidth,
      // 避免控制台警告，以下属性都不应该挂到select组件上
      // 以下属性来自lov组件，由于上级要求，强制lov组件内部整合当前组件渲染
      valueKey,
      labelKey,
      searchKey,
      renderOptions,
      extraOptionList,
      showSearch,
      selectorItem,
      showDetail,
      listExtraParams,
      requestBody,
      lovType,
      lovData,
      single,
      ...rest
    } = this.props;
    const { value, open, loading } = this.state;
    const classNames = `${
      mode === 'singleTag' ? 'single-tag' : 'multiple-tag'
    } ${
      value
        ? allowClear === undefined || allowClear !== false
          ? 'value'
          : 'value notAllowClear'
        : 'value valueNull'
    }`;
    const realDropdownMatchSelectWidth =
      dropdownMatchSelectWidth || (mode === 'multiple' ? 260 : 200);
    return (
      <Space
        style={{ width: rest?.style?.width || '100%' }}
        direction={rest.isSearchArea ? undefined : 'vertical'}
      >
        <Select
          {...this.filterProps(rest)}
          {...(mode === 'singleTag' ? { open } : {})}
          ref={(ref) => {
            this.selectRef = ref;
          }}
          dropdownMatchSelectWidth={realDropdownMatchSelectWidth}
          value={value}
          dropdownRender={
            mode === 'multiple'
              ? this.dropDownMultipleRender
              : this.dropdownRender
          }
          onPopupScroll={
            lazyLoad && !showPagination ? this.onPopupScroll : undefined
          }
          onSearch={this.onSearch}
          onDropdownVisibleChange={this.onDropdownVisibleChange}
          onChange={this.onChange}
          onSelect={this.handleSelectValue}
          // onDeselect={this.handleDesSelectValue}
          filterOption={false}
          defaultActiveFirstOption={false}
          mode={mode === 'singleTag' ? 'tags' : mode}
          loading={loading}
          className={`select-part-load ${classNames}`}
          tagRender={this.tagRender}
          maxTagCount={
            componentType === 'select'
              ? rest.isSearchArea
                ? 1
                : 'responsive'
              : undefined
          }
          maxTagPlaceholder={
            componentType === 'select'
              ? this.renderMaxTagPlaceholder
              : undefined
          }
          // UI设定：搜索区改造
          showSearch={false}
          onBlur={(e) => {
            onBlur && onBlur(e, open);
          }}
          open={open}
          allowClear={rest?.cusRemoveIcon ? false : allowClear}
          suffixIcon={
            rest?.cusRemoveIcon && allowClear !== false && value ? (
              <span
                onMouseDown={this.preventDefault}
                onClick={() => {
                  this.onChange(null);
                }}
              >
                {rest.cusRemoveIcon}
              </span>
            ) : rest?.cusRemoveIcon ? null : undefined
          }
          dropdownStyle={{
            paddingTop: 0,
          }}
          optionLabelProp={rest.optionLabelProp ? 'label' : 'children'}
          style={{ width: '100%' }}
        >
          {mode === 'multiple' ? null : this.renderOptions()}
        </Select>
        {/* UI设定：搜索区改造 */}
        {rest?.cusSuffixIcon ? (
          <span
            className="lovDropIcon"
            onClick={this.handleControlOpen}
            onMouseDown={this.preventDefault}
          >
            {rest?.cusSuffixIcon}
          </span>
        ) : null}
      </Space>
    );
  }
}

export default SelectPartLoad;

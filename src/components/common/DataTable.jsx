'use client';

import { Table, Button, Dropdown, Input } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function DataTable({
  total = 0,
  tableState = {
    page: 1,
    offset: 0,
    searchText: '',
    filters: {},
    sorter: {},
  },
  setTableState,
  selectedRowKeys = [],
  setSelectedRowKeys,
  columns = [],
  selectMenuItems = [],
  showSearchInput = false,
  onRowClick,
  rowKey = '_id',
  pageSize = 10,
  showRowSelection = true,
  editable = false,
  editingKey = '',
  onSave = () => {},
  onDelete = () => {},
  ...props
}) {
  // SEARCH (debounced → backend)
  const [searchText, setSearchText] = useState(tableState.searchText || '');
  const debouncedSearch = useDebounce(searchText);

  useEffect(() => {
    setTableState?.((prev) => ({
      ...prev,
      searchText: debouncedSearch,
      page: 1,
      offset: 0,
    }));
  }, [debouncedSearch, setTableState]);

  // PAGE CHANGE
  const handlePageChange = useCallback(
    (page) => {
      const newOffset = (page - 1) * pageSize;
      setTableState?.((prev) => ({
        ...prev,
        page,
        offset: newOffset,
      }));
    },
    [pageSize, setTableState]
  );

  // TABLE CHANGE → backend-driven sorting & filtering
  const handleTableChange = (pagination, filters, sorter) => {
    setTableState?.((prev) => ({
      ...prev,
      page: pagination.current,
      offset: (pagination.current - 1) * pageSize,
      filters, // backend’e direkt gidiyor
      sorter: {
        field: sorter.field,
        order: sorter.order,
      },
    }));
  };

  // ROW SELECTION
  const rowSelection = showRowSelection
    ? {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
      }
    : null;

  // BULK ACTION MENU
  const actionMenu =
    selectedRowKeys.length > 0 && selectMenuItems.length > 0 ? (
      <Dropdown menu={{ items: selectMenuItems }} placement="bottomLeft">
        <Button icon={<MoreOutlined />} />
      </Dropdown>
    ) : null;

  // HEADER
  const TableHeader = (showSearchInput || actionMenu) && (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 p-3">
      {showSearchInput && (
        <Input
          placeholder="Search..."
          variant="borderless"
          prefix={<SearchOutlined />}
          style={{ borderBottom: '1px solid gray' }}
          className="!border border-gray-300 rounded-none w-full max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      )}
      {actionMenu}
    </div>
  );

  // CLEAN COLUMNS (local onFilter / local sorter tamamen kaldırıldı)
  const processedColumns = columns.map((col) => {
    const newCol = { ...col };

    // Local filtering logic varsa kaldır (backend filtering kullanılacak)
    if (newCol.onFilter) {
      delete newCol.onFilter;
    }

    // Local sorter function kaldır (backend sorting kullanılacak)
    if (typeof newCol.sorter === 'function') {
      newCol.sorter = true; // UI sorting toggle kalsın, logic backend’den çalışsın
    }

    // Editable logic
    if (editable && col.editable) {
      newCol.onCell = (record) => ({
        record,
        editable: col.editable,
        editing: editingKey === record[rowKey],
        dataIndex: col.dataIndex,
        title: col.title,
        inputType: col.dataIndex,
        handleSave: onSave,
      });
    }

    return newCol;
  });

  return (
    <div className="flex flex-col bg-white border border-solid border-gray-200 rounded-lg shadow-sm overflow-x-auto">
      {TableHeader}

      <Table
        rowKey={rowKey}
        rowSelection={rowSelection}
        size="middle"
        columns={processedColumns}
        pagination={{
          showSizeChanger: false,
          pageSize,
          total,
          current: tableState.page,
          onChange: handlePageChange,
        }}
        rowClassName={(record) =>
          `cursor-pointer hover:bg-gray-50 ${
            editingKey === record[rowKey] ? 'editable-row' : ''
          }`
        }
        onRow={
          onRowClick
            ? (record) => ({
                onClick: () => onRowClick(record),
              })
            : undefined
        }
        onChange={handleTableChange}
        {...props}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

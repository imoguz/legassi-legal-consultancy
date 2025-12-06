'use client';

import { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { useGetTasksByMatterIdQuery } from '@/rtk/api/taskApi';
import { matterTaskList } from '@/utils/constants';
import TaskDetailModal from './TaskDetailModal';

export default function MatterTasksTable({ matterId }) {
  const [tableState, setTableState] = useState({
    offset: 0,
    searchText: '',
    filters: {},
    sorter: {},
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const pageSize = 5;

  const page = tableState.offset / pageSize + 1;

  const { data, isLoading } = useGetTasksByMatterIdQuery({
    matterId,
    page,
    limit: pageSize,
  });

  const tasks = data?.data || data || [];
  const total = data?.pagination?.totalItems || 0;

  const handleRowClick = (record) => {
    setSelectedTaskId(record._id);
  };

  return (
    <>
      <DataTable
        total={total}
        tableState={tableState}
        setTableState={setTableState}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        columns={matterTaskList}
        dataSource={tasks}
        pageSize={pageSize}
        showRowSelection={false}
        loading={isLoading}
        onRowClick={handleRowClick}
      />

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          open={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </>
  );
}

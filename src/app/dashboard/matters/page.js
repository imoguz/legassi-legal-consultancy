"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Card, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import DataTable from "@/components/common/DataTable";
import {
  useGetMattersQuery,
  useGetMatterStatsQuery,
} from "@/rtk/api/matterApi";
import { useGetMatterFiltersQuery } from "@/rtk/api/filtersApi";
import { matterColumns } from "@/utils/constants";

const { Text, Title } = Typography;

// Stats Card
const StatsCard = ({ title, value, color, icon }) => (
  <Card size="small" className="h-full">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold text-${color}-500`}>{value}</p>
      </div>
      <div
        className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  </Card>
);

export default function MattersPage() {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableState, setTableState] = useState({
    offset: 0,
    searchText: "",
    sorter: {},
    filters: {},
  });

  // API Calls
  const { data: mattersData, isLoading } = useGetMattersQuery({
    page: Math.floor(tableState.offset / 20) + 1,
    limit: 20,
    search: tableState.searchText,
    filters: tableState.filters,
    sortBy: tableState.sorter?.field,
    sortOrder: tableState.sorter?.order,
  });

  const { data: statsData } = useGetMatterStatsQuery();
  const { data: filtersData } = useGetMatterFiltersQuery();

  const matters = mattersData?.data || [];
  const totalMatters = mattersData?.pagination?.total || 0;

  const stats = {
    total: statsData?.total || 0,
    active: statsData?.active || 0,
    pending: statsData?.pending || 0,
    closed: statsData?.closed || 0,
  };

  // Filters
  const updatedColumns = matterColumns.map((col) => {
    const key = col.key || col.dataIndex;

    // Status column
    if (key === "status" && filtersData?.data?.status) {
      return { ...col, filters: filtersData.data.status };
    }

    // Priority column
    if (key === "priority" && filtersData?.data?.priority) {
      return { ...col, filters: filtersData.data.priority };
    }

    // Stage column
    if (key === "stage" && filtersData?.data?.stage) {
      return { ...col, filters: filtersData.data.stage };
    }

    // Primary Attorney column
    if (key === "primaryAttorney" && filtersData?.data?.primaryAttorney) {
      return { ...col, filters: filtersData.data.primaryAttorney };
    }

    // Team column
    if (key === "team" && filtersData?.data?.teamMembers) {
      return {
        ...col,
        filters: filtersData.data.teamMembers,
        filterMultiple: false,
      };
    }

    // Opening Date column
    if (key === "openingDate" && filtersData?.data?.openingDate) {
      return {
        ...col,
        filters: filtersData.data.openingDate,
        filterMultiple: false,
      };
    }

    // Practice Area
    if (key === "practiceArea" && filtersData?.data?.practiceArea) {
      return { ...col, filters: filtersData.data.practiceArea };
    }

    return col;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={3} className="m-0">
            Matters
          </Title>
          <Text type="secondary">
            Manage and organize all your legal matters in one place.
          </Text>
        </div>
        <Link href="/dashboard/matters/create">
          <Button type="primary" icon={<PlusOutlined />}>
            New Matter
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Matters"
          value={stats.total}
          color="blue"
          icon={<span className="text-blue-500">📋</span>}
        />
        <StatsCard
          title="Active"
          value={stats.active}
          color="green"
          icon={<span className="text-green-500">✅</span>}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          color="orange"
          icon={<span className="text-orange-500">⏳</span>}
        />
        <StatsCard
          title="Closed"
          value={stats.closed}
          color="gray"
          icon={<span className="text-gray-500">🔒</span>}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={updatedColumns}
        dataSource={matters}
        loading={isLoading}
        total={totalMatters}
        tableState={tableState}
        setTableState={setTableState}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        showSearchInput
        onRowClick={(record) => router.push(`/dashboard/matters/${record._id}`)}
        pageSize={20}
        rowKey="_id"
        scroll={{ x: 1200 }}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const NotesControls = ({
  searchInput,
  onSearchChange,
  onClearSearch,
  sort,
  onSortChange,
  filteredCount,
  totalCount,
  searchQuery,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {/* Search Input */}
        <Input
          placeholder="Search in notes..."
          allowClear
          value={searchInput}
          onChange={onSearchChange}
          prefix={<SearchOutlined />}
          className="w-full sm:w-64"
          size="middle"
        />

        {/* Sort Select */}
        <Select
          value={sort}
          onChange={onSortChange}
          options={[
            { label: 'Newest first', value: 'newest' },
            { label: 'Oldest first', value: 'oldest' },
            { label: 'Recently updated', value: 'recentlyUpdated' },
            { label: 'Author (A-Z)', value: 'author' },
            { label: 'Pinned notes', value: 'pinned' },
            { label: 'Internal', value: 'internal' },
            { label: 'Team', value: 'team' },
            { label: 'Restricted', value: 'restricted' },
            { label: 'Client', value: 'client' },
          ]}
          className="w-full sm:w-48"
          size="middle"
        />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          Showing {filteredCount} of {totalCount} notes
        </span>
        {searchQuery && (
          <Button type="link" onClick={onClearSearch} size="small">
            Clear search
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotesControls;

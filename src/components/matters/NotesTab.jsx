"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  Button,
  Tag,
  Empty,
  Spin,
  Row,
  Col,
  Space,
  Pagination,
} from "antd";
import { PlusOutlined, PushpinOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { debounce } from "lodash";
import { useDeleteNoteMutation } from "@/rtk/api/matterApi";
import NotesModal from "./NotesModal";
import NotesControls from "./NotesControls";
import { notify } from "@/utils/helpers";
import NoteListItem from "./NoteListItem";

dayjs.extend(relativeTime);

// Sorting pipelines
const compareDateDesc = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
const compareDateAsc = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
const compareAuthor = (a, b) => {
  const nameA = `${a.author?.firstname || ""} ${a.author?.lastname || ""}`
    .trim()
    .toLowerCase();
  const nameB = `${b.author?.firstname || ""} ${b.author?.lastname || ""}`
    .trim()
    .toLowerCase();
  return nameA.localeCompare(nameB);
};

const compareUpdatedDesc = (a, b) =>
  new Date(b.updatedAt) - new Date(a.updatedAt);

const sortPipelines = {
  newest: [compareDateDesc],
  oldest: [compareDateAsc],
  recentlyUpdated: [compareUpdatedDesc],
  author: [compareAuthor],
  pinned: [compareDateDesc],
  internal: [compareDateDesc],
  team: [compareDateDesc],
  restricted: [compareDateDesc],
  client: [compareDateDesc],
};

const sortNotes = (notes, sort) => {
  if (sort === "pinned") {
    const pinnedNotes = notes.filter((note) => note.pinned);
    return [...pinnedNotes].sort(compareDateDesc);
  }

  if (["internal", "team", "restricted", "client"].includes(sort)) {
    const filteredNotes = notes.filter((note) => note.visibility === sort);
    return [...filteredNotes].sort(compareDateDesc);
  }

  const pipeline = sortPipelines[sort] || sortPipelines.newest;
  return [...notes].sort((a, b) => {
    for (const comparator of pipeline) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  });
};

export default function NotesTab({ matter }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [deleteNote] = useDeleteNoteMutation();

  const notes = matter?.notes || [];
  const matterId = matter?._id;

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Handle search
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Handle sort change
  const handleSortChange = useCallback((value) => {
    setSort(value);
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Cleanup debounce
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Filter and sort
  const { filteredNotes, sortedNotes } = useMemo(() => {
    const filtered = notes.filter((note) => {
      if (!searchQuery) return true;

      const searchLower = searchQuery.toLowerCase();
      return (
        note.contentHtml?.toLowerCase().includes(searchLower) ||
        note.author?.firstname?.toLowerCase().includes(searchLower) ||
        note.author?.lastname?.toLowerCase().includes(searchLower) ||
        `${note.author?.firstname} ${note.author?.lastname}`
          .toLowerCase()
          .includes(searchLower)
      );
    });

    const sorted = sortNotes(filtered, sort);
    return { filteredNotes: filtered, sortedNotes: sorted };
  }, [notes, searchQuery, sort]);

  // Paginate notes
  const paginatedNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedNotes.slice(startIndex, endIndex);
  }, [sortedNotes, currentPage, pageSize]);

  const handleAddNote = () => {
    setCurrentNote(null);
    setModalMode("create");
    setModalVisible(true);
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleViewNote = (note) => {
    setCurrentNote(note);
    setModalMode("view");
    setModalVisible(true);
  };

  const handleDeleteNote = async (noteId) => {
    setDeletingId(noteId);
    try {
      await deleteNote({ matterId, noteId }).unwrap();
      notify.success("Success", "Note deleted successfully.");
      if (paginatedNotes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      notify.error(
        "Error",
        err?.data?.message || "Notes cannot be deleted. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentNote(null);
    setModalMode("create");
  };

  if (!matter) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="notes-tab">
      <Card
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <Space align="center">
                <span className="text-lg font-semibold">Notes</span>
                <Tag color="blue" className="opacity-80">
                  <span className="font-medium mr-2">{notes.length} notes</span>
                  {notes.some((n) => n.pinned) && (
                    <>
                      {" • "}
                      <PushpinOutlined style={{ marginRight: 4 }} />
                      {notes.filter((n) => n.pinned).length} pinned
                    </>
                  )}
                </Tag>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddNote}
                size="middle"
                className="font-medium"
              >
                Add Note
              </Button>
            </Col>
          </Row>
        }
      >
        {notes.length > 0 ? (
          <>
            <NotesControls
              searchInput={searchInput}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
              sort={sort}
              onSortChange={handleSortChange}
              filteredCount={filteredNotes.length}
              totalCount={notes.length}
              searchQuery={searchQuery}
            />

            {filteredNotes.length > 0 ? (
              <div className="notes-list-container">
                {/* Notes Grid */}
                <Row gutter={[0, 16]} className="notes-list">
                  {paginatedNotes.map((note) => (
                    <NoteListItem
                      key={note._id}
                      note={note}
                      onView={handleViewNote}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteNote}
                      isDeleting={deletingId !== null}
                      deletingId={deletingId}
                    />
                  ))}
                </Row>

                {/* Pagination */}
                {filteredNotes.length > pageSize && (
                  <div className="mt-6 flex justify-end">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredNotes.length}
                      onChange={handlePageChange}
                      onShowSizeChange={(current, size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} notes`
                      }
                      showSizeChanger={true}
                      pageSizeOptions={["10", "20", "50", "100"]}
                      className="notes-pagination"
                    />
                  </div>
                )}
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-gray-500">
                    <div className="text-lg font-medium mb-2">
                      No notes found
                    </div>
                    <div className="text-sm">
                      {searchQuery
                        ? "Try changing your search terms"
                        : "No notes match your filters"}
                    </div>
                  </div>
                }
                className="py-12"
              >
                {searchQuery && (
                  <Button onClick={handleClearSearch} type="primary">
                    Clear search
                  </Button>
                )}
              </Empty>
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-gray-500">
                <div className="text-lg font-medium mb-2">No notes yet</div>
                <div className="text-sm">Start by creating your first note</div>
              </div>
            }
            className="py-12"
          ></Empty>
        )}
      </Card>

      <NotesModal
        visible={modalVisible}
        note={currentNote}
        mode={modalMode}
        matterId={matterId}
        onClose={handleModalClose}
        onModeChange={setModalMode}
      />
    </div>
  );
}

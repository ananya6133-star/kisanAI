import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { advisoryService } from '../services/advisoryService';
import { Sprout, PlusCircle, Trash2, History } from 'lucide-react';
import { SearchAndFilter } from '../components/history/SearchAndFilter';
import { AdvisoryHistoryItem } from '../components/history/AdvisoryHistoryItem';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Spinner } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export function HistoryPage() {
  const { getAccessToken } = useAuth();

  const [advisories, setAdvisories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const response = await advisoryService.getAdvisories({
        search,
        crop: cropFilter,
        page: pagination.page,
        limit: pagination.limit,
        sort: sortOrder
      }, token);

      setAdvisories(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setError(err.message || 'Failed to fetch advisory history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchHistory();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, cropFilter, sortOrder, pagination.page]);

  const handleDelete = async () => {
    if (!selectedForDelete) return;
    setIsDeleting(true);
    try {
      const token = await getAccessToken();
      await advisoryService.deleteAdvisory(selectedForDelete.id, token);

      
      // Optimistic UI update
      setAdvisories((prev) => prev.filter((a) => a.id !== selectedForDelete.id));
      setSelectedForDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete advisory.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Advisory History & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, review, and reference your historical crop advisories
          </p>
        </div>

        <Link to="/advisory/new">
          <Button variant="primary" icon={PlusCircle} size="md">
            New Advisory
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        search={search}
        onSearchChange={setSearch}
        cropFilter={cropFilter}
        onCropFilterChange={setCropFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Searching advisory archives..." />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState
          title="History Error"
          message={error}
          onRetry={fetchHistory}
        />
      )}

      {/* Results Grid */}
      {!isLoading && !error && (
        <>
          {advisories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {advisories.map((advisory) => (
                <AdvisoryHistoryItem
                  key={advisory.id}
                  advisory={advisory}
                  onDelete={(item) => setSelectedForDelete(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title={search || cropFilter ? 'No matching advisories' : 'No advisory records found'}
              description={search || cropFilter ? 'Try clearing your search query or crop filter.' : 'You have not created any crop advisories yet.'}
              actionLabel={search || cropFilter ? 'Clear Filters' : 'Create First Advisory'}
              actionIcon={PlusCircle}
              onAction={() => {
                if (search || cropFilter) {
                  setSearch('');
                  setCropFilter('');
                } else {
                  window.location.href = '/advisory/new';
                }
              }}
            />
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              >
                Previous
              </Button>
              <span className="text-xs text-slate-500 font-medium px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(selectedForDelete)}
        onClose={() => setSelectedForDelete(null)}
        title="Confirm Record Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete the advisory record for <strong>{selectedForDelete?.crop_name}</strong>?
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setSelectedForDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              icon={Trash2}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

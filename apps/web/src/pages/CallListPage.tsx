import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallListStore } from '../store';
import { CallRecord, FilterOptions, SortOptions } from '@conista/shared-types';

/**
 * Call list page component
 */
const CallListPage: React.FC = () => {
  const { 
    fetchCalls, 
    calls, 
    isLoading, 
    error, 
    pagination, 
    filters, 
    sort,
    setFilters,
    setSort,
    setPage,
    resetFilters
  } = useCallListStore();
  
  const navigate = useNavigate();
  
  // Fetch calls data when component mounts
  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);
  
  // Handle row click to navigate to call detail
  const handleRowClick = (callId: string) => {
    navigate(`/calls/${callId}`);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field, direction });
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Call Recordings</h1>
        <button
          onClick={() => navigate('/upload')}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Upload New Call
        </button>
      </div>
      
      {/* Filters Section */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Filter */}
          <div>
            <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Search calls..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={(filters.status && filters.status[0]) || ''}
              onChange={(e) => 
                handleFilterChange({ 
                  status: e.target.value ? [e.target.value] : undefined 
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="analyzed">Analyzed</option>
              <option value="reviewed">Reviewed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          {/* Date Range Filter */}
          <div>
            <label htmlFor="date-from" className="mb-1 block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              id="date-from"
              value={filters.dateRange?.start || ''}
              onChange={(e) => 
                handleFilterChange({ 
                  dateRange: { 
                    ...filters.dateRange, 
                    start: e.target.value 
                  } 
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="date-to" className="mb-1 block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              id="date-to"
              value={filters.dateRange?.end || ''}
              onChange={(e) => 
                handleFilterChange({ 
                  dateRange: { 
                    ...filters.dateRange, 
                    end: e.target.value 
                  } 
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => resetFilters()}
            className="ml-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Call List Section */}
      <div className="rounded-lg bg-white shadow">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-700">
            <p>Error loading calls: {error}</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-lg text-gray-500">No calls found</p>
            <p className="mt-2 text-gray-400">Try changing your filters or upload new calls</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                    onClick={() => handleSortChange('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {sort.field === 'title' && (
                        <span className="ml-1">
                          {sort.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer"
                    onClick={() => handleSortChange('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {sort.field === 'date' && (
                        <span className="ml-1">
                          {sort.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {calls.map((call: CallRecord) => (
                  <tr 
                    key={call.id}
                    onClick={() => handleRowClick(call.id)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{call.title}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {new Date(call.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">{call.agentName}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {Math.floor(call.duration / 60)}m {call.duration % 60}s
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full px-2 text-xs font-semibold uppercase leading-5"
                        style={{
                          backgroundColor: 
                            call.status === 'new' ? 'rgb(219, 234, 254)' : 
                            call.status === 'analyzed' ? 'rgb(220, 252, 231)' : 
                            call.status === 'reviewed' ? 'rgb(254, 249, 195)' : 
                            'rgb(229, 231, 235)',
                          color: 
                            call.status === 'new' ? 'rgb(30, 64, 175)' : 
                            call.status === 'analyzed' ? 'rgb(22, 101, 52)' : 
                            call.status === 'reviewed' ? 'rgb(146, 64, 14)' : 
                            'rgb(75, 85, 99)',
                        }}
                      >
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && !error && calls.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                        pagination.page === i + 1
                          ? 'z-10 border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallListPage; 
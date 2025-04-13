import React, { useState } from 'react';
import { format } from 'date-fns';
import { CallRecord, CallStatus, SortOptions } from '@conista/shared-types';
import DataTable from './DataTable';

export interface CallDataTableProps {
  /**
   * Array of call records to display
   */
  calls: CallRecord[];
  
  /**
   * Whether the data is currently loading
   */
  isLoading?: boolean;
  
  /**
   * Whether the table should support row selection
   */
  selectable?: boolean;
  
  /**
   * IDs of currently selected calls
   */
  selectedCallIds?: string[];
  
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedIds: string[]) => void;
  
  /**
   * Current sort state
   */
  sort?: SortOptions;
  
  /**
   * Callback when sort changes
   */
  onSortChange?: (sort: SortOptions) => void;
  
  /**
   * Whether to use client-side sorting (true) or server sorting (false)
   */
  clientSideSort?: boolean;
  
  /**
   * Callback when a row is clicked
   */
  onRowClick?: (call: CallRecord) => void;
}

/**
 * Formatted display of call duration in minutes and seconds
 */
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Get status badge styling based on call status
 */
const getStatusBadge = (status: CallStatus): React.ReactNode => {
  const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-medium';
  
  switch (status) {
    case CallStatus.Completed:
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
    case CallStatus.InProgress:
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</span>;
    case CallStatus.Failed:
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Failed</span>;
    case CallStatus.Scheduled:
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Scheduled</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

/**
 * Component for displaying call records in a data table
 */
const CallDataTable: React.FC<CallDataTableProps> = ({
  calls,
  isLoading = false,
  selectable = false,
  selectedCallIds = [],
  onSelectionChange,
  sort,
  onSortChange,
  clientSideSort = true,
  onRowClick,
}) => {
  // Define table columns
  const columns = [
    {
      id: 'date',
      header: 'Date & Time',
      accessor: (call: CallRecord) => (
        <div>
          <div className="font-medium">{format(new Date(call.date), 'MMM d, yyyy')}</div>
          <div className="text-neutral-500">{format(new Date(call.date), 'h:mm a')}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'agent',
      header: 'Agent',
      accessor: (call: CallRecord) => call.agentName,
      sortable: true,
    },
    {
      id: 'client',
      header: 'Client',
      accessor: (call: CallRecord) => call.clientName,
      sortable: true,
    },
    {
      id: 'duration',
      header: 'Duration',
      accessor: (call: CallRecord) => formatDuration(call.durationInSeconds),
      sortable: true,
      align: 'right' as const,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (call: CallRecord) => getStatusBadge(call.status),
      sortable: true,
    },
    {
      id: 'score',
      header: 'Score',
      accessor: (call: CallRecord) => (
        call.score ? (
          <div className="flex items-center justify-end">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              call.score >= 80 ? 'bg-green-100 text-green-800' : 
              call.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {call.score}%
            </span>
          </div>
        ) : (
          <span className="text-neutral-400">N/A</span>
        )
      ),
      sortable: true,
      align: 'right' as const,
    },
  ];

  return (
    <DataTable
      data={calls}
      columns={columns}
      getRowId={(call) => call.id}
      isLoading={isLoading}
      emptyMessage="No call records found"
      selectable={selectable}
      selectedIds={selectedCallIds}
      onSelectionChange={onSelectionChange}
      initialSort={sort}
      onSortChange={onSortChange}
      clientSideSort={clientSideSort}
      hoverable={true}
      getRowProps={(call) => ({
        onClick: onRowClick ? () => onRowClick(call) : undefined,
        className: onRowClick ? 'cursor-pointer' : '',
      })}
    />
  );
};

export default CallDataTable; 
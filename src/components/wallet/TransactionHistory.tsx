import React, { useState, useMemo, useCallback } from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Briefcase, Filter, Download, Search } from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus } from '../../types/payment';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize filtered transactions to avoid re-filtering on every render
  const filteredTransactions = useMemo(() => 
    transactions.filter((txn) => {
      const matchesType = filterType === 'all' || txn.type === filterType;
      const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
      const matchesSearch = searchQuery === '' ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.receiverName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    }),
  [transactions, filterType, filterStatus, searchQuery]);

  // Memoize callbacks
  const handleFilterTypeChange = useCallback((type: TransactionType | 'all') => {
    setFilterType(type);
  }, []);

  const handleFilterStatusChange = useCallback((status: TransactionStatus | 'all') => {
    setFilterStatus(status);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-5 h-5 text-green-600" />;
      case 'withdraw':
        return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
      case 'transfer':
        return <ArrowRightLeft className="w-5 h-5 text-purple-600" />;
      case 'deal-funding':
        return <Briefcase className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Filters */}
      <div className="p-6 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => handleFilterTypeChange(e.target.value as TransactionType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="transfer">Transfer</option>
            <option value="deal-funding">Deal Funding</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => handleFilterStatusChange(e.target.value as TransactionStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <p className="text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From/To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(txn.type)}
                      <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                        {txn.type.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{txn.description}</div>
                    {txn.dealName && (
                      <div className="text-xs text-gray-500 mt-1">{txn.dealName}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${txn.amount.toLocaleString()}
                    </div>
                    {txn.fee && txn.fee > 0 && (
                      <div className="text-xs text-gray-500">Fee: ${txn.fee}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {txn.type === 'deposit' && (txn.senderName || 'External')}
                      {txn.type === 'withdraw' && (txn.receiverName || 'Bank Account')}
                      {txn.type === 'transfer' && (
                        <div>
                          <div>From: {txn.senderName || 'You'}</div>
                          <div>To: {txn.receiverName || 'Recipient'}</div>
                        </div>
                      )}
                      {txn.type === 'deal-funding' && (
                        <div>
                          <div className="text-blue-600">{txn.senderName}</div>
                          <div className="text-gray-500 text-xs">→ {txn.receiverName}</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(txn.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(txn.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(txn.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No transactions found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
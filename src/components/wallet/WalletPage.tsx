import React, { useState } from 'react';
import WalletBalance from '../../components/wallet/WalletBalance';
import QuickActions from '../../components/wallet/QuickActions';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import DepositModal from '../../components/wallet/DepositModal';
import WithdrawModal from '../../components/wallet/WithdrawModal';
import TransferModal from '../../components/wallet/TransferModal';
import FundDealModal from '../../components/wallet/FundDealModal';
import { mockWallet, mockTransactions } from '../../data/transactions';
import { useAuth } from '../../context/AuthContext';
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(mockWallet);
  const [transactions] = useState(mockTransactions);
  const [showBalance, setShowBalance] = useState(true);
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showFundDealModal, setShowFundDealModal] = useState(false);

  const handleDeposit = (amount: number, _method: string) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      availableBalance: prev.availableBalance + amount,
      totalDeposits: prev.totalDeposits + amount,
    }));
  };

  const handleWithdraw = (amount: number, _method: string) => {
    const fee = 2.5;
    const total = amount + fee;
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - total,
      availableBalance: prev.availableBalance - total,
      totalWithdrawals: prev.totalWithdrawals + amount,
    }));
  };

  const handleTransfer = (amount: number, _recipientId: string, _notes: string) => {
    const fee = amount * 0.01;
    const total = amount + fee;
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - total,
      availableBalance: prev.availableBalance - total,
      totalTransfers: prev.totalTransfers + amount,
    }));
  };

  const handleFundDeal = (_entrepreneurId: string, amount: number, _dealTerms: string) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amount,
      availableBalance: prev.availableBalance - amount,
      totalTransfers: prev.totalTransfers + amount,
    }));
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Wallet className="w-7 h-7 mr-2 text-blue-600" />
              Wallet
            </h1>
            <p className="text-gray-600 mt-1">Manage your funds and transactions</p>
          </div>
        </div>

        <WalletBalance
          balance={wallet.balance}
          availableBalance={wallet.availableBalance}
          pendingBalance={wallet.pendingBalance}
          currency={wallet.currency}
          showBalance={showBalance}
          onToggleVisibility={() => setShowBalance(!showBalance)}
        />

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <QuickActions
            onDeposit={() => setShowDepositModal(true)}
            onWithdraw={() => setShowWithdrawModal(true)}
            onTransfer={() => setShowTransferModal(true)}
            onFundDeal={() => setShowFundDealModal(true)}
            userRole={user.role}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${wallet.totalDeposits.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowDownRight className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Withdrawals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${wallet.totalWithdrawals.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ArrowUpRight className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${wallet.totalTransfers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <TransactionHistory transactions={transactions} />

        {/* Modals */}
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onDeposit={handleDeposit}
        />
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          onWithdraw={handleWithdraw}
          availableBalance={wallet.availableBalance}
        />
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransfer}
          availableBalance={wallet.availableBalance}
          currentUserId={user.id}
        />
        <FundDealModal
          isOpen={showFundDealModal}
          onClose={() => setShowFundDealModal(false)}
          onFund={handleFundDeal}
          availableBalance={wallet.availableBalance}
        />
    </div>
  );
};

export default WalletPage;
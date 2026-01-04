import React from 'react';
import { CreditCard, Building, Wallet as WalletIcon, Mail, Check, MoreVertical } from 'lucide-react';
import { PaymentMethodInfo } from '../../types/payment';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodInfo;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onSetDefault,
  onRemove,
}) => {
  const getIcon = () => {
    switch (paymentMethod.type) {
      case 'credit-card':
        return <CreditCard className="w-6 h-6" />;
      case 'bank-account':
        return <Building className="w-6 h-6" />;
      case 'paypal':
        return <Mail className="w-6 h-6" />;
      case 'crypto':
        return <WalletIcon className="w-6 h-6" />;
    }
  };

  const getDisplayName = () => {
    switch (paymentMethod.type) {
      case 'credit-card':
        return `${paymentMethod.brand} ••••${paymentMethod.last4}`;
      case 'bank-account':
        return `${paymentMethod.brand} ••••${paymentMethod.last4}`;
      case 'paypal':
        return paymentMethod.email;
      case 'crypto':
        return `${paymentMethod.walletAddress?.slice(0, 6)}...${paymentMethod.walletAddress?.slice(-4)}`;
    }
  };

  const getBackgroundColor = () => {
    if (paymentMethod.isDefault) return 'from-blue-500 to-purple-600';
    switch (paymentMethod.type) {
      case 'credit-card':
        return 'from-gray-700 to-gray-900';
      case 'bank-account':
        return 'from-green-600 to-teal-700';
      case 'paypal':
        return 'from-blue-600 to-indigo-700';
      case 'crypto':
        return 'from-orange-500 to-red-600';
    }
  };

  return (
    <div className={`relative bg-gradient-to-br ${getBackgroundColor()} rounded-xl shadow-lg p-6 text-white`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="text-sm font-medium capitalize">
            {paymentMethod.type.replace('-', ' ')}
          </span>
        </div>
        
        <button className="text-white/80 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Card Number / Account Info */}
      <div className="mb-6">
        <p className="text-2xl font-bold tracking-wider">
          {getDisplayName()}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          {paymentMethod.holderName && (
            <p className="text-sm font-medium">{paymentMethod.holderName}</p>
          )}
          {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
            <p className="text-xs text-white/70 mt-1">
              Expires {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
            </p>
          )}
          {paymentMethod.type === 'paypal' && (
            <p className="text-xs text-white/70 mt-1">PayPal Account</p>
          )}
          {paymentMethod.type === 'crypto' && (
            <p className="text-xs text-white/70 mt-1">Crypto Wallet</p>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-col items-end space-y-1">
          {paymentMethod.isDefault && (
            <span className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
              <Check className="w-3 h-3 mr-1" />
              Default
            </span>
          )}
          {paymentMethod.isVerified ? (
            <span className="bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-green-100">
              Verified
            </span>
          ) : (
            <span className="bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-yellow-100">
              Unverified
            </span>
          )}
        </div>
      </div>

      {/* Actions (hover overlay) */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-4">
        {!paymentMethod.isDefault && onSetDefault && (
          <button
            onClick={() => onSetDefault(paymentMethod.id)}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Set as Default
          </button>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(paymentMethod.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
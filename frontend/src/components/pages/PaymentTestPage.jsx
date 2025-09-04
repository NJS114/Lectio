import React, { useState } from 'react';
import { usePayment } from '../../hooks/usePayment';
import { useShipping } from '../../hooks/useShipping';
import { 
  CreditCard, Wallet, Smartphone, Building2, Package, 
  Plus, Edit, Trash2, DollarSign, TrendingUp, Calendar,
  CheckCircle, AlertCircle, Clock, Euro, Banknote,
  PiggyBank, Target, Award, Gift
} from 'lucide-react';

const PaymentTestPage = () => {
  const { 
    paymentMethods, 
    savedCards, 
    paymentHistory, 
    processPayment,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    calculateFees 
  } = usePayment();

  const { savedAddresses, addAddress } = useShipping();

  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);

  // Données simulées pour les gains
  const [earnings, setEarnings] = useState({
    totalEarnings: 1247.50,
    pendingEarnings: 89.25,
    availableBalance: 1158.25,
    thisMonth: 234.75,
    lastMonth: 189.50,
    totalSales: 47,
    averageSale: 26.54
  });

  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 'bank_1',
      bankName: 'Crédit Agricole',
      accountNumber: '****1234',
      iban: 'FR76****1234',
      isDefault: true,
      verified: true
    },
    {
      id: 'bank_2',
      bankName: 'BNP Paribas',
      accountNumber: '****5678',
      iban: 'FR14****5678',
      isDefault: false,
      verified: false
    }
  ]);

  const [withdrawalHistory, setWithdrawalHistory] = useState([
    {
      id: 'withdraw_1',
      amount: 150.00,
      date: new Date('2024-08-10'),
      status: 'completed',
      bankAccount: 'Crédit Agricole ****1234',
      processingTime: '2 jours'
    },
    {
      id: 'withdraw_2',
      amount: 75.50,
      date: new Date('2024-08-05'),
      status: 'completed',
      bankAccount: 'Crédit Agricole ****1234',
      processingTime: '1 jour'
    },
    {
      id: 'withdraw_3',
      amount: 200.00,
      date: new Date('2024-08-01'),
      status: 'pending',
      bankAccount: 'BNP Paribas ****5678',
      processingTime: '3-5 jours'
    }
  ]);

  const handleTestPayment = async () => {
    setIsProcessing(true);
    try {
      const paymentData = {
        amount: 25.50,
        method: 'card',
        description: 'Test de paiement - Achat de livres'
      };
      
      const result = await processPayment(paymentData);
      console.log('Paiement réussi:', result);
    } catch (error) {
      console.error('Erreur de paiement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawal = (amount) => {
    const withdrawal = {
      id: `withdraw_${Date.now()}`,
      amount,
      date: new Date(),
      status: 'pending',
      bankAccount: bankAccounts.find(acc => acc.isDefault)?.bankName + ' ' + bankAccounts.find(acc => acc.isDefault)?.accountNumber,
      processingTime: '1-3 jours'
    };
    
    setWithdrawalHistory(prev => [withdrawal, ...prev]);
    setEarnings(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      pendingEarnings: prev.pendingEarnings + amount
    }));
  };

  const getPaymentIcon = (methodId) => {
    const icons = {
      card: CreditCard,
      paypal: Wallet,
      apple_pay: Smartphone,
      google_pay: Smartphone,
      bank_transfer: Building2
    };
    return icons[methodId] || CreditCard;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: CheckCircle,
      pending: Clock,
      failed: AlertCircle
    };
    return icons[status] || Clock;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              💰 Tests des Fonctionnalités de Paiement
            </h1>
            <p className="text-gray-600">
              Interface complète pour tester les paiements, gains et gestion des comptes bancaires
            </p>
          </div>

          {/* Navigation par onglets */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Vue d\'ensemble', icon: DollarSign },
                { id: 'payments', name: 'Méthodes de paiement', icon: CreditCard },
                { id: 'earnings', name: 'Mes gains', icon: TrendingUp },
                { id: 'accounts', name: 'Comptes bancaires', icon: Building2 },
                { id: 'history', name: 'Historique', icon: Calendar }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-violet-500 text-violet-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Gains totaux</p>
                        <p className="text-2xl font-bold">{earnings.totalEarnings.toFixed(2)}€</p>
                      </div>
                      <PiggyBank size={32} className="text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Solde disponible</p>
                        <p className="text-2xl font-bold">{earnings.availableBalance.toFixed(2)}€</p>
                      </div>
                      <Banknote size={32} className="text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100">En attente</p>
                        <p className="text-2xl font-bold">{earnings.pendingEarnings.toFixed(2)}€</p>
                      </div>
                      <Clock size={32} className="text-yellow-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Ce mois</p>
                        <p className="text-2xl font-bold">{earnings.thisMonth.toFixed(2)}€</p>
                      </div>
                      <TrendingUp size={32} className="text-purple-200" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Target className="mr-2 text-violet-600" size={20} />
                      Statistiques de vente
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nombre de ventes</span>
                        <span className="font-semibold">{earnings.totalSales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vente moyenne</span>
                        <span className="font-semibold">{earnings.averageSale.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Évolution vs mois dernier</span>
                        <span className="font-semibold text-green-600">+24%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Award className="mr-2 text-violet-600" size={20} />
                      Actions rapides
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={handleTestPayment}
                        disabled={isProcessing}
                        className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <Clock className="animate-spin mr-2" size={16} />
                        ) : (
                          <CreditCard className="mr-2" size={16} />
                        )}
                        Tester un paiement
                      </button>
                      
                      <button 
                        onClick={() => handleWithdrawal(50)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
                      >
                        <Euro className="mr-2" size={16} />
                        Retirer 50€
                      </button>
                      
                      <button 
                        onClick={() => setShowAddCard(true)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                      >
                        <Plus className="mr-2" size={16} />
                        Ajouter une carte
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Méthodes de paiement */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Méthodes de paiement disponibles</h2>
                  <button 
                    onClick={() => setShowAddCard(true)}
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center"
                  >
                    <Plus className="mr-2" size={16} />
                    Ajouter une carte
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = getPaymentIcon(method.id);
                    return (
                      <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Icon className="text-violet-600 mr-3" size={24} />
                            <div>
                              <h3 className="font-semibold">{method.name}</h3>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Frais:</span>
                            <span>{method.fees === 0 ? 'Gratuit' : `${method.fees}%`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Traitement:</span>
                            <span>{method.processingTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Cartes sauvegardées</h3>
                  <div className="space-y-3">
                    {savedCards.map((card) => (
                      <div key={card.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="text-gray-400 mr-3" size={24} />
                          <div>
                            <p className="font-semibold">
                              **** **** **** {card.last4}
                              {card.isDefault && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  Par défaut
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {card.brand.toUpperCase()} • Expire {card.expiryMonth}/{card.expiryYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => removePaymentMethod(card.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mes gains */}
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Gestion de mes gains</h2>
                  <button 
                    onClick={() => handleWithdrawal(earnings.availableBalance)}
                    disabled={earnings.availableBalance === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    <Euro className="mr-2" size={16} />
                    Tout retirer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Solde disponible</h3>
                    <p className="text-3xl font-bold">{earnings.availableBalance.toFixed(2)}€</p>
                    <p className="text-green-100 text-sm mt-2">Prêt à être retiré</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">En attente</h3>
                    <p className="text-3xl font-bold">{earnings.pendingEarnings.toFixed(2)}€</p>
                    <p className="text-yellow-100 text-sm mt-2">Traitement en cours</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Total des gains</h3>
                    <p className="text-3xl font-bold">{earnings.totalEarnings.toFixed(2)}€</p>
                    <p className="text-blue-100 text-sm mt-2">Depuis le début</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Retrait rapide</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[25, 50, 100, 200].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleWithdrawal(amount)}
                        disabled={earnings.availableBalance < amount}
                        className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-4 rounded-lg text-center font-semibold"
                      >
                        {amount}€
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comptes bancaires */}
            {activeTab === 'accounts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Mes comptes bancaires</h2>
                  <button 
                    onClick={() => setShowAddAccount(true)}
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center"
                  >
                    <Plus className="mr-2" size={16} />
                    Ajouter un compte
                  </button>
                </div>

                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building2 className="text-violet-600 mr-4" size={32} />
                          <div>
                            <h3 className="font-semibold text-lg">{account.bankName}</h3>
                            <p className="text-gray-600">IBAN: {account.iban}</p>
                            <p className="text-gray-600">Compte: {account.accountNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {account.verified ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                              <CheckCircle className="mr-1" size={14} />
                              Vérifié
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
                              <Clock className="mr-1" size={14} />
                              En attente
                            </span>
                          )}
                          {account.isDefault && (
                            <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm">
                              Par défaut
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historique */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Historique des transactions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Retraits</h3>
                    <div className="space-y-3">
                      {withdrawalHistory.map((withdrawal) => {
                        const StatusIcon = getStatusIcon(withdrawal.status);
                        return (
                          <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <StatusIcon className={`mr-3 ${getStatusColor(withdrawal.status)}`} size={20} />
                              <div>
                                <p className="font-semibold">{withdrawal.amount.toFixed(2)}€</p>
                                <p className="text-sm text-gray-600">{withdrawal.bankAccount}</p>
                                <p className="text-xs text-gray-500">
                                  {withdrawal.date.toLocaleDateString('fr-FR')} • {withdrawal.processingTime}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                              withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {withdrawal.status === 'completed' ? 'Terminé' :
                               withdrawal.status === 'pending' ? 'En cours' : 'Échoué'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Paiements reçus</h3>
                    <div className="space-y-3">
                      {paymentHistory.map((payment) => {
                        const StatusIcon = getStatusIcon(payment.status);
                        return (
                          <div key={payment.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <StatusIcon className={`mr-3 ${getStatusColor(payment.status)}`} size={20} />
                              <div>
                                <p className="font-semibold">{payment.amount.toFixed(2)}€</p>
                                <p className="text-sm text-gray-600">{payment.description}</p>
                                <p className="text-xs text-gray-500">
                                  {payment.date.toLocaleDateString('fr-FR')} • {payment.method}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status === 'completed' ? 'Terminé' :
                               payment.status === 'pending' ? 'En cours' : 'Échoué'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;


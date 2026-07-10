"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  totalAmount: number
  paymentMethod: 'card' | 'crypto'
  onPaymentComplete?: () => void
}

export function PaymentModal({ isOpen, onClose, onBack, totalAmount, paymentMethod, onPaymentComplete }: PaymentModalProps) {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'USDT' | 'ETH'>('BTC')
  const [cryptoAddress, setCryptoAddress] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const cryptoWallets = {
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    USDT: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    ETH: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  }

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      alert('Pago procesado exitosamente (simulado)')
      onPaymentComplete?.()
      onClose()
    }, 2000)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <button
            onClick={onBack}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            ← Volver a la confirmación
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground font-display">
              {paymentMethod === 'card' ? '💳 Pagar con Tarjeta' : '₿ Pagar con Cripto'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-3xl font-black text-[#FF6B00] font-display">
              ${totalAmount.toLocaleString()}
            </p>
            <p className="text-gray-600 text-sm">Total a pagar</p>
          </div>

          {paymentMethod === 'card' ? (
            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Número de Tarjeta</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Fecha de Expiración</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nombre del Titular</label>
                <input
                  type="text"
                  placeholder="JUAN PÉREZ"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#FF6B00] text-white font-bold py-4 rounded-lg hover:bg-[#E55A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Procesando...' : `Pagar $${totalAmount.toLocaleString()}`}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Seleccionar Criptomoneda</label>
                <div className="grid grid-cols-3 gap-4">
                  {/* Bitcoin */}
                  <div
                    onClick={() => {
                      setSelectedCrypto('BTC')
                      setCryptoAddress('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
                    }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                      selectedCrypto === 'BTC' ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-[#FF6B00]'
                    }`}
                  >
                    <div className="relative">
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5 z-10">
                        -20%
                      </div>
                      <img src="/crypto-logos/bitcoin.png" alt="Bitcoin" className="w-12 h-12 object-contain mb-2" />
                    </div>
                    <span className="font-semibold text-sm">Bitcoin</span>
                    <span className="text-xs text-gray-500">BTC</span>
                  </div>

                  {/* USDT */}
                  <div
                    onClick={() => {
                      setSelectedCrypto('USDT')
                      setCryptoAddress('TXLAQ63Xg1AQzXSSZzyczH7sVJqZk8Yk3R')
                    }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                      selectedCrypto === 'USDT' ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-[#FF6B00]'
                    }`}
                  >
                    <div className="relative">
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5 z-10">
                        -20%
                      </div>
                      <img src="/crypto-logos/usdt.png" alt="USDT" className="w-12 h-12 object-contain mb-2" />
                    </div>
                    <span className="font-semibold text-sm">Tether</span>
                    <span className="text-xs text-gray-500">USDT</span>
                  </div>

                  {/* Ethereum */}
                  <div
                    onClick={() => {
                      setSelectedCrypto('ETH')
                      setCryptoAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
                    }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                      selectedCrypto === 'ETH' ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-[#FF6B00]'
                    }`}
                  >
                    <div className="relative">
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5 z-10">
                        -20%
                      </div>
                      <img src="/crypto-logos/eth.png" alt="Ethereum" className="w-12 h-12 object-contain mb-2" />
                    </div>
                    <span className="font-semibold text-sm">Ethereum</span>
                    <span className="text-xs text-gray-500">ETH</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm font-semibold text-foreground mb-2">Dirección de Wallet ({selectedCrypto})</p>
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                  <code className="text-xs text-gray-600 flex-1 break-all">
                    {cryptoAddress}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(cryptoAddress)}
                    className="flex items-center gap-1 text-[#FF6B00] hover:text-[#E55A00] transition-colors"
                  >
                    {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-xs font-medium">
                      {copiedAddress ? 'Copiado' : 'Copiar'}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Envía exactamente ${totalAmount.toLocaleString()} en {selectedCrypto}</p>
              </div>

              <div className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-xl mx-auto flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">QR</span>
                    </div>
                    <p className="text-xs text-gray-600">Código QR (simulado)</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Importante:</strong> Una vez realizado el envío, envíanos el comprobante por WhatsApp para confirmar tu reserva.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  alert('Dirección copiada. Envía el comprobante por WhatsApp para confirmar.')
                  onPaymentComplete?.()
                  onClose()
                }}
                className="w-full bg-[#3DB54A] text-white font-bold py-4 rounded-lg hover:bg-[#2D8B3A] transition-colors"
              >
                Confirmar Dirección Copiada
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

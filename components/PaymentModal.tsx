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
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'USDT' | 'ETH' | 'BNB' | 'SOL'>('BTC')
  const [cryptoAddress, setCryptoAddress] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const cryptoWallets = {
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    USDT: 'TXLAQ63Xg1AQzXSSZzyczH7sVJqZk8Yk3R',
    ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    BNB: 'bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    SOL: '5x2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
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
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            ← Volver
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground font-display flex items-center gap-2">
              <span>₿</span> Pagar con Cripto
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
          {/* Total a pagar con descuento incluido */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#3DB54A]/10 px-4 py-1 rounded-full mb-2">
              <span className="text-[#3DB54A] font-bold text-sm">🔥 20% DESCUENTO</span>
            </div>
            <p className="text-3xl font-black text-[#FF6B00] font-display">
              ${totalAmount.toLocaleString()}
            </p>
            <p className="text-gray-600 text-sm">Total a pagar en criptomonedas</p>
          </div>

          <div className="space-y-6">
            {/* Selección de Criptomoneda */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Seleccionar Criptomoneda</label>
              <div className="grid grid-cols-5 gap-2">
                {/* Bitcoin */}
                <div
                  onClick={() => {
                    setSelectedCrypto('BTC')
                    setCryptoAddress(cryptoWallets.BTC)
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all relative ${
                    selectedCrypto === 'BTC' ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-[#FF6B00]'
                  }`}
                >
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 bg-[#3DB54A] text-white text-[10px] rounded-full px-1.5 py-0.5 z-10 font-bold">
                      -20%
                    </div>
                    <img src="/crypto-logos/bitcoin.png" alt="Bitcoin" className="w-8 h-8 object-contain mb-1" />
                  </div>
                  <span className="font-semibold text-[10px]">BTC</span>
                </div>

                {/* USDT */}
                <div
                  onClick={() => {
                    setSelectedCrypto('USDT')
                    setCryptoAddress(cryptoWallets.USDT)
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all relative ${
                    selectedCrypto === 'USDT' ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-[#FF6B00]'
                  }`}
                >
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 bg-[#3DB54A] text-white text-[10px] rounded-full px-1.5 py-0.5 z-10 font-bold">
                      -20%
                    </div>
                    <img src="/crypto-logos/usdt.png" alt="USDT" className="w-8 h-8 object-contain mb-1" />
                  </div>
                  <span className="font-semibold text-[10px]">USDT</span>
                </div>

                {/* Ethereum */}
                <div
                  onClick={() => {
                    setSelectedCrypto('ETH')
                    setCryptoAddress(cryptoWallets.ETH)
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all relative ${
                    selectedCrypto === 'ETH' ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-[#FF6B00]'
                  }`}
                >
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 bg-[#3DB54A] text-white text-[10px] rounded-full px-1.5 py-0.5 z-10 font-bold">
                      -20%
                    </div>
                    <img src="/crypto-logos/eth.png" alt="Ethereum" className="w-8 h-8 object-contain mb-1" />
                  </div>
                  <span className="font-semibold text-[10px]">ETH</span>
                </div>

                {/* BNB */}
                <div
                  onClick={() => {
                    setSelectedCrypto('BNB')
                    setCryptoAddress(cryptoWallets.BNB)
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all relative ${
                    selectedCrypto === 'BNB' ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-[#FF6B00]'
                  }`}
                >
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 bg-[#3DB54A] text-white text-[10px] rounded-full px-1.5 py-0.5 z-10 font-bold">
                      -20%
                    </div>
                    <img src="/crypto-logos/bnb.png" alt="BNB" className="w-8 h-8 object-contain mb-1" />
                  </div>
                  <span className="font-semibold text-[10px]">BNB</span>
                </div>

                {/* SOL */}
                <div
                  onClick={() => {
                    setSelectedCrypto('SOL')
                    setCryptoAddress(cryptoWallets.SOL)
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all relative ${
                    selectedCrypto === 'SOL' ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-[#FF6B00]'
                  }`}
                >
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 bg-[#3DB54A] text-white text-[10px] rounded-full px-1.5 py-0.5 z-10 font-bold">
                      -20%
                    </div>
                    <img src="/crypto-logos/sol.png" alt="SOL" className="w-8 h-8 object-contain mb-1" />
                  </div>
                  <span className="font-semibold text-[10px]">SOL</span>
                </div>
              </div>
            </div>

            {/* Dirección de Wallet */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                📋 Dirección de Wallet ({selectedCrypto})
              </p>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <code className="text-xs text-gray-600 flex-1 break-all">
                  {cryptoAddress}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(cryptoAddress)}
                  className="flex items-center gap-1 text-[#FF6B00] hover:text-[#E55A00] transition-colors shrink-0"
                >
                  {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-xs font-medium">
                    {copiedAddress ? 'Copiado' : 'Copiar'}
                  </span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💰 Envía <strong>${totalAmount.toLocaleString()} USD</strong> en {selectedCrypto}
              </p>
            </div>

            {/* QR Simulado */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-xl mx-auto flex items-center justify-center mb-2 border-2 border-gray-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-400 rounded-lg mx-auto mb-1 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">QR</span>
                  </div>
                  <p className="text-[10px] text-gray-500">Escanea con tu wallet</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Código QR simulado</p>
            </div>

            {/* Nota Importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Importante:</strong> Una vez realizado el envío, envía el comprobante por 
                <span className="font-semibold"> WhatsApp</span> para confirmar tu reserva.
              </p>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  alert(`✅ Dirección de ${selectedCrypto} copiada. Envía el comprobante por WhatsApp para confirmar.`)
                  onPaymentComplete?.()
                  onClose()
                }}
                className="w-full bg-[#3DB54A] text-white font-bold py-4 rounded-lg hover:bg-[#2D8B3A] transition-colors"
              >
                ✅ Confirmar Dirección Copiada
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open('https://t.me/NickResortOficial', '_blank')
                  }
                }}
                className="w-full bg-[#0088cc] text-white font-bold py-3 rounded-lg hover:bg-[#006699] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Enviar comprobante por Telegram
              </button>
            </div>

            {/* Badge de seguridad */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-400">
                🔒 Pagos seguros con criptomonedas · Sin custodia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
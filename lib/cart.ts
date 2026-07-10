export interface CartItem {
  leadId: string
  roomId: string
  roomName: string
  packageId: string
  packageName: string
  nights: number
  adults: number
  kids: number
  totalPrice: number
  priceBreakdown: any
  formData: {
    fullName: string
    email: string
    phone: string
    destination: string
    aeropuertoSalida: string
    arrivalDate: string
    departureDate: string
  }
  createdAt: string
  status: 'pending' | 'payment_started' | 'completed'
}

// Guardar en localStorage
export function saveCart(item: CartItem) {
  localStorage.setItem('nick_resorts_cart', JSON.stringify(item))
}

// Cargar del localStorage
export function loadCart(): CartItem | null {
  if (typeof window === 'undefined') return null
  const cart = localStorage.getItem('nick_resorts_cart')
  return cart ? JSON.parse(cart) : null
}

// Eliminar carrito
export function clearCart() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nick_resorts_cart')
  }
}

// Actualizar estado del carrito
export function updateCartStatus(status: CartItem['status']) {
  const cart = loadCart()
  if (cart) {
    cart.status = status
    saveCart(cart)
  }
}
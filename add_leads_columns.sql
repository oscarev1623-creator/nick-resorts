-- Script SQL para agregar las nuevas columnas a la tabla leads
-- Ejecutar en Neon Database Console o psql

ALTER TABLE leads ADD COLUMN IF NOT EXISTS selected_room TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS selected_package TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nights INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS price_breakdown JSONB;

-- Comentarios para explicar cada columna
COMMENT ON COLUMN leads.selected_room IS 'Habitación seleccionada (presidential, spongebob, paw-patrol, ocean-view)';
COMMENT ON COLUMN leads.selected_package IS 'Paquete seleccionado (todo-incluido, familiar, luna-miel, slime)';
COMMENT ON COLUMN leads.nights IS 'Número de noches de la reserva';
COMMENT ON COLUMN leads.total_price IS 'Precio total calculado de la reserva';
COMMENT ON COLUMN leads.payment_method IS 'Método de pago preferido (card, crypto)';
COMMENT ON COLUMN leads.price_breakdown IS 'Desglose completo de precios en formato JSON';
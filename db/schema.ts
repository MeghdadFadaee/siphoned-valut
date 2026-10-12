import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const transactions = sqliteTable('transactions', {
 id: text('id').primaryKey(), date: text('date').notNull(), player: text('player').notNull(), reason: text('reason').notNull(), amount: integer('amount').notNull(), importedAt: text('imported_at').notNull(), importedBy: text('imported_by').notNull(),
});

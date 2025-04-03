import { bigint, bigserial, index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';


export const tblLogs = pgTable('logs', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    saasId: varchar('saas_id', { length: 50 }),
    model: varchar('model', { length: 50 }),
    modelId: bigint('model_id', { mode: 'number' }),
    action: varchar('action', { enum: ['c', 'r', 'u', 'd'], length: 1 }),
    user: varchar('user'),
    description: varchar('description'),
    timestamp: timestamp('timestamp', { mode: 'date' }).defaultNow(),
}
    , (t) => {
        return [
            index('log_model_modelID').on(t.saasId, t.model, t.modelId),
        ]
    }
);


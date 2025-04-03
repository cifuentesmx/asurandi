import { sql } from "drizzle-orm";
import {
  index,
  unique,
  boolean,
  mysqlTable,
  serial,
  text,
  varchar,
  int,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const jobs = mysqlTable(
  "pdf_reader",
  {
    id: serial("id").primaryKey(),
    file_sha1: varchar("file_sha1", { length: 40 }).notNull(),
    file_name: varchar("file_name", { length: 250 }),
    full_file_name: varchar("full_file_name", { length: 250 }),
    intent: int("intent").default(0),
    data: text("data"),
    errors: text("errors"),
    incidents: text("incidents"),
    errored_at: timestamp("errored_at"),
    succeeded_at: timestamp("succeeded_at"),
    created_at: timestamp("created_at").default(sql`NOW()`),
    updated_at: timestamp("updated_at").default(sql`NOW()`),
    status: mysqlEnum("status", [
      "STALE",
      "WAITING_AGENT",
      "WAITING_CONDUCT",
      "WAITING_COMISSION",
      "WAITING_AVISO",
      "WAITING_SUBTOTAL",
      "PROCESSING",
      "ERROR",
      "SUCCESS",
      "WAITING_CLIENT_SELECTION",
      "PROCESS_CANCELACION",
      "CONFIRM_TOTAL_CANCEL",
    ]).default("STALE"),
    notified: boolean("notified"),
  },
  (t) => ({
    unq: unique("sha").on(t.file_sha1),
    idx: index("pdf_reader").on(t.notified, t.status),
  })
);

import { MySql2Client, drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export class NexusConnector {
  private connection: MySql2Client | null = null;
  public constructor() { }
  public async connect() {
    this.connection = await mysql.createConnection({
      host: process.env.NEXUS_HOST!,
      user: 'bull',
      database: 'portalne_dbnexus',
      password: process.env.NEXUS_PASSWORD!,
    });
    return drizzle(this.connection);
  }
  public async disconnect() {
    if (!this.connection) return;
    this.connection.end();
    this.connection = null;
  }
}

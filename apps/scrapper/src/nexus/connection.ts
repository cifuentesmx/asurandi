import { MySql2Client, drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { NEXUS_HOST, NEXUS_PASSWORD } from "../env.js";

export class NexusConnector {
  private connection: MySql2Client | null = null;
  public constructor() { }
  public async connect() {
    this.connection = await mysql.createConnection({
      host: NEXUS_HOST,
      user: 'bull',
      database: 'portalne_dbnexus',
      password: NEXUS_PASSWORD,
    });
    return drizzle(this.connection);
  }
  public async disconnect() {
    if (!this.connection) return;
    this.connection.end();
    this.connection = null;
  }
}

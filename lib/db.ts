import { Pool, PoolClient, QueryResult } from "pg";

declare global {
	// allow global singleton across module reloads in dev
	var __pg_pool__: Pool | undefined;
}

const pool =
	global.__pg_pool__ ??
	new Pool({
		connectionString: process.env.DATABASE_URL,
		max: parseInt(process.env.PG_MAX_POOL_SIZE ?? "10", 10),
		idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT ?? "30000", 10),
		connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT ?? "2000", 10),
	});

if (process.env.NODE_ENV !== "production") global.__pg_pool__ = pool;

pool.on("error", (err) => {
	console.error("Unexpected error on idle client", err);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T extends QueryResult = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
	try {
		const result = await pool.query<T>(text, params);
		console.log("Executed query", { text, rows: result.rowCount });
		return result;
	} catch (error) {
		console.error("Database query error", error);
		throw error;
	}
}

export async function getClient(): Promise<PoolClient> {
	return pool.connect();
}

export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
	const client = await getClient();
	try {
		await client.query("BEGIN");
		const result = await fn(client);
		await client.query("COMMIT");
		return result;
	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
}

export default pool;


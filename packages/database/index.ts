export interface DatabaseClientConfig {
  connectionString: string;
}

export class MockDatabaseClient {
  private connectionString: string;

  constructor(config: DatabaseClientConfig) {
    this.connectionString = config.connectionString;
  }

  public async connect(): Promise<boolean> {
    return true;
  }

  public async disconnect(): Promise<void> {
    return;
  }

  public getStatus() {
    return {
      connected: true,
      provider: "postgresql",
      target: this.connectionString,
    };
  }
}

export function createDatabaseClient(connectionString: string): MockDatabaseClient {
  return new MockDatabaseClient({ connectionString });
}

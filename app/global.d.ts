interface EthereumProvider {
  request: (request: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: () => void;
}

interface Window {
  ethereum?: EthereumProvider;
}

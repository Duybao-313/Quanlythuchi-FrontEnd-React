export const WalletType = {
  CASH: "CASH",
  BANK: "BANK",
  E_WALLET: "E_WALLET",
} as const;

export type WalletType = typeof WalletType[keyof typeof WalletType];
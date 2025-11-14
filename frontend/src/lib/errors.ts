/**
 * Error handling utilities for Somnia Data Streams
 * 
 * Provides standardized error messages and error handling functions
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  WALLET_ERROR = 'WALLET_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BLOCKCHAIN_ERROR = 'BLOCKCHAIN_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string;
}

/**
 * Parse error from various sources (Ethereum, network, etc.)
 */
export function parseError(error: any): AppError {
  // Network errors
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: 'Network connection error',
      details: error.message || 'Unable to connect to the blockchain network. Please check your internet connection.',
      code: error.code,
    };
  }

  // Wallet errors
  if (error?.code === 4001 || error?.message?.includes('User rejected') || error?.message?.includes('denied')) {
    return {
      type: ErrorType.WALLET_ERROR,
      message: 'Transaction rejected',
      details: 'You rejected the transaction in your wallet.',
    };
  }

  if (error?.code === -32002 || error?.message?.includes('already processing')) {
    return {
      type: ErrorType.WALLET_ERROR,
      message: 'Request already pending',
      details: 'Please check your wallet - a request is already pending.',
    };
  }

  // Insufficient funds
  if (error?.message?.includes('insufficient funds') || error?.code === 'INSUFFICIENT_FUNDS') {
    return {
      type: ErrorType.WALLET_ERROR,
      message: 'Insufficient funds',
      details: 'You do not have enough funds to complete this transaction. Please add more funds to your wallet.',
    };
  }

  // Validation errors
  if (error?.type === ErrorType.VALIDATION_ERROR) {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message: error.message || 'Validation error',
      details: error.details,
    };
  }

  // Blockchain errors
  if (error?.code === 'CALL_EXCEPTION' || error?.message?.includes('execution reverted')) {
    return {
      type: ErrorType.BLOCKCHAIN_ERROR,
      message: 'Transaction failed',
      details: error.reason || error.message || 'The transaction was reverted by the smart contract.',
    };
  }

  // Gas errors
  if (error?.message?.includes('gas') || error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
    return {
      type: ErrorType.BLOCKCHAIN_ERROR,
      message: 'Gas estimation failed',
      details: 'Unable to estimate gas for this transaction. Please try again or check the transaction details.',
    };
  }

  // Timeout errors
  if (error?.message?.includes('timeout') || error?.code === 'TIMEOUT') {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: 'Request timeout',
      details: 'The request took too long to complete. Please try again.',
    };
  }

  // Unknown error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: error?.message || 'An unexpected error occurred',
    details: error?.details || error?.stack || 'Please try again or contact support if the problem persists.',
    code: error?.code,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  const messages: Record<ErrorType, string> = {
    [ErrorType.NETWORK_ERROR]: 'Network Error',
    [ErrorType.WALLET_ERROR]: 'Wallet Error',
    [ErrorType.VALIDATION_ERROR]: 'Validation Error',
    [ErrorType.BLOCKCHAIN_ERROR]: 'Transaction Error',
    [ErrorType.UNKNOWN_ERROR]: 'Error',
  };

  return messages[error.type] || 'Error';
}

/**
 * Check if error is recoverable (user can retry)
 */
export function isRecoverableError(error: AppError): boolean {
  return error.type === ErrorType.NETWORK_ERROR || error.type === ErrorType.UNKNOWN_ERROR;
}

/**
 * Check if error is due to user action (don't show as critical)
 */
export function isUserActionError(error: AppError): boolean {
  return (
    error.type === ErrorType.WALLET_ERROR &&
    (error.message.includes('rejected') || error.message.includes('denied'))
  );
}


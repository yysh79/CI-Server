// src/utils/responseUtils.ts

export interface ServerResponse<T> {
    isSuccessful: boolean;
    displayMessage: string | null;
    description: string | null;
    exception: string | null;
    timestamp: string | null;
    data: T | null;
  }
  
  export const createServerResponse = <T>(
    isSuccessful: boolean,
    data: T | null,
    displayMessage: string | null = null,
    description: string | null = null,
    exception: string | null = null
  ): ServerResponse<T> => {
    return {
      isSuccessful,
      displayMessage,
      description,
      exception,
      timestamp: new Date().toISOString(),
      data,
    };
  };
  
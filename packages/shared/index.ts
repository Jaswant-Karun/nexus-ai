import type { ApiResponse } from "@nexus/types";

export class NexusError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code = "INTERNAL_ERROR", statusCode = 500) {
    super(message);
    this.name = "NexusError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends NexusError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AuthError extends NexusError {
  constructor(message = "Unauthorized access") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "AuthError";
  }
}

export class NotFoundError extends NexusError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export function generateId(prefix = "nexus"): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(message: string, code = "ERROR"): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date().toISOString(),
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

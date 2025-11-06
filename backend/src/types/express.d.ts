// Extend Express Request type to include our user property
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}


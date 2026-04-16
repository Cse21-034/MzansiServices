import bcryptjs from 'bcryptjs';

// Re-export the functions we need with proper types
export async function hash(s: string, salt: string | number): Promise<string> {
  return bcryptjs.hash(s, salt);
}

export async function compare(s: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(s, hash);
}

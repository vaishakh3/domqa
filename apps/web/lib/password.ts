import bcrypt from "bcryptjs";
export const hash = (value: string) => bcrypt.hashSync(value, 10);
export const verify = (value: string, passwordHash: string) => bcrypt.compareSync(value, passwordHash);

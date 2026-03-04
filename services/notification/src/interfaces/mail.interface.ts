import type { Mail, User } from "../../generated/prisma/client";

export interface IMailInterface {
  createMail(data: CreateMailPayload): Promise<Mail>;
  getMails(user: User, page: number, limit: number): Promise<Mail[]>;
  getMail(mailId: string): Promise<Mail | null>;
  updateMail(mailId: string, data: UpdateMailPayload): Promise<Mail>;
  deleteMail(mailId: string): Promise<Mail>;
}

export type CreateMailPayload = {
  title: string;
  subject: string;
  body: string;
  for: User;
};

export type UpdateMailPayload = Partial<CreateMailPayload>;
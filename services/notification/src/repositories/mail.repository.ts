import type { IMailInterface } from "../interfaces/mail.interface";
import { PrismaClient } from "@prisma/client/extension";
import type { Mail, User } from "../../generated/prisma/client";
import AppLogger from "../utils/logger";
import type { Logger } from "lovely-logs";
import { ValidationError, InvalidError } from "../types/errors";
import type {
  CreateMailPayload,
  UpdateMailPayload,
} from "../interfaces/mail.interface";

export class MailRepository implements IMailInterface {
  private prisma: PrismaClient;
  private logger: Logger;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = AppLogger.getInstance();
  }

  private handleError(error: unknown, context: string): never {
    if (error instanceof ValidationError || error instanceof InvalidError) {
      this.logger.error(`[repo] ${context}: ${error.message}`);
      throw error;
    }

    if (error instanceof Error) {
      this.logger.error(`[repo] ${context}: ${error.message}`);
      throw new Error(`Error during ${context}: ${error.message}`);
    }

    this.logger.error(`[repo] ${context}: Unknown error`);
    throw new Error(`Unknown error during ${context}`);
  }

  async createMail(data: CreateMailPayload): Promise<Mail> {
    this.logger.info(`[repo] createMail called`);
    try {
      const { title, subject, body, for: userType } = data;

      if (!title || !subject || !body || !userType) {
        throw new ValidationError(
          "title, subject, body and for fields are required."
        );
      }

      const newMail = await this.prisma.mail.create({ data });

      this.logger.success(
        `[repo] Mail created successfully with id: ${newMail.id}`
      );

      return newMail;
    } catch (error) {
      this.handleError(error, "createMail");
    }
  }

  async getMails(user: User, page: number, limit: number): Promise<Mail[]> {
    this.logger.info(
      `[repo] getMails called with user: ${user}, page: ${page}, limit: ${limit}`
    );

    try {
      if (!user) throw new InvalidError("User cannot be empty.");
      if (page <= 0 || limit <= 0)
        throw new InvalidError("Page and limit must be greater than 0.");

      const skip = (page - 1) * limit;

      const mails = await this.prisma.mail.findMany({
        where: { for: user },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      this.logger.success(
        `[repo] Mails retrieved successfully for user: ${user}`
      );

      return mails;
    } catch (error) {
      this.handleError(error, "getMails");
    }
  }

  async getMail(mailId: string): Promise<Mail | null> {
    this.logger.info(`[repo] getMail called with id: ${mailId}`);

    try {
      if (!mailId) throw new InvalidError("mailId cannot be empty.");

      const mail = await this.prisma.mail.findUnique({
        where: { id: mailId },
      });

      return mail;
    } catch (error) {
      this.handleError(error, "getMail");
    }
  }

  async updateMail(mailId: string, data: UpdateMailPayload): Promise<Mail> {
    this.logger.info(`[repo] updateMail called with id: ${mailId}`);

    try {
      if (!mailId) throw new InvalidError("mailId cannot be empty.");

      const mailExists = await this.prisma.mail.findUnique({
        where: { id: mailId },
      });

      if (!mailExists) {
        throw new InvalidError("Mail not found.");
      }

      const updatedMail = await this.prisma.mail.update({
        where: { id: mailId },
        data,
      });

      this.logger.success(
        `[repo] Mail updated successfully with id: ${updatedMail.id}`
      );

      return updatedMail;
    } catch (error) {
      this.handleError(error, "updateMail");
    }
  }

  async deleteMail(mailId: string): Promise<Mail> {
    this.logger.info(`[repo] deleteMail called with id: ${mailId}`);

    try {
      if (!mailId) throw new InvalidError("mailId cannot be empty.");

      const mailExists = await this.prisma.mail.findUnique({
        where: { id: mailId },
      });

      if (!mailExists) {
        throw new InvalidError(`Mail with ${mailId} was not found`);
      }

      const deletedMail = await this.prisma.mail.delete({
        where: { id: mailId },
      });

      this.logger.success(
        `[repo] Mail deleted successfully with id: ${deletedMail.id}`
      );

      return deletedMail;
    } catch (error) {
      this.handleError(error, "deleteMail");
    }
  }
}

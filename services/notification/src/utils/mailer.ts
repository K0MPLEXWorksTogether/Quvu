import nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

class Mailer {
  private static instance: Transporter
  private constructor() { }
  public static getInstance() {
    if (!this.instance) {
      this.instance = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.MAIL_SERVICE_USER,
          pass: process.env.MAIL_SERVICE_PASS
        }
      })
    }

    return this.instance
  }
}

export default Mailer;
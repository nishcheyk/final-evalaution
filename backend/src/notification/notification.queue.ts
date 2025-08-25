import Bull from "bull";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Notification Bull queue instance for managing email jobs.
 * Connects to Redis on localhost:6379 by default.
 */
const notificationQueue = new Bull("notificationQueue", {
  redis: { host: "localhost", port: 6379 },
});

/**
 * Nodemailer transporter configured to send emails via Gmail service.
 * Auth credentials taken from environment variables EMAIL_USER and EMAIL_PASS.
 */
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Queue event listeners for logging and monitoring job lifecycle
notificationQueue.on("waiting", () => console.log("Job added to queue"));
notificationQueue.on("active", (job) =>
  console.log(`Processing job ${job.id} type: ${job.data.type}`)
);
notificationQueue.on("completed", (job) =>
  console.log(`Job ${job.id} type: ${job.data.type} completed`)
);
notificationQueue.on("failed", (job, err) =>
  console.error(`Job ${job?.id} failed with error:`, err)
);
notificationQueue.on("stalled", (job) =>
  console.warn(`Job ${job.id} stalled and will retry`)
);

/**
 * Process jobs in the notification queue.
 * Supports the following job types:
 *  - paymentReminder: Sends a payment reminder email
 *  - paymentSuccess: Sends a payment success confirmation email
 *  - paymentFailure: Sends a payment failure notification email
 *
 * @param {Bull.Job} job - Bull job object containing type and email data
 */
notificationQueue.process(async (job) => {
  const { type, data } = job.data;

  /**
   * Helper function to send an email with the provided options.
   *
   * @param {Object} mailOptions - Nodemailer mail options
   * @param {string} email - Recipient's email address (for logging)
   * @param {string} label - Description label for logging
   */
  async function sendMail(mailOptions: any, email: string, label: string) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`${label} email sent to ${email}`);
    } catch (err) {
      console.error(`Failed to send ${label} email to ${email}:`, err);
      throw err;
    }
  }

  if (type === "paymentReminder") {
    const { email, userName, planName, amount } = data;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Upcoming Payment Reminder",
      text: `Dear ${userName},\n\nThis is a reminder that your next payment of $${(amount / 100).toFixed(2)} for plan "${planName}" will be deducted tomorrow.\n\nThank you!`,
    };
    await sendMail(mailOptions, email, "payment reminder");
  } else if (type === "paymentSuccess") {
    const { email, userName, planName, amount } = data;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Successful",
      text: `Dear ${userName},\n\nYour payment of $${(amount / 100).toFixed(2)} for plan "${planName}" has been successfully processed.\n\nThank you!`,
    };
    await sendMail(mailOptions, email, "payment success");
  } else if (type === "paymentFailure") {
    const { email, userName, planName, amount } = data;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Failed",
      text: `Dear ${userName},\n\nWe were unable to process your payment of $${(amount / 100).toFixed(2)} for plan "${planName}". Please update your payment information.\n\nThank you!`,
    };
    await sendMail(mailOptions, email, "payment failure");
  }
});

export default notificationQueue;

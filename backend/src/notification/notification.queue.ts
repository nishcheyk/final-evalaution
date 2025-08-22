import Bull from "bull";
import nodemailer from "nodemailer";

const notificationQueue = new Bull("notificationQueue", {
  redis: { host: "localhost", port: 6379 },
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface JobStats {
  total: number;
  completed: number;
  failed: number;
}

const jobStats: JobStats = {
  total: 0,
  completed: 0,
  failed: 0,
};

// Track stats on queue events
notificationQueue.on("waiting", () => {
  jobStats.total += 1;
});
notificationQueue.on("completed", () => {
  jobStats.completed += 1;
});
notificationQueue.on("failed", () => {
  jobStats.failed += 1;
});

notificationQueue.process(async (job) => {
  const { type, data } = job.data;

  if (type === "paymentReminder") {
    // existing paymentReminder email code here
  } else if (type === "paymentSuccess") {
    const { email, userName, planName, amount } = data;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Successful",
      text: `Dear ${userName},\n\nYour payment of $${(amount / 100).toFixed(2)} for plan "${planName}" has been successfully processed.\n\nThank you!`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Payment success email sent to ${email}`);
    } catch (err) {
      console.error(`Failed to send payment success email to ${email}:`, err);
    }
  } else if (type === "paymentFailure") {
    const { email, userName, planName, amount } = data;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Failed",
      text: `Dear ${userName},\n\nWe were unable to process your payment of $${(amount / 100).toFixed(2)} for plan "${planName}". Please update your payment information.\n\nThank you!`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Payment failure email sent to ${email}`);
    } catch (err) {
      console.error(`Failed to send payment failure email to ${email}:`, err);
    }
  }
});

export function getJobStats() {
  return jobStats;
}

export default notificationQueue;

import nodemailer from "nodemailer";

// Membuat transport nodemailer menggunakan akun Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Pastikan ini ada di file .env Anda
    pass: process.env.GMAIL_PASS, // Gunakan App Password jika menggunakan 2FA
  },
});

// Fungsi untuk mengirim email
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  attachments?: any // Optional, jika Anda ingin menambahkan lampiran seperti PDF
) => {
  const mailOptions = {
    from: process.env.GMAIL_USER, // Alamat email pengirim
    to, // Email penerima
    subject, // Subjek email
    text, // Isi teks email
    attachments, // Lampiran (opsional)
  };

  // Mengirim email
  return transporter.sendMail(mailOptions);
};

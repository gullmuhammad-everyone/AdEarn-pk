import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let whatsappClient: Client | null = null;

export const setupWhatsApp = () => {
  whatsappClient = new Client({
    authStrategy: new LocalAuth({
      clientId: "adearn-pk-client"
    }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
  });

  whatsappClient.on('qr', (qr) => {
    console.log('\n📱 WHATSAPP AUTHENTICATION REQUIRED');
    console.log('=================================');
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code above with WhatsApp → Linked Devices');
    console.log('=================================\n');
  });

  whatsappClient.on('ready', () => {
    console.log('✅ WhatsApp client is ready and authenticated!');
  });

  whatsappClient.on('authenticated', () => {
    console.log('✅ WhatsApp authentication successful!');
  });

  whatsappClient.on('auth_failure', (error) => {
    console.error('❌ WhatsApp authentication failed:', error);
  });

  whatsappClient.on('disconnected', (reason) => {
    console.log('❌ WhatsApp client disconnected:', reason);
    console.log('Reinitializing...');
    setTimeout(() => {
      whatsappClient?.initialize();
    }, 5000);
  });

  whatsappClient.initialize();
};

export const sendWhatsAppMessage = async (phone: string, message: string): Promise<boolean> => {
  try {
    if (!whatsappClient) {
      console.error('WhatsApp client not initialized');
      return false;
    }

    const chatId = phone.includes('@c.us') ? phone : `${phone}@c.us`;
    await whatsappClient.sendMessage(chatId, message);
    console.log(`✅ WhatsApp message sent to ${phone}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message:', error);
    return false;
  }
};

export const sendRegistrationMessage = async (phone: string, name: string): Promise<boolean> => {
  const message = `🎉 As-salamu alaykum ${name}!\n\nWelcome to AdEarn.pk! Your registration is successful. 🎊\n\nPlease complete your payment to start earning money by watching ads.\n\n📱 Daily Ads\n💰 Guaranteed Earnings\n🎯 Halal Income\n\nThank you for joining AdEarn.pk family!`;
  return sendWhatsAppMessage(phone, message);
};

export const sendApprovalMessage = async (phone: string, name: string, packageType: string): Promise<boolean> => {
  const message = `✅ Mubarak ho ${name}!\n\nYour ${packageType.toUpperCase()} package has been approved! 🎉\n\nYou can now start watching ads and earn money daily.\n\nLogin to your dashboard and start earning:\nhttps://adearn.pk/dashboard\n\nHappy earning! 💰`;
  return sendWhatsAppMessage(phone, message);
};

export const sendPayoutMessage = async (phone: string, name: string, amount: number): Promise<boolean> => {
  const message = `💰 Payment Alert!\n\nDear ${name}, your withdrawal of ₹${amount} has been processed and sent to your account. ✅\n\nCheck your JazzCash/EasyPaisa account.\n\nThank you for using AdEarn.pk!`;
  return sendWhatsAppMessage(phone, message);
};

export const sendDailyReminder = async (phone: string, name: string, adsLeft: number): Promise<boolean> => {
  const message = `📢 Daily Reminder!\n\nAs-salamu alaykum ${name},\n\nYou have ${adsLeft} ads remaining to watch today. Don't miss your daily earnings! 💰\n\nLogin now: https://adearn.pk/dashboard`;
  return sendWhatsAppMessage(phone, message);
};
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateTOTPSecret = (email: string) => {
  return speakeasy.generateSecret({
    name: `AdEarn.pk (${email})`,
    issuer: 'AdEarn.pk',
  });
};

export const verifyTOTP = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
};

export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  return await QRCode.toDataURL(otpauthUrl);
};
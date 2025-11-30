export const calculateEarnings = (packageType: string): { dailyAds: number, monthlyEarnings: number } => {
  switch (packageType) {
    case 'silver':
      return { dailyAds: 40, monthlyEarnings: 3000 };
    case 'gold':
      return { dailyAds: 80, monthlyEarnings: 6000 };
    case 'platinum':
      return { dailyAds: 120, monthlyEarnings: 9000 };
    default:
      return { dailyAds: 0, monthlyEarnings: 0 };
  }
};

export const generateReferralCode = (userId: string): string => {
  return `ADEARN${userId.slice(0, 8).toUpperCase()}`;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-PK')}`;
};

export const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};
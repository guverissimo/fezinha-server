export interface SubscriptionNotificationDTO {
  endpoint: string;
  expirationTime?: any;
  keys: {
    p256dh: string;
    auth: string;
  };
}

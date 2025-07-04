/** @format */

export enum USER_ROLES {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DOORKEEPER = 'doorkeeper',
}

export enum PLAN_STATUS {
  ACTIVE = 'active',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export enum SUBSCRIPTION_PLAN_TYPES {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum NOTIFICATION_TYPES {
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  BOTH = 'both',
}

export enum SUBSCRIPTION_REQUEST_TYPES {
  RENEWAL = 'renewal',
  UPGRADE = 'upgrade',
  NEW = 'new',
}

export enum SUBSCRIPTION_REQUEST_STATUS {
  ACTIVE = 'active',
  PENDING = 'pending',
  EXPIRED = 'expired',
}
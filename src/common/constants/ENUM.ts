/** @format */

export enum USER_ROLES {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DOORKEEPER = 'doorkeeper',
}

export enum PLAN_CANCELLATION_STATUS {
  APPLIED = 'applied',
  CANCELLED = 'cancelled',
}
export enum PLAN_STATUS {
  ACTIVE = 'active',
  PENDING = 'pending',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum SUBSCRIPTION_PLAN_TYPES {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum NOTIFICATION_TYPES {
  WHATSAPP = 'sms',
  EMAIL = 'email',
  BOTH = 'both',
  NO_NOTIFICATION = 'no notification',
}

export enum NOTIFICATION_STATUS {
  NOTIFIED = 'notified',
  PENDING = 'pending',
}

export enum PARCEL_TYPE {
  COLLECTED = 'collected',
  NOT_COLLECTED = 'not collected',
  UNASSIGNED = 'unassigned',
}

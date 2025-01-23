import { ResourceType } from 'puppeteer';

export const DEFAULT_BROWSER_OPTIONS_ARGS = [
  '--incognito',
  '--no-sandbox',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-default-apps',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-print-preview',
  '--disable-popup-blocking',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-zygote',
  '--password-store=basic',
  '--use-mock-keychain',
  '--lang=ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,da;q=0.5,zh-CN;q=0.4,zh;q=0.3',
];

export const TYPES_TO_BLOCK: ResourceType[] = [
  'image',
  'media',
  'other',
  'font',
  'stylesheet',
];

export enum PAGE_PURPOSE {
  REALTIME_SHORT_INTEREST = 0,
  INVESTORS_NEWS = 1,
}

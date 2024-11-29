import { Snowflake } from 'discord.js';

export interface ConfigInterface {
    'discord-token': string;
    'store-details': StoreDetails[];
}

interface StoreDetails {
    'store-name': string;
    'store-name-short': string;
    'store-url': string;
    'discord-information': DiscordInformation[];
    'currency-symbol': string;
    'enable-cart': boolean;
    'enable-buy-now': boolean;
    interval: number;
    'mass-ping-limit'?: number;
}

interface DiscordInformation {
    'channel-id': Snowflake;
    'role-id': Snowflake;
}

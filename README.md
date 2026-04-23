# MerchBot

A Discord bot that monitors Shopify stores and pings your community when products are refreshed or restocked!

## Features

- **Real-time Monitoring** — Polls Shopify stores at configurable intervals to detect product changes
- **Discord Notifications** — Sends embeds with product details to specified channels with role mentions
- **Shopping Cart** — Users can add items to a cart and checkout in one click via Discord buttons
- **Buy Now** — Quick purchase links directly in Discord
- **Multi-Store Support** — Monitor multiple Shopify stores from a single bot instance
- **Mass Ping Protection** — Configurable limit to prevent spam when many items refresh at once
- **Error Webhooks** — Receive error notifications via Discord webhooks

## Prerequisites

- [Node.js](https://nodejs.org/) 24.x
- A [Discord Application](https://discord.com/developers/applications) with a Bot Token
- At least one Shopify store to monitor

## Quick Start

```bash
# Install dependencies
npm install

# Configure the bot
cp example.config.json config.json
# Edit config.json with your settings

# Start the bot
npm run start
```

## Configuration

Edit `config.json` with your settings:

```json
{
  "discord-token": "YOUR_BOT_TOKEN",
  "store-details": [
    {
      "store-name": "Store Name",
      "store-name-short": "storeShortName",
      "store-url": "https://your-store.myshopify.com",
      "discord-information": [
        {
          "channel-id": "123456789012345678",
          "role-id": "123456789012345678"
        }
      ],
      "currency-symbol": "$",
      "enable-cart": true,
      "enable-buy-now": true,
      "interval": 10000,
      "mass-ping-limit": 10,
      "webhook-url": ""
    }
  ]
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `discord-token` | string | Your Discord bot token |
| `store-name` | string | Full name of the Shopify store |
| `store-name-short` | string | Short identifier (camelCase recommended) |
| `store-url` | string | Base URL of the Shopify store |
| `channel-id` | string | Discord channel ID to post updates |
| `role-id` | string | Discord role ID to ping on updates |
| `currency-symbol` | string | Currency symbol (£, $, €, etc.) |
| `enable-cart` | boolean | Enable cart functionality |
| `enable-buy-now` | boolean | Enable buy now buttons |
| `interval` | number | Polling interval in milliseconds |
| `mass-ping-limit` | number | Max items to ping at once (prevents spam) |
| `webhook-url` | string | Discord webhook for error notifications |

## Bot Commands

The bot responds to button interactions in Discord:

- **Add to Cart** — Click the cart button to add an item
- **View Cart** — Click to get a direct link to your cart
- **Clear Cart** — Remove all items from your cart
- **Buy Now** — Direct link to purchase the item

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript |
| `npm run start` | Build and run the bot |
| `npm run watch` | Watch mode for development |
| `npm run lint` | Lint the code |
| `npm run lint:fix` | Auto-fix linting issues |

## Tech Stack

- [Discord.js](https://discord.js.org/) — Discord API library
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [cron-schedule](https://www.npmjs.com/package/cron-schedule) — Cron job scheduling

## License

[GNU GPLv3](LICENSE)

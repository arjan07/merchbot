import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Snowflake,
} from 'discord.js';
import { parseCronExpression } from 'cron-schedule';
import { TimerBasedCronScheduler } from 'cron-schedule/schedulers/timer-based.js';
import ShopifyStore from './ShopifyStore.js';
import { isJSON, loadJSON } from './utilities.js';
import { ConfigInterface } from './interface/configInterface.js';
const config = (await loadJSON('../config.json')) as ConfigInterface;

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

const details = config['store-details'];
const stores = details.map(
    (details) =>
        new ShopifyStore(
            client,
            details['store-name'],
            details['store-name-short'],
            details['store-url'],
            details['discord-information'],
            details['currency-symbol'],
            details['enable-cart'],
            details['enable-buy-now'],
            details['interval'],
        ),
);

const cartCache = new Collection<
    Snowflake,
    { [storeName: string]: number[] } | null
>();

const enableStores = (stores: ShopifyStore[]) => {
    const disabledStores = stores.filter((store) => !store.isReady());
    disabledStores.filter((store) =>
        setTimeout(() => store.enableStore(), 10000),
    );
};

client.once(Events.ClientReady, () => {
    console.log('Bot Online');
    stores.forEach((store) => store.cache());
});

client.on(Events.ClientReady, async () => {
    TimerBasedCronScheduler.setInterval(
        parseCronExpression('*/30 * * * *'),
        () => cartCache.clear(),
    );
    TimerBasedCronScheduler.setInterval(
        parseCronExpression('*/2 * * * *'),
        () => enableStores(stores),
    );
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;
    const customId = interaction.customId;
    if (!isJSON(customId)) return;
    const productDetails = JSON.parse(customId);

    const userCart = cartCache.get(interaction.user.id);
    if (!userCart) cartCache.set(interaction.user.id, null);
    const currentStoreCart = userCart?.[productDetails.store] ?? [];

    if (productDetails.action === 'add') {
        cartCache.set(interaction.user.id, {
            ...userCart,
            [productDetails.store]: [...currentStoreCart, productDetails.id],
        });
        interaction.reply({
            content: 'Item added to your cart!',
            ephemeral: true,
        });
    } else if (productDetails.action === 'get') {
        if (currentStoreCart.length === 0) {
            interaction.reply({
                content: 'You have nothing in your cart for this store!',
                ephemeral: true,
            });
            return;
        }
        const url = currentStoreCart
            .map((variantId) => `${variantId}:1`)
            .join(',');
        interaction.reply({
            content: `[Press here to go to your cart!](<${productDetails.url}/cart/${url}>)`,
            ephemeral: true,
        });
    } else if (productDetails.action === 'clear') {
        delete userCart?.[productDetails.store];
        cartCache.set(interaction.user.id, { ...userCart });
        interaction.reply({
            content: `Your cart has been cleared.`,
            ephemeral: true,
        });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    const customId = interaction.customId;
    if (!isJSON(customId)) return;
    const details = JSON.parse(customId);

    if (details.action !== 'add') return;

    const userCart = cartCache.get(interaction.user.id);
    if (!userCart) cartCache.set(interaction.user.id, null);
    const currentStoreCart = userCart?.[details.store] ?? [];

    cartCache.set(interaction.user.id, {
        ...userCart,
        [details.store]: [...currentStoreCart, ...interaction.values],
    });

    const multipleItems = interaction.values.length > 1;
    const content = `${interaction.values.length} ${
        multipleItems ? 'items have' : 'item has'
    } been added to your cart!`;

    interaction.reply({ content: content, ephemeral: true });
});

await client.login(config['discord-token']);

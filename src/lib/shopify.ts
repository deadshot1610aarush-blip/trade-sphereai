import { toast } from "sonner";

// ============= Shopify Storefront API setup =============

export const SHOPIFY_API_VERSION = "2026-10";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "trade-sphereai-wwtcg-kh0h3htd.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "db946f21c3089e87df9850f7b0d146d5";

// ============= Types =============

export type ShopifyMoney = { amount: string; currencyCode: string };

export type ShopifyVariant = {
  id: string;
  title: string;
  price: ShopifyMoney;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
};

export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  tags: string[];
  productType: string;
  priceRange: { minVariantPrice: ShopifyMoney };
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: { edges: { node: ShopifyVariant }[] };
};

export function productImage(product: ShopifyProduct, index = 0): string {
  const node = product.images.edges[index]?.node;
  return node?.url ?? FALLBACK_IMAGE;
}

export function productPrice(product: ShopifyProduct): ShopifyMoney {
  return product.priceRange.minVariantPrice;
}

export function formatMoney(money: ShopifyMoney): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: money.currencyCode === "INR" ? 0 : 2,
  }).format(Number(money.amount));
}

// Neutral placeholder for products without a photo (matches listing placeholder style).
const PLACEHOLDER_SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'>",
  "<rect width='800' height='800' fill='#eef1ee'/>",
  "<g fill='none' stroke='#8b948b' stroke-width='14' stroke-linecap='round' stroke-linejoin='round'>",
  "<rect x='300' y='330' width='200' height='160' rx='24'/>",
  "<path d='M340 330l24-40h72l24 40'/>",
  "<circle cx='400' cy='410' r='44'/>",
  "</g></svg>",
].join("");
export const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(PLACEHOLDER_SVG)}`;

// ============= API helper =============

async function storefrontApiRequest<T = unknown>(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access needs an active billing plan on the store.",
    });
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`Shopify HTTP error: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }

  return data as T;
}

// ============= Product queries =============

const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  vendor
  tags
  productType
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 10) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        availableForSale
        selectedOptions { name value }
      }
    }
  }
`;

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export async function fetchShopifyProducts(first = 24, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first, query: query ?? null });
  const edges = (data as { data?: { products?: { edges?: { node: ShopifyProduct }[] } } })?.data?.products?.edges;
  return (edges ?? []).map((e) => e.node);
}

export async function fetchShopifyProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  const product = (data as { data?: { product?: ShopifyProduct | null } })?.data?.product;
  return product ?? null;
}

// ============= Cart management (Storefront API) =============

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

type CartUserError = { field: string[] | null; message: string };

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store"); // Required for checkout without password
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: CartUserError[]): boolean {
  return userErrors.some(
    (e) => e.message.toLowerCase().includes("cart not found") || e.message.toLowerCase().includes("does not exist"),
  );
}

export async function createShopifyCart(item: {
  variantId: string;
  quantity: number;
}): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });

  const result = (data as {
    data?: {
      cartCreate?: {
        cart?: { id: string; checkoutUrl?: string; lines?: { edges?: { node: { id: string } }[] } } | null;
        userErrors?: CartUserError[];
      };
    };
  })?.data?.cartCreate;

  if (result?.userErrors?.length) {
    console.error("Cart creation failed:", result.userErrors);
    return null;
  }

  const cart = result?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines?.edges?.[0]?.node?.id;
  if (!lineId) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: { variantId: string; quantity: number },
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });

  const result = (data as {
    data?: {
      cartLinesAdd?: {
        cart?: { lines?: { edges?: { node: { id: string; merchandise: { id: string } } }[] } } | null;
        userErrors?: CartUserError[];
      };
    };
  })?.data?.cartLinesAdd;

  const userErrors = result?.userErrors ?? [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Add line failed:", userErrors);
    return { success: false };
  }

  const lines = result?.cart?.lines?.edges ?? [];
  const newLine = lines.find((l) => l.node.merchandise.id === item.variantId);
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors =
    (data as { data?: { cartLinesUpdate?: { userErrors?: CartUserError[] } } })?.data?.cartLinesUpdate?.userErrors ??
    [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Update line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors =
    (data as { data?: { cartLinesRemove?: { userErrors?: CartUserError[] } } })?.data?.cartLinesRemove?.userErrors ??
    [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Remove line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function checkCartExists(cartId: string): Promise<boolean> {
  const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
  const cart = (data as { data?: { cart?: { id: string; totalQuantity: number } | null } })?.data?.cart;
  return Boolean(cart && cart.totalQuantity > 0);
}

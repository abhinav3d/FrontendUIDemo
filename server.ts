import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createRequestHandler, createHydrogenContext } from '@shopify/hydrogen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==================================================================
  // 🛍️ Shopify Mock Routes (Target 1: Auth)
  // ==================================================================

  /**
   * Mutation: customerAccessTokenCreate
   * Mocks the creation of a Shopify customer access token.
   */
  app.post("/api/mock/shopify/auth/token", (req, res) => {
    console.log("[Shopify Mock] Mutation: customerAccessTokenCreate", req.body);
    
    // Standard GraphQL response envelope
    res.json({
      data: {
        customerAccessTokenCreate: {
          customerAccessToken: {
            accessToken: "mock_token_123",
            expiresAt: "2027-01-01T00:00:00Z"
          },
          customerUserErrors: []
        }
      }
    });
  });

  /**
   * Query: getCustomer
   * Mocks fetching the authenticated customer data.
   */
  app.post("/api/mock/shopify/auth/customer", (req, res) => {
    console.log("[Shopify Mock] Query: getCustomer", req.headers);
    
    const token = req.headers['x-shopify-customer-access-token'];
    
    if (!token || token !== 'mock_token_123') {
      return res.status(401).json({
        errors: [{ message: "Unauthenticated customer" }]
      });
    }

    // Standard GraphQL response envelope
    res.json({
      data: {
        customer: {
          id: "gid://shopify/Customer/99999999",
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          phone: null
        }
      }
    });
  });

  // ==================================================================
  // 🛍️ Shopify Mock Routes (Target 2: Pricing)
  // ==================================================================

  /**
   * Query: getProductPrice
   * Mocks fetching product pricing with regional context.
   */
  app.post("/api/mock/shopify/product/price", (req, res) => {
    console.log("[Shopify Mock] Query: getProductPrice", req.body);
    
    const { variables } = req.body;
    const country = variables?.country || "US";
    const handle = variables?.handle || "default-handle";

    let amount = "49.99";
    let currencyCode = "USD";

    if (country === "IN") {
      amount = "4100.00";
      currencyCode = "INR";
    }

    // Standard GraphQL response envelope
    res.json({
      data: {
        product: {
          id: "gid://shopify/Product/111222",
          title: `Mock Product (${handle})`,
          variants: {
            edges: [
              {
                node: {
                  id: "gid://shopify/ProductVariant/333444",
                  price: {
                    amount: amount,
                    currencyCode: currencyCode
                  },
                  compareAtPrice: {
                    amount: (parseFloat(amount) * 1.2).toFixed(2),
                    currencyCode: currencyCode
                  }
                }
              }
            ]
          }
        }
      }
    });
  });

  // ==================================================================
  // 🛍️ Shopify Mock Routes (Target 3: Discounts)
  // ==================================================================

  /**
   * Mutation: cartDiscountCodesUpdate
   * Mocks applying or removing discount codes from a cart.
   */
  app.post("/api/mock/shopify/cart/discount", (req, res) => {
    console.log("[Shopify Mock] Mutation: cartDiscountCodesUpdate", req.body);
    
    const { variables } = req.body;
    const discountCodes = variables?.discountCodes || [];
    const cartId = variables?.cartId || "gid://shopify/Cart/555666";

    let amount = "49.99";
    let appliedCodes: { code: string; applicable: boolean }[] = [];
    let userErrors: { field: string[]; message: string }[] = [];

    if (discountCodes.length === 0) {
      // Cancellation case
      amount = "49.99";
      appliedCodes = [];
    } else if (discountCodes.includes("SUMMER20")) {
      // Success case
      amount = "39.99";
      appliedCodes = [{ code: "SUMMER20", applicable: true }];
    } else {
      // Invalid code case
      amount = "49.99";
      appliedCodes = [];
      userErrors = [{
        field: ["discountCodes"],
        message: "Discount code is invalid."
      }];
    }

    // Standard GraphQL response envelope
    res.json({
      data: {
        cartDiscountCodesUpdate: {
          cart: {
            id: cartId,
            discountCodes: appliedCodes,
            cost: {
              totalAmount: {
                amount: amount,
                currencyCode: "USD"
              }
            }
          },
          userErrors: userErrors
        }
      }
    });
  });

  // ==================================================================
  // 🛍️ Shopify Mock Routes (Target 4: Cart Creation)
  // ==================================================================

  /**
   * Mutation: cartCreate
   * Mocks the creation of a cart with custom attributes and checkout URL.
   */
  app.post("/api/mock/shopify/cart/create", (req, res) => {
    console.log("[Shopify Mock] Mutation: cartCreate", req.body);
    
    const { variables } = req.body;
    const input = variables?.input || {};
    const lines = input.lines || [];
    const attributes = input.attributes || [];

    // Standard GraphQL response envelope
    res.json({
      data: {
        cartCreate: {
          cart: {
            id: "gid://shopify/Cart/555666",
            checkoutUrl: "https://mock.shop/checkout/555666",
            attributes: attributes,
            lines: {
              edges: lines.map((line: any, index: number) => ({
                node: {
                  id: `gid://shopify/CartLine/${index}`,
                  quantity: line.quantity,
                  merchandise: {
                    id: line.merchandiseId || "gid://shopify/ProductVariant/333444",
                    product: {
                      title: "Standard Resin 3D Print"
                    }
                  }
                }
              }))
            }
          },
          userErrors: []
        }
      }
    });
  });

  // ==================================================================
  // 🛍️ Shopify Mock Routes (Target 5: Payment Acknowledgement)
  // ==================================================================

  /**
   * Route: getOrderStatus
   * Mocks internal REST polling for payment status (Shopify orders/paid webhook simulation).
   */
  app.get("/api/mock/shopify/order-status", async (req, res) => {
    console.log("[Shopify Mock] GET: getOrderStatus", req.query);
    
    // Simulated delay to allow frontend to show loading states
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({
      status: "success",
      data: {
        shopifyOrderId: "gid://shopify/Order/4401",
        financialStatus: "PAID",
        fulfillmentStatus: "UNFULFILLED",
        totalPrice: "49.99",
        currency: "USD"
      }
    });
  });

  // ==================================================================
  // 🚀 Hydrogen + React Router v7 Handler
  // ==================================================================

  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Changed to custom for SSR
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist/client')));
  }

  app.all('*', async (req, res, next) => {
    try {
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      
      const handleRequest = createRequestHandler({
        build: vite 
          ? await vite.ssrLoadModule("virtual:react-router/server-build") 
          : await import("./build/server/index.js"),
        mode: process.env.NODE_ENV,
        getLoadContext: () => {
          const hydrogenContext = createHydrogenContext({
            env: process.env as any,
            request: { url, method: req.method, headers: req.headers },
            session: null, // Custom session can be added here
          });
          
          return {
            ...hydrogenContext,
            mockApiBaseUrl: `http://localhost:${PORT}/api/mock/shopify`,
          };
        },
      });

      const response = await handleRequest(
        new Request(url, {
          method: req.method,
          headers: req.headers as any,
          body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        })
      );

      // Convert Web Response back to Express response
      res.status(response.status);
      for (const [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
      }

      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      res.end();

    } catch (error) {
      if (vite) vite.ssrFixStacktrace(error as Error);
      console.error(error);
      next(error);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

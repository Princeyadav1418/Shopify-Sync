import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',').filter(Boolean) || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Shopify Integration
 * Define SHOPIFY_STORES_CONFIG in your .env file as a JSON array:
 * [{"domain": "store1.myshopify.com", "token": "shpat_xxx"}, {"domain": "store2.myshopify.com", "token": "shpat_yyy"}]
 */
const getShopifyConfig = () => {
   try {
      const configStr = process.env.SHOPIFY_STORES_CONFIG;
      if (!configStr) return [];
      return JSON.parse(configStr);
   } catch {
      return [];
   }
};

app.get('/api/shopify/stores', async (req, res) => {
   const storesConfig = getShopifyConfig();
   
   if (!storesConfig || storesConfig.length === 0) {
      return res.json({ connected: false, stores: [] });
   }

   try {
     const storesData = await Promise.all(storesConfig.map(async (config: any) => {
       const resp = await fetch(`https://${config.domain}/admin/api/2024-01/shop.json`, {
         headers: {
           'X-Shopify-Access-Token': config.token,
           'Content-Type': 'application/json'
         }
       });
       
       if (!resp.ok) {
          // If the integration fails, return a degraded status instead of bringing the whole API down
          return {
             id: config.domain,
             name: config.domain,
             url: config.domain,
             status: 'warning',
             revenue: 0,
             growth: 0,
             orders: 0,
             customers: 0,
             inventoryValue: 0,
             region: 'Unknown',
             connected: false,
             error: `API returned ${resp.status}`
          };
       }
       
       const { shop } = await resp.json();
       
       // Extracted shop data. 
       // Real BI metrics require pagination queries via Shopify Admin API (e.g. GraphQL for orders, products)
       return {
         id: shop.id.toString(),
         name: shop.name || shop.domain,
         url: shop.domain,
         status: 'active',
         revenue: 0, 
         growth: 0,        
         orders: 0,    
         customers: 0,  
         inventoryValue: 0,
         region: shop.country_name || 'Global',
         connected: true
       };
     }));
     
     return res.json({ connected: true, stores: storesData });
   } catch (err: any) {
     return res.status(500).json({ error: err.message, connected: false });
   }
});

app.get('/api/shopify/orders', async (req, res) => {
   const storesConfig = getShopifyConfig();
   if (!storesConfig || storesConfig.length === 0) {
      return res.json({ connected: false, orders: [] });
   }
   
   try {
     // Fetch logic could go here. Returning empty array for real logic as fallback
     return res.json({ connected: true, orders: [] });
   } catch (err: any) {
     return res.status(500).json({ error: err.message, connected: false });
   }
});

app.get('/api/shopify/customers', async (req, res) => {
   const storesConfig = getShopifyConfig();
   if (!storesConfig || storesConfig.length === 0) {
      return res.json({ connected: false, customers: [] });
   }
   
   try {
     return res.json({ connected: true, customers: [] });
   } catch (err: any) {
     return res.status(500).json({ error: err.message, connected: false });
   }
});

app.get('/api/shopify/products', async (req, res) => {
   const storesConfig = getShopifyConfig();
   if (!storesConfig || storesConfig.length === 0) {
      return res.json({ connected: false, products: [] });
   }
   
   try {
     return res.json({ connected: true, products: [] });
   } catch (err: any) {
     return res.status(500).json({ error: err.message, connected: false });
   }
});

app.get('/api/shopify/inventory', async (req, res) => {
   const storesConfig = getShopifyConfig();
   if (!storesConfig || storesConfig.length === 0) {
      return res.json({ connected: false, deadStock: [], fastMoving: [] });
   }
   
   try {
     return res.json({ connected: true, deadStock: [], fastMoving: [] });
   } catch (err: any) {
     return res.status(500).json({ error: err.message, connected: false });
   }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

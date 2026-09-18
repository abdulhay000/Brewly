# Brewly Coffee Store — Full Stack

React/Vite + Node/Express + MySQL coffee store. The original landing-page design is preserved while the application adds authentication, a separate user store page, admin management, cart/order flow, responsive layouts, and payment-method configuration.

## 1. Database

1. Open MySQL Workbench.
2. Run `server/db/schema.sql`.
3. Run `server/db/seed.sql`.

The scripts use `brewly_db`. `seed.sql` is safe to run again because products use a category/name uniqueness rule.

## 2. Backend

From the project root:

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and set:

- `DB_PASSWORD` — your MySQL password
- `JWT_SECRET` — a long random secret
- `CLIENT_URL` — normally `http://localhost:5173`
- `ADMIN_EMAIL` — optional; a signup using this exact email becomes an admin

Then run:

```bash
npm run dev
```

Keep this terminal running.

## 3. Frontend

Open a second terminal in the project root:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 4. Authentication

Signup requires email, username, password, and confirmation. Sign in accepts either email or username. Passwords are stored as bcrypt hashes.

## 5. Admin

Option A: set `ADMIN_EMAIL` in `server/.env`, then create an account with that exact email.

Option B: create a normal account and promote it in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## 6. Images

Seeded menu images live in `public/menu`, so paths such as `/menu/Cappuccino.jpg` are served by Vite. Uploaded admin images use the backend `/uploads` route.

## 7. Payments

Cash on delivery works without provider credentials. Telebirr and CBE Birr can use payment links configured in `.env`. Chapa requires a real provider integration and secret key; never place that secret in React code.

## Security

- Never share or commit `server/.env`.
- Only share `.env.example`.
- If a real MySQL password was previously shared outside your machine, change it before using this project.
- Do not commit API/payment secrets.

## Fixed in this version

- Backend server is correctly located at `server/src/server.js`.
- Home menu reads database products instead of the old category shape.
- Menu images resolve from the frontend `public/menu` folder.
- User/admin images use the correct frontend/backend asset source.
- CORS accepts configured origin plus localhost/127.0.0.1 development origins.
- Non-admin users get a clear admin-access message.
- Admin sees unavailable products and can restore them.
- Product removal has confirmation.
- Signup returns the created user consistently.

## Real payments and order email

The checkout now supports a real Telebirr Web Checkout flow and admin order emails.

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Configure the backend

Copy `server/.env.example` to `server/.env` and fill in:

- MySQL credentials
- `ADMIN_EMAIL`
- SMTP credentials for the email account that sends admin notifications
- Telebirr merchant credentials
- `TELEBIRR_NOTIFY_URL` (must be a public HTTPS URL in production)
- `TELEBIRR_REDIRECT_URL`

Never commit `server/.env`.

### 3. Telebirr setup

The app uses Telebirr H5/C2B Web Checkout rather than a hard-coded payment link. A checkout session is created for the exact order total, the customer is redirected to Telebirr, and the server verifies payment status before marking an order paid.

For development use the Telebirr sandbox. For production switch `TELEBIRR_ENVIRONMENT=PRODUCTION` and use production merchant credentials.

The Telebirr notification endpoint must be publicly reachable. `localhost` cannot receive Telebirr server-to-server notifications.

### 4. Email

SMTP is optional for running the app, but required for admin order emails. Gmail works with an App Password.

### 5. Database

The server automatically adds the new payment fields to an existing database. The schema file also contains the fields for fresh installations.

Orders have separate `payment_status` and `order_status` values. Admins can manually mark a Telebirr payment as paid when needed.

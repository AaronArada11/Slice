# Slice - Rent Splitting Web App

A production-ready rent splitting web application for roommates, built with React, Next.js, and PostgreSQL.

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js (NextAuth.js)
- **State Management**: React Context, Zustand
- **Deployment**: Vercel

## Features

### Core Features
- **User Authentication**: Email/password and Google OAuth
- **Household System**: Create/join households with invite codes
- **Rent Splitting**: Equal, percentage, or custom splits
- **Expense Tracking**: Add and split shared expenses
- **Payment Tracking**: Mark payments as completed
- **Dashboard**: Overview of balances and payment status
- **Debt Simplification**: Automatic calculation of who pays whom

### UI/UX
- Modern, minimal design
- Mobile-responsive
- Dashboard-first experience
- Charts and visualizations

## Project Structure

```
slice-rent-splitter/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── households/
│   │   └── ...
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/
│   └── layout.tsx
├── components/
│   ├── dashboard/
│   ├── ui/
│   └── providers.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── rent-calculator.ts
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.example
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Database Schema

### Users
- id, email, name, image, createdAt, updatedAt

### Households
- id, name, inviteCode, createdAt, updatedAt

### Memberships
- id, userId, householdId, role, joinedAt, isActive

### RentConfig
- id, householdId, totalAmount, splitType, customSplits, dueDay, isActive

### Expenses
- id, householdId, title, amount, category, paidById, splitType, customSplits, date

### Payments
- id, householdId, userId, amount, type, status, date

## API Routes

### Households
- `GET /api/households` - List user's households
- `POST /api/households` - Create new household

### Household Expenses
- `GET /api/households/[id]/expenses` - List expenses
- `POST /api/households/[id]/expenses` - Add expense

### Household Payments
- `GET /api/households/[id]/payments` - List payments
- `POST /api/households/[id]/payments` - Add payment

### Household Rent
- `GET /api/households/[id]/rent` - Get rent config
- `POST /api/households/[id]/rent` - Set rent config

## Rent Splitting Logic

### Split Types
1. **Equal**: Divided equally among all members
2. **Percentage**: Custom percentages per member
3. **Custom**: Fixed amounts per member

### Balance Calculation
- Calculate total rent owed per member
- Add shared expenses
- Subtract payments made
- Return individual balances

### Debt Simplification
- Uses minimum transactions algorithm
- Matches debtors to creditors
- Minimizes number of payments needed

## Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials (optional)

### Environment Variables
```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-app.vercel.app"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Deploy to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## Development

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Optional Enhancements

- AI suggestions for fair rent distribution
- Spending analytics and insights
- Mobile PWA support
- Stripe payment integration
- Email notifications
- Recurring expense templates

## License

MIT
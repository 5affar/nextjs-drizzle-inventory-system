# Inventory & Orders Management System

A complete inventory and order management application built with **Next.js 14**, **TypeScript**, **Drizzle ORM**, and **SQLite**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- SQLite (included) or PostgreSQL

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd "Inventory & Orders Mini-App (Next.js + Drizzle)"
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   # Create .env file
   echo 'DATABASE_URL="file:./.data/dev.db"' > .env
   ```

3. **Database Setup**
   ```bash
   # Generate migration files
   pnpm drizzle:generate
   
   # Apply migrations to database
   pnpm drizzle:migrate
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

5. **Run Tests**
   ```bash
   # Run all tests
   pnpm test:run
   
   # Run tests in watch mode
   pnpm test
   
   # Run tests with UI
   pnpm test:ui
   ```

## 🏗️ Architecture & Design Decisions

### **Route Handlers vs Server Actions**
This project uses **Route Handlers** (`/api/*` endpoints) instead of Server Actions for the following reasons:

1. **Clear API Boundaries**: Explicit HTTP endpoints make the API structure transparent
2. **Error Handling**: Better control over HTTP status codes and error responses
3. **Validation**: Centralized request/response validation with Zod schemas
4. **Testing**: Easier to test individual endpoints independently
5. **Client Integration**: Seamless integration with client-side state management

### **Database Choice: SQLite**
Selected SQLite over PostgreSQL for:

- **Faster Setup**: Zero configuration, file-based database
- **Development Speed**: No external database server required
- **Simplicity**: Perfect for demo and development environments
- **Portability**: Database file can be easily shared and backed up

### **Concurrency & Data Integrity**
- **Database Transactions**: All order creation uses atomic transactions
- **Stock Validation**: Pre-flight checks prevent overselling
- **Error Recovery**: Transaction rollback on any failure
- **Reference Integrity**: Foreign key constraints prevent data corruption

## 🧪 Testing

### Running Tests
```bash
# Run all tests once
pnpm test:run

# Run tests in watch mode during development
pnpm test

# Run tests with interactive UI
pnpm test:ui
```

## 📊 Environment Variables

Create a `.env` file in the root directory:

```bash
# SQLite database (default)
DATABASE_URL="file:./.data/dev.db"

# For PostgreSQL (optional)
# DATABASE_URL="postgresql://username:password@localhost:5432/database"
```


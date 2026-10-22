<div align="center">

# 💰 Expense Tracker

### Understand your money. Make more intentional decisions.

A modern, responsive personal finance dashboard built with **React, Vite, and Recharts**. Track income and expenses, set monthly budgets, explore spending trends, and keep your data organized with local browser storage and convenient backup tools.

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=20232A" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Recharts-Analytics-22A06B?style=for-the-badge" alt="Recharts">
  <img src="https://img.shields.io/badge/Responsive-Design-2563EB?style=for-the-badge" alt="Responsive design">
  <img src="https://img.shields.io/badge/License-MIT-8250DF?style=for-the-badge" alt="MIT License">
</p>

</div>

---

## 📌 Overview

**Expense Tracker** is a client-side personal finance application designed to make everyday money management easier to understand. Its dashboard brings balances, income, expenses, transaction history, monthly budgets, and interactive analytics together in one organized workspace.

Search and organize transactions, compare spending across months, explore category breakdowns, switch between light and dark themes, and export your data for backup. Your transactions, monthly budgets, and theme preference are saved in your browser using Local Storage, so the app does not need a backend or database to run.

> **Privacy note:** This version stores information locally in the browser. It does not provide account-based access, cloud synchronization, or automatic cross-device backups.

## ✨ Features

### 💳 Transaction management

- Add income and expense transactions.
- Edit existing transaction details.
- Delete individual transactions with confirmation.
- Search transactions by description.
- Filter transactions by type and category.
- Sort by newest, oldest, highest amount, or lowest amount.
- Clear all transactions with a confirmation dialog.

### 📊 Financial dashboard

- View total balance, income, expenses, and savings at a glance.
- See a transaction count and clearly organized transaction history.
- Review a summary calculated from your recorded transactions.
- Use a responsive dashboard layout for different screen sizes.

### 📅 Monthly budgeting and analytics

- Review income, expenses, and savings for a selected month.
- Set and save a budget for each month.
- Track budget usage and remaining budget.
- See when monthly spending exceeds the budget.
- Compare income and expenses with the previous month.
- Explore a 12-month expense trend.
- View a category-wise breakdown of monthly spending.

### 📈 Advanced visual analytics

- Analyze data across a custom date range.
- Compare income and expenses.
- Explore savings and spending patterns.
- Inspect category distribution and daily spending activity.
- Visualize financial data with interactive Recharts charts.

### 💾 Data backup and portability

- Export transactions as a JSON backup.
- Import transactions from a valid Expense Tracker JSON backup.
- Export transaction records as a CSV file.
- Keep transactions and monthly budgets saved in browser Local Storage.

### 🌗 Personalization and responsive UI

- Switch between light and dark themes.
- Remember the selected theme in the browser.
- Use a clean dashboard with reusable React components.
- Browse on desktop, laptop, tablet, and mobile screens.

## 🖼️ Screenshots

### Dashboard

![Expense Tracker dashboard](screenshots/dashboard.png)

### Monthly and advanced analytics

![Expense Tracker analytics](screenshots/analytics.png)

### Transaction management

![Expense Tracker transactions](screenshots/transactions.png)

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component-based user interface and application state. |
| **Vite** | Local development server and production build tooling. |
| **JavaScript (ES Modules)** | Transaction logic, filtering, summaries, and data handling. |
| **CSS3** | Layout, responsive styles, theme tokens, and dark mode. |
| **Recharts** | Interactive charts and financial data visualizations. |
| **React Icons** | Icons used throughout the interface. |
| **Local Storage API** | Persists transactions, monthly budgets, and theme preference in the browser. |
| **ESLint** | Static checks for code quality. |

## 🚀 Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm. Use a Node.js version compatible with the Vite version specified in `package.json`.

### 1. Clone the repository

Replace `YOUR_USERNAME` with your GitHub username and adjust the repository name if yours is different.

```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
```

### 2. Navigate to the project directory

```bash
cd expense-tracker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local address printed in your terminal by Vite.

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm install` | Install project dependencies. |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint checks on the project. |

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## 📂 Project Structure

```text
expense-tracker/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── screenshots/
│   ├── analytics.png
│   ├── dashboard.png
│   └── transactions.png
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── AdvancedAnalytics.jsx
│   │   ├── ConfirmationModal.jsx
│   │   ├── DataManager.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Header.jsx
│   │   ├── MonthlyAnalytics.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Statistics.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionItem.jsx
│   │   └── TransactionList.jsx
│   ├── styles/
│   │   ├── App.css
│   │   ├── EmptyState.css
│   │   ├── Header.css
│   │   ├── SearchBar.css
│   │   ├── Statistics.css
│   │   ├── SummaryCards.css
│   │   ├── TransactionForm.css
│   │   ├── TransactionItem.css
│   │   └── TransactionList.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 💡 How data is stored

The application uses the browser's Local Storage API to persist information between visits in the same browser profile.

- **Transactions:** stored under `expense_tracker_transactions`.
- **Monthly budgets:** stored under `expense_tracker_monthly_budgets`.
- **Theme preference:** stored under `expense_tracker_theme`.

Because the application does not use a backend, data is not synced between browsers or devices. Clearing the browser's site data can remove locally stored information. Export a JSON backup periodically if you need a separate copy of your transaction records.

## 🔐 Scope and limitations

- No user accounts, authentication, or cloud synchronization are included.
- No bank accounts or financial institutions are connected.
- Imported JSON files must match the application's expected transaction backup format.
- CSV export is intended for downloading and reviewing transaction records; importing is supported through JSON backups.
- The app provides personal tracking and visualization tools, not professional financial advice.

## 🔮 Future Improvements

- [ ] Add recurring transactions and scheduled payments.
- [ ] Add custom categories and transaction notes.
- [ ] Add savings goals and goal-progress tracking.
- [ ] Add more flexible currency and date-format settings.
- [ ] Add optional encrypted backup and restore tools.
- [ ] Introduce account-based cloud sync as an optional feature.
- [ ] Add accessibility checks and expanded keyboard navigation.
- [ ] Add automated tests for transaction and analytics logic.

## 🤝 Contributing

Ideas, bug reports, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-improvement
   ```

3. Make your changes and test the affected flows.
4. Run the project's checks:

   ```bash
   npm run lint
   npm run build
   ```

5. Commit your changes and open a pull request describing the update.

## 📄 License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

## 👨‍💻 Author

**Samyak Dutta**  

---

<div align="center">

**Make your money easier to understand.**

If you find this project useful, consider giving the repository a ⭐ on GitHub.

</div>
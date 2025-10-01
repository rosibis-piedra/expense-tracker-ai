# Expense Tracker

A modern, professional expense tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your personal finances, analyze spending patterns, and manage your expenses effectively.

## Features

### Core Functionality
- ✅ **Add Expenses**: Create expenses with date, amount, category, and description
- ✅ **Edit Expenses**: Inline editing of existing expenses
- ✅ **Delete Expenses**: Remove unwanted expenses with confirmation
- ✅ **Data Persistence**: All data saved to localStorage (no backend required)

### Analytics & Insights
- 📊 **Dashboard**: Overview of total spending, monthly spending, and top category
- 📈 **Visual Charts**: Category breakdown with percentage bars
- 📉 **Quick Stats**: Average per expense, categories used, and monthly counts
- 🏷️ **Categories**: Food, Transportation, Entertainment, Shopping, Bills, Other

### Filtering & Search
- 🔍 **Search**: Filter expenses by description or category
- 📅 **Date Range**: Filter by start and end dates
- 🏷️ **Category Filter**: View expenses by specific category
- 🔄 **Reset Filters**: Quickly clear all filters

### Additional Features
- 💾 **CSV Export**: Export filtered expenses to CSV format
- ✅ **Form Validation**: Real-time validation for all inputs
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, professional interface with intuitive navigation
- ⚡ **Loading States**: Smooth transitions and loading indicators
- 🎯 **Error Handling**: User-friendly error messages

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Data Storage**: localStorage (browser-based)
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage Guide

### Adding an Expense

1. Click the **"Add Expense"** button in the header
2. Fill in the form:
   - **Date**: Select the expense date
   - **Amount**: Enter the amount (must be greater than 0)
   - **Category**: Choose from 6 categories
   - **Description**: Add details about the expense
3. Click **"Add Expense"** to save

### Editing an Expense

1. Find the expense in the list
2. Click the **edit icon** (pencil)
3. Modify the fields as needed
4. Click **"Update Expense"** or **"Cancel"**

### Deleting an Expense

1. Find the expense in the list
2. Click the **delete icon** (trash)
3. Confirm the deletion

### Filtering Expenses

1. Use the **Filters** section:
   - **Search**: Type keywords to search descriptions
   - **Category**: Select a specific category
   - **Start Date**: Set the beginning of date range
   - **End Date**: Set the end of date range
2. Click **"Reset All"** to clear filters

### Exporting Data

1. Apply any filters you want (optional)
2. Click **"Export CSV"** in the header
3. The CSV file will download with your filtered expenses

## Project Structure

```
expense-tracker-ai/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Main page component
├── components/
│   ├── CategoryChart.tsx     # Visual category breakdown
│   ├── Dashboard.tsx         # Summary statistics cards
│   ├── ExpenseFilters.tsx    # Filter controls
│   ├── ExpenseForm.tsx       # Add/edit expense form
│   ├── ExpenseList.tsx       # Expense list with actions
│   └── ExportButton.tsx      # CSV export button
├── context/
│   └── ExpenseContext.tsx    # Global state management
├── lib/
│   ├── storage.ts            # localStorage utilities
│   └── utils.ts              # Helper functions
├── types/
│   └── expense.ts            # TypeScript interfaces
└── package.json
```

## Features Breakdown

### Dashboard Cards
- **Total Spending**: Sum of all expenses
- **This Month**: Current month's spending
- **Top Category**: Category with highest spending
- **Total Expenses**: Count of all expenses

### Category Breakdown Chart
- Visual bars showing spending per category
- Percentage calculations
- Total amount per category
- Color-coded by category

### Form Validation
- Required field validation
- Amount must be greater than 0
- Real-time error feedback
- Touch-based validation (errors show after interaction)

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly buttons
- Optimized for all screen sizes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Data Persistence

All data is stored in your browser's localStorage. This means:
- ✅ Data persists across sessions
- ✅ No internet connection required
- ✅ No backend server needed
- ⚠️ Data is device-specific (not synced across devices)
- ⚠️ Clearing browser data will delete all expenses

## Customization

### Adding New Categories

Edit `types/expense.ts`:
```typescript
export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other'
  | 'YourNewCategory';  // Add here
```

Then update category colors in `lib/utils.ts`.

### Changing Color Scheme

Edit `tailwind.config.ts` to customize the primary color palette.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for consistent styling
- React best practices throughout

## Troubleshooting

### Data Not Saving
- Check if localStorage is enabled in your browser
- Ensure you're not in private/incognito mode
- Check browser console for errors

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Future Enhancements

Potential features for future versions:
- Backend integration with database
- User authentication
- Multi-user support
- Recurring expenses
- Budget tracking
- Advanced charts (pie, line graphs)
- Dark mode
- Currency selection
- Receipt image uploads
- Tags system

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please check the troubleshooting section above or review the code comments for implementation details.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

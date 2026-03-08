# WhatIF

![Project Icon](./src/assets/whatif.png)

i got tired of websites asking me to pay money to do a simple backtest so i built this thing.

yahoo pls never delete this api big thank.

A stock portfolio "what if" simulator. Enter any tickers, a date range, and an investment amount to see exactly what your returns would have been — with support for recurring DCA contributions.

## What you can do

- Simulate a lump-sum investment in any publicly listed stock
- Layer recurring investments (dollar-cost averaging) at any interval
- Compare multiple tickers side by side on a single interactive chart
- View a full analytics breakdown: total invested, shares held, average price, last price, absolute and percentage returns
- Sort the analytics table by any column (returns, average price, etc.)
- Drag and reorder analytics columns

## Installation

**Requirements:** Node.js 18+, pnpm

```bash
git clone https://github.com/your-username/whatifview.git
cd whatifview

# Dev server
pnpm install
pnpm dev

# Prod server
pnpm build
pnpm preview
```

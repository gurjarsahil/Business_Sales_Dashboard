import pandas as pd
import json

df = pd.read_csv('../data/raw/sales_data_raw.csv')
df['Order_Date'] = pd.to_datetime(df['Order_Date'])
df['Year'] = df['Order_Date'].dt.year
df['Month'] = df['Order_Date'].dt.month
df['Month_Name'] = df['Order_Date'].dt.strftime('%b %Y')

df.to_csv('../data/cleaned/sales_data_cleaned.csv', index=False)

# KPIs
total_revenue = df['Total_Sales'].sum()
total_orders = len(df)
total_customers = df['Customer_ID'].nunique()
avg_order_value = df['Total_Sales'].mean()
total_profit = df['Profit'].sum()

# Monthly trend
monthly = df.groupby('Month_Name').agg({'Total_Sales': 'sum'}).reset_index()
monthly_sales = monthly['Total_Sales'].tolist()
monthly_labels = monthly['Month_Name'].tolist()

# Calculate growth
if len(monthly_sales) >= 2:
    growth = ((monthly_sales[-1] - monthly_sales[-2]) / monthly_sales[-2]) * 100
else:
    growth = 0

# Revenue by region
region_data = df.groupby('Region')['Total_Sales'].sum().sort_values(ascending=False)
region_labels = region_data.index.tolist()
region_values = region_data.values.tolist()

# Top 10 products
top_products = df.groupby('Product_Name')['Total_Sales'].sum().sort_values(ascending=False).head(10)
product_labels = top_products.index.tolist()
product_values = top_products.values.tolist()

# Category distribution
category_data = df.groupby('Product_Category')['Total_Sales'].sum()
category_labels = category_data.index.tolist()
category_values = category_data.values.tolist()

# Top customers
top_customers = df.groupby(['Customer_ID', 'Customer_Name'])['Total_Sales'].sum().sort_values(ascending=False).head(10).reset_index()
top_customers_list = top_customers.to_dict('records')

# Profit by region
profit_region = df.groupby('Region')['Profit'].sum().sort_values(ascending=False)
profit_labels = profit_region.index.tolist()
profit_values = profit_region.values.tolist()

# Create JSON for dashboard
dashboard_data = {
    'kpis': {
        'total_revenue': round(total_revenue, 2),
        'total_orders': total_orders,
        'total_customers': total_customers,
        'avg_order_value': round(avg_order_value, 2),
        'monthly_growth': round(growth, 2),
        'total_profit': round(total_profit, 2)
    },
    'monthly_trend': {
        'labels': monthly_labels,
        'values': [round(v, 2) for v in monthly_sales]
    },
    'revenue_by_region': {
        'labels': region_labels,
        'values': [round(v, 2) for v in region_values]
    },
    'top_products': {
        'labels': product_labels,
        'values': [round(v, 2) for v in product_values]
    },
    'category_distribution': {
        'labels': category_labels,
        'values': [round(v, 2) for v in category_values]
    },
    'top_customers': top_customers_list,
    'profit_by_region': {
        'labels': profit_labels,
        'values': [round(v, 2) for v in profit_values]
    }
}

with open('../dashboard/dashboard_data.json', 'w') as f:
    json.dump(dashboard_data, f, indent=2)

print("[SUCCESS] Analysis complete")
print(f"\n=== KEY METRICS ===")
print(f"Total Revenue: ${total_revenue:,.2f}")
print(f"Total Orders: {total_orders:,}")
print(f"Total Customers: {total_customers:,}")
print(f"Average Order Value: ${avg_order_value:,.2f}")
print(f"Monthly Growth: {growth:.2f}%")
print(f"Total Profit: ${total_profit:,.2f}")

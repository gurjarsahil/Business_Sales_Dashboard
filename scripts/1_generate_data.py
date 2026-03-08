import pandas as pd
import numpy as np
from faker import Faker
from datetime import datetime, timedelta
import random

fake = Faker()
np.random.seed(42)
random.seed(42)

NUM_ROWS = 10000
regions = ['North', 'South', 'East', 'West', 'Central']
categories = ['Electronics', 'Furniture', 'Office Supplies', 'Clothing', 'Food & Beverage']
segments = ['Consumer', 'Corporate', 'Home Office']
products = {
    'Electronics': ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headphones', 'Tablet', 'Webcam'],
    'Furniture': ['Chair', 'Desk', 'Cabinet', 'Sofa', 'Table', 'Bookshelf'],
    'Office Supplies': ['Pen', 'Notebook', 'Stapler', 'Paper', 'Binder', 'Folder'],
    'Clothing': ['Shirt', 'Pants', 'Jacket', 'Shoes', 'Hat', 'Tie'],
    'Food & Beverage': ['Coffee', 'Snacks', 'Water', 'Juice', 'Tea', 'Energy Drink']
}

data = []
start_date = datetime(2023, 1, 1)
customers = [(f'CUST{i:04d}', fake.name()) for i in range(1, 501)]

for i in range(NUM_ROWS):
    order_id = f'ORD{str(i+1).zfill(6)}'
    order_date = start_date + timedelta(days=random.randint(0, 365))
    customer_id, customer_name = random.choice(customers)
    region = random.choice(regions)
    segment = random.choice(segments)
    category = random.choice(categories)
    product = random.choice(products[category])
    quantity = random.randint(1, 15)
    unit_price = round(random.uniform(15, 800), 2)
    discount = round(random.choice([0, 0, 0, 0.05, 0.10, 0.15]), 2)
    
    subtotal = quantity * unit_price
    discount_amount = subtotal * discount
    total_sales = round(subtotal - discount_amount, 2)
    profit = round(total_sales * random.uniform(0.10, 0.35), 2)
    
    data.append([order_id, order_date, customer_id, customer_name, region, segment,
                 category, product, quantity, unit_price, discount, profit, total_sales])

columns = ['Order_ID', 'Order_Date', 'Customer_ID', 'Customer_Name', 'Region', 
           'Customer_Segment', 'Product_Category', 'Product_Name', 'Quantity', 
           'Unit_Price', 'Discount', 'Profit', 'Total_Sales']

df = pd.DataFrame(data, columns=columns)
df.to_csv('../data/raw/sales_data_raw.csv', index=False)
print(f"[SUCCESS] Generated {len(df)} rows of sales data")
print(f"[SUCCESS] Saved to: data/raw/sales_data_raw.csv")

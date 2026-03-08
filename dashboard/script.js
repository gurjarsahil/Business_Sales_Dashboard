fetch('dashboard_data.json')
    .then(res => res.json())
    .then(data => {
        // Update KPIs
        document.getElementById('totalRevenue').textContent = `$${data.kpis.total_revenue.toLocaleString()}`;
        document.getElementById('totalOrders').textContent = data.kpis.total_orders.toLocaleString();
        document.getElementById('totalCustomers').textContent = data.kpis.total_customers.toLocaleString();
        document.getElementById('avgOrderValue').textContent = `$${data.kpis.avg_order_value.toLocaleString()}`;
        document.getElementById('monthlyGrowth').textContent = `${data.kpis.monthly_growth}%`;

        // Monthly Sales Trend
        new Chart(document.getElementById('monthlySalesChart'), {
            type: 'line',
            data: {
                labels: data.monthly_trend.labels,
                datasets: [{
                    label: 'Sales ($)',
                    data: data.monthly_trend.values,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Revenue by Region
        new Chart(document.getElementById('regionChart'), {
            type: 'bar',
            data: {
                labels: data.revenue_by_region.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.revenue_by_region.values,
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
                }]
            },
            options: { 
                responsive: true, 
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Top Products
        new Chart(document.getElementById('productsChart'), {
            type: 'bar',
            data: {
                labels: data.top_products.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.top_products.values,
                    backgroundColor: '#764ba2'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.x.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Category Pie Chart
        new Chart(document.getElementById('categoryChart'), {
            type: 'doughnut',
            data: {
                labels: data.category_distribution.labels,
                datasets: [{
                    data: data.category_distribution.values,
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
                }]
            },
            options: { 
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': $' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Top Customers Table
        const tbody = document.querySelector('#customersTable tbody');
        data.top_customers.forEach((customer, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${customer.Customer_Name}</td>
                    <td>$${customer.Total_Sales.toLocaleString()}</td>
                </tr>
            `;
        });

        // Profit by Region
        new Chart(document.getElementById('profitChart'), {
            type: 'bar',
            data: {
                labels: data.profit_by_region.labels,
                datasets: [{
                    label: 'Profit',
                    data: data.profit_by_region.values,
                    backgroundColor: '#11998e'
                }]
            },
            options: { 
                responsive: true, 
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error loading dashboard data:', error);
        alert('Error loading dashboard data. Please make sure dashboard_data.json exists.');
    });

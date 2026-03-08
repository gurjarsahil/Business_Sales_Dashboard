let rawData = null;
let filteredData = null;
let charts = {};

// Load data
fetch('dashboard_data.json')
    .then(res => res.json())
    .then(data => {
        rawData = data;
        filteredData = data;
        initializeDashboard(data);
        setupFilters();
    })
    .catch(error => {
        console.error('Error loading dashboard data:', error);
        alert('Error loading dashboard data. Please make sure dashboard_data.json exists.');
    });

function initializeDashboard(data) {
    updateKPIs(data);
    createCharts(data);
}

function updateKPIs(data) {
    document.getElementById('totalRevenue').textContent = `$${data.kpis.total_revenue.toLocaleString()}`;
    document.getElementById('totalOrders').textContent = data.kpis.total_orders.toLocaleString();
    document.getElementById('totalCustomers').textContent = data.kpis.total_customers.toLocaleString();
    document.getElementById('avgOrderValue').textContent = `$${data.kpis.avg_order_value.toLocaleString()}`;
    
    const growth = data.kpis.monthly_growth;
    const growthElement = document.getElementById('monthlyGrowth');
    growthElement.textContent = `${growth}%`;
    
    // Change color based on growth
    const growthCard = growthElement.closest('.kpi-card');
    if (growth < 0) {
        growthCard.style.background = 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)';
    } else {
        growthCard.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    }
}

function createCharts(data) {
    // Monthly Sales Trend
    charts.monthly = new Chart(document.getElementById('monthlySalesChart'), {
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
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7
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
                            return 'Sales: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });

    // Revenue by Region
    charts.region = new Chart(document.getElementById('regionChart'), {
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
                            return 'Revenue: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });

    // Top Products
    charts.products = new Chart(document.getElementById('productsChart'), {
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
                            return 'Revenue: $' + context.parsed.x.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });

    // Category Pie Chart
    charts.category = new Chart(document.getElementById('categoryChart'), {
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
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });

    // Top Customers Table
    updateCustomersTable(data.top_customers);

    // Profit by Region
    charts.profit = new Chart(document.getElementById('profitChart'), {
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
                            return 'Profit: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

function updateCustomersTable(customers) {
    const tbody = document.querySelector('#customersTable tbody');
    tbody.innerHTML = '';
    customers.forEach((customer, index) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${customer.Customer_Name}</td>
                <td><strong>$${customer.Total_Sales.toLocaleString()}</strong></td>
            </tr>
        `;
    });
}

function setupFilters() {
    const regionFilter = document.getElementById('regionFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const segmentFilter = document.getElementById('segmentFilter');
    const resetBtn = document.getElementById('resetFilters');

    regionFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    segmentFilter.addEventListener('change', applyFilters);
    
    resetBtn.addEventListener('click', () => {
        regionFilter.value = 'all';
        categoryFilter.value = 'all';
        segmentFilter.value = 'all';
        applyFilters();
    });
}

function applyFilters() {
    const region = document.getElementById('regionFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const segment = document.getElementById('segmentFilter').value;

    // Show loading state
    document.body.style.cursor = 'wait';

    // Simulate filtering (in real app, you'd filter the actual data)
    setTimeout(() => {
        // For demo, just show a message
        if (region !== 'all' || category !== 'all' || segment !== 'all') {
            showFilterMessage(region, category, segment);
        } else {
            hideFilterMessage();
        }
        
        document.body.style.cursor = 'default';
    }, 300);
}

function showFilterMessage(region, category, segment) {
    let message = 'Filters applied: ';
    const filters = [];
    
    if (region !== 'all') filters.push(`Region: ${region}`);
    if (category !== 'all') filters.push(`Category: ${category}`);
    if (segment !== 'all') filters.push(`Segment: ${segment}`);
    
    message += filters.join(', ');
    
    // Remove existing message
    const existing = document.querySelector('.filter-message');
    if (existing) existing.remove();
    
    // Add new message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'filter-message';
    messageDiv.innerHTML = `
        <span>🔍 ${message}</span>
        <button onclick="this.parentElement.remove()">✕</button>
    `;
    
    const filtersDiv = document.querySelector('.filters');
    filtersDiv.parentNode.insertBefore(messageDiv, filtersDiv.nextSibling);
}

function hideFilterMessage() {
    const existing = document.querySelector('.filter-message');
    if (existing) existing.remove();
}

// Add animation on load
window.addEventListener('load', () => {
    document.querySelectorAll('.kpi-card').forEach((card, index) => {
        card.style.animation = `slideIn 0.5s ease ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });
});

// STATS SCREEN LOGIC - Enhanced with HCI Principles

const ctx = document.getElementById('progressChart').getContext('2d');
let myChart;

// 1. DATASETS (Mock Data for Prototype)
const allData = {
    steps: {
        color: '#608EE9', // Blue
        label: 'Steps',
        unit: 'steps',
        icon: '👟',
        daily: { 
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
            values: [5400, 4800, 9100, 5800, 7200, 8100, 6500],
            trend: '+12%'
        },
        weekly: { 
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], 
            values: [45000, 52000, 48000, 56000],
            trend: '+8%'
        },
        monthly: { 
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
            values: [180000, 195000, 210000, 175000, 220000, 235000],
            trend: '+15%'
        }
    },
    calories: {
        color: '#FFC243', // Yellow
        label: 'Calories',
        unit: 'kcal',
        icon: '🔥',
        daily: { 
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
            values: [450, 520, 895, 600, 750, 900, 600],
            trend: '+18%'
        },
        weekly: { 
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], 
            values: [3200, 3500, 4100, 3800],
            trend: '+10%'
        },
        monthly: { 
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
            values: [12000, 14000, 15000, 13500, 16000, 17000],
            trend: '+22%'
        }
    },
    workout: {
        color: '#EF4444', // Red
        label: 'Workouts',
        unit: 'sessions',
        icon: '💪',
        daily: { 
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
            values: [1, 0, 2, 1, 1, 2, 0],
            trend: '+5%'
        },
        weekly: { 
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], 
            values: [4, 5, 3, 6],
            trend: '+20%'
        },
        monthly: { 
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
            values: [15, 18, 20, 16, 22, 24],
            trend: '+25%'
        }
    }
};

// Current State
let activeCategory = 'steps';
let activeTimeframe = 'daily';

// 2. RENDER CHART FUNCTION (HCI: Clear Data Visualization)
function renderChart() {
    const dataSet = allData[activeCategory][activeTimeframe];
    const themeColor = allData[activeCategory].color;
    const categoryData = allData[activeCategory];

    // Destroy existing chart if it exists
    if (myChart) myChart.destroy();

    // Create Gradient (HCI: Visual Appeal)
    let gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, themeColor + '60'); // 40% opacity
    gradient.addColorStop(1, themeColor + '05'); // 2% opacity

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataSet.labels,
            datasets: [{
                label: categoryData.label,
                data: dataSet.values,
                borderColor: themeColor,
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4, // Smooth curves
                pointBackgroundColor: '#0A0A14',
                pointBorderColor: themeColor,
                pointBorderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: themeColor,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 800,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: false,
                    external: externalTooltipHandler
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.4)',
                        font: { family: 'Montserrat', size: 10 },
                        callback: function(value) {
                            if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
                            return value;
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        font: { family: 'Montserrat', size: 10, weight: '600' }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });

    // Update Chart Title and Badge (HCI: Context Awareness)
    updateChartInfo();
    updateQuickStats();
}

// Update chart header info (HCI: Visibility of System Status)
function updateChartInfo() {
    const categoryData = allData[activeCategory];
    const dataSet = allData[activeCategory][activeTimeframe];
    
    const chartTitle = document.getElementById('chartTitle');
    const chartSubtitle = document.getElementById('chartSubtitle');
    const chartBadge = document.getElementById('chartBadge');
    const tooltipLabel = document.getElementById('tooltip-label');
    
    // Update title
    const timeframeLabels = {
        daily: 'This Week',
        weekly: 'This Month',
        monthly: 'This Year'
    };
    
    chartTitle.innerText = `${categoryData.label} Overview`;
    chartSubtitle.innerText = `${activeTimeframe.charAt(0).toUpperCase() + activeTimeframe.slice(1)} · ${timeframeLabels[activeTimeframe]}`;
    
    // Update badge with trend
    chartBadge.innerText = `${dataSet.trend} ↑`;
    chartBadge.style.backgroundColor = categoryData.color + '20';
    chartBadge.style.color = categoryData.color;
    
    // Update tooltip label
    if (tooltipLabel) tooltipLabel.innerText = categoryData.unit;
}

// Update quick stats at top (HCI: Real-time Feedback)
function updateQuickStats() {
    const stepsData = allData.steps.daily.values;
    const calsData = allData.calories.daily.values;
    const workoutData = allData.workout.daily.values;
    
    const avgSteps = Math.round(stepsData.reduce((a, b) => a + b, 0) / stepsData.length);
    const avgCals = Math.round(calsData.reduce((a, b) => a + b, 0) / calsData.length);
    const totalWorkouts = workoutData.reduce((a, b) => a + b, 0);
    
    document.getElementById('statSteps').innerText = (avgSteps / 1000).toFixed(1) + 'K';
    document.getElementById('statCals').innerText = avgCals;
    document.getElementById('statWorkouts').innerText = totalWorkouts;
}

// 3. INTERACTION HANDLERS (HCI: Clear Feedback, Consistency)

window.switchCategory = function(category) {
    activeCategory = category;
    
    const categories = ['steps', 'calories', 'workout'];
    const colors = {
        steps: { bg: 'bg-secondary-blue', text: 'text-white' },
        calories: { bg: 'bg-primary-yellow', text: 'text-app-bg' },
        workout: { bg: 'bg-red-500', text: 'text-white' }
    };
    
    categories.forEach(cat => {
        const btn = document.getElementById(`cat-${cat}`);
        const icon = cat === 'steps' ? '👟' : cat === 'calories' ? '🔥' : '💪';
        const label = cat === 'steps' ? 'Steps' : cat === 'calories' ? 'Calories' : 'Workout';
        
        if (cat === category) {
            btn.className = `flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${colors[cat].bg} ${colors[cat].text} shadow-lg flex items-center justify-center gap-1.5`;
        } else {
            btn.className = "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center gap-1.5";
        }
        btn.innerHTML = `<span>${icon}</span> ${label}`;
    });

    renderChart();
};

window.switchTimeframe = function(timeframe) {
    activeTimeframe = timeframe;

    const timeframes = ['daily', 'weekly', 'monthly'];
    const icons = { daily: '📅', weekly: '📆', monthly: '🗓️' };
    const labels = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
    
    timeframes.forEach(time => {
        const btn = document.getElementById(`time-${time}`);
        if (time === timeframe) {
            btn.className = "flex-1 py-2 rounded-xl text-xs font-bold transition-all bg-white/10 text-white border border-white/20";
        } else {
            btn.className = "flex-1 py-2 rounded-xl text-xs font-bold transition-all text-white/50 hover:text-white hover:bg-white/5";
        }
        btn.innerText = `${icons[time]} ${labels[time]}`;
    });

    renderChart();
};

// Custom Tooltip Logic (HCI: Clear Information Display)
function externalTooltipHandler(context) {
    const {chart, tooltip} = context;
    const tooltipEl = document.getElementById('chart-tooltip');
    const valueEl = document.getElementById('tooltip-value');

    if (tooltip.opacity === 0) {
        tooltipEl.classList.add('hidden');
        return;
    }

    // Get the raw value
    const value = tooltip.dataPoints[0].raw;
    
    // Format the value with commas
    valueEl.innerText = Number(value).toLocaleString();

    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

    tooltipEl.classList.remove('hidden');
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY - 10 + 'px';
}

// Find peak day (HCI: Intelligent Insights)
function findPeakDay() {
    const values = allData[activeCategory].daily.values;
    const labels = allData[activeCategory].daily.labels;
    const maxIndex = values.indexOf(Math.max(...values));
    return { day: labels[maxIndex], value: values[maxIndex] };
}

// Initialize
renderChart();
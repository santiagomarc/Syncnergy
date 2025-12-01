// ACTIVITY LOGIC - Enhanced with HCI Principles

// 1. DATA SOURCES
const frequentActivities = ["Walking", "Running", "Cycling", "Yoga"];
const historyActivities = [
    { name: "Running", defaultDuration: 30, defaultIntensity: "High", icon: "🏃" },
    { name: "Walking", defaultDuration: 45, defaultIntensity: "Low", icon: "🚶" },
    { name: "Cycling", defaultDuration: 60, defaultIntensity: "Moderate", icon: "🚴" },
    { name: "HIIT", defaultDuration: 20, defaultIntensity: "High", icon: "💪" },
    { name: "Swimming", defaultDuration: 30, defaultIntensity: "Moderate", icon: "🏊" },
    { name: "Yoga", defaultDuration: 45, defaultIntensity: "Low", icon: "🧘" }
];

let selectedActivity = null;
let currentIntensity = "Moderate";

// Multipliers for Calorie Calc (approximate kcal per minute)
const intensityMultipliers = {
    "Low": 4,
    "Moderate": 8,
    "High": 12
};

// 2. DOM ELEMENTS
const frequentList = document.getElementById('frequentList');
const historyList = document.getElementById('historyList');
const searchInput = document.getElementById('searchInput');
const titleDisplay = document.getElementById('selectedActivityTitle');
const inputDuration = document.getElementById('inputDuration');
const calcCalories = document.getElementById('calcCalories');
const configCard = document.getElementById('configCard');

// 3. RENDER FUNCTIONS

// Render Frequent Pills with icons for better recognition (HCI: Recognition over Recall)
function renderFrequent() {
    const iconMap = { "Walking": "🚶", "Running": "🏃", "Cycling": "🚴", "Yoga": "🧘" };
    frequentList.innerHTML = frequentActivities.map(act => `
        <button onclick="selectActivity('${act}')" 
            class="whitespace-nowrap px-4 py-2 bg-secondary-blue rounded-full text-xs font-bold text-white shadow-md hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-1.5">
            <span>${iconMap[act] || '🏃'}</span>
            <span>${act}</span>
        </button>
    `).join('');
}

// Render History List with better visual hierarchy (HCI: Visual Hierarchy, Affordance)
function renderHistory(filter = "") {
    const filtered = historyActivities.filter(act => act.name.toLowerCase().includes(filter.toLowerCase()));
    
    if (filtered.length === 0) {
        historyList.innerHTML = `
            <div class="text-center py-6">
                <p class="text-white/30 text-xs">No activities found.</p>
                <p class="text-white/20 text-[10px] mt-1">Try a different search term</p>
            </div>`;
        return;
    }

    historyList.innerHTML = filtered.map(act => `
        <div onclick="selectActivity('${act.name}', ${act.defaultDuration}, '${act.defaultIntensity}')" 
             class="group flex items-center justify-between py-3 cursor-pointer hover:bg-white/5 rounded-xl px-3 -mx-2 transition-all duration-200 active:scale-[0.98]">
            <div class="flex items-center gap-3">
                <span class="text-lg">${act.icon}</span>
                <div>
                    <span class="font-bold text-sm group-hover:text-primary-yellow transition-colors block">${act.name}</span>
                    <span class="text-[10px] text-white/40">${act.defaultDuration} mins typical</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded-md">${act.defaultIntensity}</span>
                <div class="w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-primary-yellow group-hover:bg-primary-yellow group-hover:text-app-bg transition-all">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                </div>
            </div>
        </div>
    `).join('');
}

// 4. INTERACTION LOGIC

// Select Activity - with smooth scroll & visual feedback (HCI: Feedback, Visibility)
window.selectActivity = function(name, duration = 30, intensity = "Moderate") {
    selectedActivity = name;
    
    // Update title with animation feedback
    titleDisplay.classList.add('scale-105');
    titleDisplay.innerText = name;
    setTimeout(() => titleDisplay.classList.remove('scale-105'), 200);
    
    // Fill in the values
    inputDuration.value = duration;
    setIntensity(intensity);
    
    // Highlight the config card briefly (HCI: Feedback - user knows something happened)
    configCard.classList.add('ring-2', 'ring-primary-yellow/50');
    setTimeout(() => configCard.classList.remove('ring-2', 'ring-primary-yellow/50'), 800);
    
    // Smooth scroll to config card
    configCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Clear search if used
    if(searchInput.value) {
        searchInput.value = '';
        renderHistory();
    }
    
    // Update calorie calculation immediately
    updateCalculation();
}

// Set Intensity - FIXED button ID mapping (HCI: Feedback, Consistency)
window.setIntensity = function(level) {
    currentIntensity = level;
    
    // Button ID map (fixed the issue!)
    const btnIds = {
        "Low": "btnLow",
        "Moderate": "btnMod",
        "High": "btnHigh"
    };
    
    // Reset all buttons, then highlight selected
    ['Low', 'Moderate', 'High'].forEach(l => {
        const btn = document.getElementById(btnIds[l]);
        if (!btn) return;
        
        if (l === level) {
            // Active state - clear visual distinction
            btn.className = "flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-300 bg-secondary-blue text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]";
        } else {
            // Inactive state
            btn.className = "flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-300 text-white/50 hover:text-white hover:bg-white/5";
        }
    });

    // Immediately update calories (HCI: Real-time Feedback)
    updateCalculation();
}

// Update Calorie Calculation with animation (HCI: Visibility of System Status)
function updateCalculation() {
    const duration = parseInt(inputDuration.value) || 0;
    const calories = duration * intensityMultipliers[currentIntensity];
    
    // Animate the calorie change
    calcCalories.classList.add('scale-110', 'text-white');
    calcCalories.innerText = calories;
    setTimeout(() => {
        calcCalories.classList.remove('scale-110', 'text-white');
    }, 150);
}

// Listeners
searchInput.addEventListener('input', (e) => renderHistory(e.target.value));
inputDuration.addEventListener('input', updateCalculation);

// 5. SAVE FUNCTION with better validation feedback (HCI: Error Prevention, Help Users)
window.saveActivity = function() {
    // Validation with helpful messages
    if (!selectedActivity) {
        showError("Please select an activity first!", "Tap an activity from the list above");
        return;
    }

    const duration = parseInt(inputDuration.value) || 0;
    if (duration === 0) {
        showError("Please enter a duration", "How long did you do this activity?");
        inputDuration.focus();
        inputDuration.classList.add('ring-2', 'ring-danger');
        setTimeout(() => inputDuration.classList.remove('ring-2', 'ring-danger'), 2000);
        return;
    }

    const calories = duration * intensityMultipliers[currentIntensity];

    const activityData = {
        id: Date.now(),
        name: selectedActivity,
        detail: `${currentIntensity} · ${duration} mins`, 
        calories: calories
    };

    let appData = JSON.parse(localStorage.getItem('syncnergyData')) || { activities: [], workouts: [], hydration: [] };
    appData.activities.push(activityData);
    localStorage.setItem('syncnergyData', JSON.stringify(appData));

    // Success feedback before redirect
    showSuccess("Activity saved!");
    setTimeout(() => {
        window.location.href = 'log.html';
    }, 500);
}

// Helper: Show Error Toast (HCI: Error Messages)
function showError(title, subtitle = "") {
    const toast = document.getElementById('toast');
    if (!toast) return alert(title);
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-danger/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
                <p class="font-bold text-sm">${title}</p>
                ${subtitle ? `<p class="text-xs text-white/60">${subtitle}</p>` : ''}
            </div>
        </div>
    `;
    toast.className = "fixed top-20 left-4 right-4 max-w-md mx-auto bg-card-bg border border-danger/30 rounded-2xl p-4 shadow-xl z-50 animate-pulse";
    toast.classList.remove('hidden');
    
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Helper: Show Success Toast
function showSuccess(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p class="font-bold text-sm">${message}</p>
        </div>
    `;
    toast.className = "fixed top-20 left-4 right-4 max-w-md mx-auto bg-card-bg border border-green-500/30 rounded-2xl p-4 shadow-xl z-50";
    toast.classList.remove('hidden');
}

// Initialize with defaults
renderFrequent();
renderHistory();

// Pre-select Walking to show the UI state (HCI: Visibility - show users what's possible)
selectActivity('Walking', 30, 'Moderate');
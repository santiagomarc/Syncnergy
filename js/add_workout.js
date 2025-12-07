// WORKOUT LOGIC - Enhanced with HCI Principles

// 1. DATA SOURCES
const frequentExercises = ["Push-ups", "Bench Press", "Squats", "Bicep Curls"];
const historyExercises = [
    { name: "Bicep Curls", defaultSets: 3, defaultReps: 15, icon: "💪" },
    { name: "Mid Chest Fly", defaultSets: 3, defaultReps: 10, icon: "🦋" },
    { name: "Tricep Extensions", defaultSets: 3, defaultReps: 12, icon: "💪" },
    { name: "Shoulder Press", defaultSets: 4, defaultReps: 8, icon: "🏋️" },
    { name: "Leg Press", defaultSets: 3, defaultReps: 10, icon: "🦵" },
    { name: "Push-ups", defaultSets: 3, defaultReps: 15, icon: "🫸" },
    { name: "Squats", defaultSets: 4, defaultReps: 12, icon: "🦵" }
];

let selectedExercise = null;

// 2. DOM ELEMENTS
const frequentList = document.getElementById('frequentList');
const historyList = document.getElementById('historyList');
const searchInput = document.getElementById('searchInput');
const titleDisplay = document.getElementById('selectedExerciseTitle');
const inputSets = document.getElementById('inputSets');
const inputReps = document.getElementById('inputReps');
const inputWeight = document.getElementById('inputWeight');
const configCard = document.getElementById('configCard');
const warningMsg = document.getElementById('weightWarning');

// 3. RENDER FUNCTIONS

// Render Frequent Pills with icons (HCI: Recognition over Recall)
function renderFrequent() {
    const iconMap = { "Push-ups": "🫸", "Bench Press": "🏋️", "Squats": "🦵", "Bicep Curls": "💪" };
    frequentList.innerHTML = frequentExercises.map(ex => `
        <button onclick="selectExercise('${ex}')" 
            class="whitespace-nowrap px-4 py-2 bg-secondary-blue rounded-full text-xs font-bold text-white shadow-md hover:bg-blue-500 active:scale-95 transition-all flex items-center gap-1.5">
            <span>${iconMap[ex] || '💪'}</span>
            <span>${ex}</span>
        </button>
    `).join('');
}

// Render History List with better visual hierarchy (HCI: Visual Hierarchy, Affordance)
function renderHistory(filter = "") {
    const filtered = historyExercises.filter(ex => ex.name.toLowerCase().includes(filter.toLowerCase()));
    
    if (filtered.length === 0) {
        historyList.innerHTML = `
            <div class="text-center py-8">
                <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>
                <p class="text-white/40 text-sm font-medium">No exercises found</p>
                <p class="text-white/20 text-xs mt-1">Try a different search term</p>
            </div>`;
        return;
    }

    historyList.innerHTML = filtered.map(ex => `
        <div onclick="selectExercise('${ex.name}', ${ex.defaultSets}, ${ex.defaultReps})" 
             class="group flex items-center justify-between py-3 cursor-pointer hover:bg-white/5 rounded-xl px-3 -mx-2 transition-all duration-200 active:scale-[0.98]">
            <div class="flex items-center gap-3">
                <span class="text-lg">${ex.icon}</span>
                <div>
                    <span class="font-bold text-sm group-hover:text-primary-yellow transition-colors block">${ex.name}</span>
                    <span class="text-[10px] text-white/40">${ex.defaultSets} sets × ${ex.defaultReps} reps</span>
                </div>
            </div>
            <div class="w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-primary-yellow group-hover:bg-primary-yellow group-hover:text-app-bg transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
            </div>
        </div>
    `).join('');
}

// 4. INTERACTION LOGIC

// Select Exercise with visual feedback (HCI: Feedback, Visibility)
window.selectExercise = function(name, sets = 3, reps = 10) {
    selectedExercise = name;
    
    // Update title with animation
    titleDisplay.classList.add('scale-105');
    titleDisplay.innerText = name;
    setTimeout(() => titleDisplay.classList.remove('scale-105'), 200);
    
    // Fill in values
    inputSets.value = sets;
    inputReps.value = reps;
    
    // Highlight config card briefly (HCI: Feedback)
    configCard.classList.add('ring-2', 'ring-primary-yellow/50');
    setTimeout(() => configCard.classList.remove('ring-2', 'ring-primary-yellow/50'), 800);
    
    // Smooth scroll to config
    configCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Clear search if used
    if(searchInput.value) {
        searchInput.value = '';
        renderHistory();
    }
}

// Search Listener
searchInput.addEventListener('input', (e) => {
    renderHistory(e.target.value);
});

// Weight Warning Logic (HCI: Error Prevention)
inputWeight.addEventListener('input', (e) => {
    if (parseInt(e.target.value) > 80) {
        warningMsg.classList.remove('hidden');
    } else {
        warningMsg.classList.add('hidden');
    }
});

// 5. SAVE FUNCTION with toast feedback (HCI: System Feedback)
window.saveWorkout = function() {
    if (!selectedExercise) {
        showError("Please select an exercise first!", "Tap an exercise from the list above");
        return;
    }

    const sets = parseInt(inputSets.value) || 3;
    const reps = parseInt(inputReps.value) || 10;
    const weight = inputWeight.value || '';

    const workoutData = {
        id: Date.now(),
        name: selectedExercise,
        detail: `${sets} sets · ${reps} reps${weight ? ' · ' + weight + 'kg' : ''}`,
        completed: 0,
        total: sets,
        notes: ''
    };

    let appData = JSON.parse(localStorage.getItem('syncnergyData')) || { activities: [], workouts: [], hydration: [] };
    appData.workouts.push(workoutData);
    localStorage.setItem('syncnergyData', JSON.stringify(appData));

    showSuccess("Workout saved! 💪");
    setTimeout(() => {
        navigateApp('log.html');
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

// Initialize
renderFrequent();
renderHistory();

// Auto-focus search input for immediate typing (HCI: Efficiency)
setTimeout(() => {
    if (searchInput) searchInput.focus();
}, 100);

selectExercise('Bicep Curls', 3, 15);
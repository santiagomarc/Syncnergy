// LOG SCREEN LOGIC

// ========================================
// 0. DATE MANAGEMENT
// ========================================
let currentDate = new Date();
let calendarViewDate = new Date();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];
const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateDisplay(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'TODAY';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'YESTERDAY';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'TOMORROW';
    } else {
        return `${monthsShort[date.getMonth()].toUpperCase()} ${date.getDate()}`;
    }
}

function updateDateDisplay() {
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
        dateDisplay.textContent = formatDateDisplay(currentDate);
    }
}

// ========================================
// 1. CALENDAR PICKER
// ========================================
const calendarModal = document.getElementById('calendarModal');
const calendarModalContent = document.getElementById('calendarModalContent');
const calendarGrid = document.getElementById('calendarGrid');
const calMonthYear = document.getElementById('calMonthYear');

function showCalendarModal() {
    calendarViewDate = new Date(currentDate);
    renderCalendar();
    
    calendarModal.classList.remove('opacity-0', 'pointer-events-none');
    calendarModal.classList.add('opacity-100');
    setTimeout(() => {
        calendarModalContent.classList.remove('scale-95');
        calendarModalContent.classList.add('scale-100');
    }, 10);
}

function hideCalendarModal() {
    calendarModalContent.classList.remove('scale-100');
    calendarModalContent.classList.add('scale-95');
    setTimeout(() => {
        calendarModal.classList.remove('opacity-100');
        calendarModal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
}

function renderCalendar() {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    
    // Update header
    calMonthYear.textContent = `${months[month]} ${year}`;
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get today for comparison
    const today = new Date();
    
    let html = '';
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="h-10"></div>`;
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateToCheck = new Date(year, month, day);
        const isToday = dateToCheck.toDateString() === today.toDateString();
        const isSelected = dateToCheck.toDateString() === currentDate.toDateString();
        const isFuture = dateToCheck > today;
        
        let classes = 'h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer mx-auto ';
        
        if (isSelected) {
            classes += 'bg-primary-yellow text-app-bg';
        } else if (isToday) {
            classes += 'bg-secondary-blue/30 text-secondary-blue border-2 border-secondary-blue';
        } else if (isFuture) {
            // Future dates - allow selection but style differently
            classes += 'text-white/50 hover:bg-white/10';
        } else {
            classes += 'text-white hover:bg-white/10';
        }
        
        html += `<div class="${classes}" onclick="selectDate(${year}, ${month}, ${day})">${day}</div>`;
    }
    
    calendarGrid.innerHTML = html;
}

window.selectDate = function(year, month, day) {
    currentDate = new Date(year, month, day);
    updateDateDisplay();
    hideCalendarModal();
    // In a real app, you'd filter data for this date here
    renderAll();
};

// Calendar navigation
document.getElementById('calPrevMonth')?.addEventListener('click', () => {
    calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('calNextMonth')?.addEventListener('click', () => {
    calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('calToday')?.addEventListener('click', () => {
    currentDate = new Date();
    calendarViewDate = new Date();
    updateDateDisplay();
    hideCalendarModal();
    renderAll();
});

document.getElementById('calClose')?.addEventListener('click', hideCalendarModal);

// Close on backdrop click
calendarModal?.addEventListener('click', (e) => {
    if (e.target === calendarModal) {
        hideCalendarModal();
    }
});

// Open calendar on date picker button click
document.getElementById('datePickerBtn')?.addEventListener('click', showCalendarModal);

// Prev/Next date navigation
document.getElementById('prevDate')?.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
    renderAll();
});

document.getElementById('nextDate')?.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
    renderAll();
});

// ========================================
// 2. LOAD DATA
// ========================================
function loadData() {
    const stored = localStorage.getItem('syncnergyData');
    if (stored) {
        return JSON.parse(stored);
    }
    const initialData = {
        activities: [
            { id: 1, name: "Walking", detail: "6:00 AM-7:00 AM - Moderate", calories: 210 },
            { id: 2, name: "Biking", detail: "4:00 PM-5:30 PM - High intensity", calories: 260 }
        ],
        workouts: [
            { id: 3, name: "Bicep Curls", detail: "15 reps - Moderate intensity", completed: 2, total: 5, notes: "Felt good" },
            { id: 4, name: "Chest Flies", detail: "10 reps - Low intensity", completed: 3, total: 3, notes: "" },
            { id: 5, name: "Push-ups", detail: "15 reps - High intensity", completed: 0, total: 3, warning: true, notes: "" }
        ],
        hydration: [
            { id: 6, name: "2.0 L", detail: "Morning", amount: 2.0 }
        ]
    };
    localStorage.setItem('syncnergyData', JSON.stringify(initialData));
    return initialData;
}

let appData = loadData();
let isEditMode = false;

// 2. DOM ELEMENTS
const editBtn = document.getElementById('editToggleBtn');
const dateDisplay = document.getElementById('dateDisplay');

// 3. FUNCTIONS

function calculateTotals() {
    // Activities - Total Calories
    const totalCals = appData.activities.reduce((sum, item) => sum + (parseInt(item.calories) || 0), 0);
    const activityBurnEl = document.querySelector('#activityList')?.previousElementSibling?.querySelector('span.font-bold');
    if(activityBurnEl) activityBurnEl.innerText = `${totalCals} kcal`;
    
    // Workouts - Sets completed
    const totalWorkoutSets = appData.workouts.reduce((sum, item) => sum + item.total, 0);
    const completedSets = appData.workouts.reduce((sum, item) => sum + item.completed, 0);
    
    // Hydration - Total water
    const totalWater = appData.hydration.reduce((sum, item) => sum + item.amount, 0);
    const hydrationTotalEl = document.querySelector('#hydrationList')?.previousElementSibling?.querySelector('span.font-medium');
    if(hydrationTotalEl) hydrationTotalEl.innerText = `${totalWater.toFixed(1)} L`;
    
    // Update Summary Section (HCI: Real-time Feedback)
    updateSummary(totalCals, completedSets, totalWorkoutSets, totalWater);
}

// Dynamic Summary Update (HCI: Visibility of System Status)
function updateSummary(calories, completedSets, totalSets, water) {
    const summaryCalories = document.getElementById('summaryCalories');
    const summaryWorkouts = document.getElementById('summaryWorkouts');
    const summaryWater = document.getElementById('summaryWater');
    const summaryMessage = document.getElementById('summaryMessage');
    
    if (summaryCalories) summaryCalories.innerText = calories;
    if (summaryWorkouts) summaryWorkouts.innerText = `${completedSets}/${totalSets}`;
    if (summaryWater) summaryWater.innerText = `${water.toFixed(1)} L`;
    
    // Calculate overall progress for encouraging message (HCI: Emotional Design)
    const calorieGoal = 500;
    const waterGoal = 3.0;
    
    const calorieProgress = Math.min(calories / calorieGoal, 1);
    const workoutProgress = totalSets > 0 ? completedSets / totalSets : 0;
    const waterProgress = Math.min(water / waterGoal, 1);
    const overallProgress = (calorieProgress + workoutProgress + waterProgress) / 3;
    
    if (summaryMessage) {
        let message = "";
        let emoji = "";
        
        if (overallProgress >= 0.9) {
            message = "Outstanding! You crushed it today!";
            emoji = "🏆";
        } else if (overallProgress >= 0.7) {
            message = "Great progress! Almost there!";
            emoji = "🔥";
        } else if (overallProgress >= 0.5) {
            message = "You're halfway there! Keep going!";
            emoji = "💪";
        } else if (overallProgress >= 0.25) {
            message = "Good start! Let's build momentum!";
            emoji = "🚀";
        } else {
            message = "Every journey starts with a step!";
            emoji = "✨";
        }
        
        summaryMessage.innerHTML = `<p class="text-xs text-white/60 font-medium">${message} ${emoji}</p>`;
    }
}

// Render Activity Item
function renderActivity(item) {
    return `
    <div class="flex items-center justify-between group-item animate-fade-in py-3 border-b border-white/5 last:border-0" id="item-${item.id}">
        <div class="flex items-center gap-3 overflow-hidden">
            <button onclick="deleteItem(${item.id}, 'activities')" class="delete-btn hidden text-white/50 hover:text-danger transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div>
                <h4 class="text-primary-yellow font-black text-base tracking-tight">${item.name}</h4>
                <p class="text-white/80 text-xs font-bold">${item.detail}</p>
            </div>
        </div>
        <span class="text-white font-bold text-sm">${item.calories} kcal</span>
    </div>`;
}

// --- WORKOUT RENDERER (Updated visuals & controls) ---
function renderWorkout(item) {
    const isFinished = item.completed === item.total;
    const valueColor = item.warning ? 'text-white/50 text-xs font-medium' : 'text-primary-yellow font-bold text-sm';
    
    // Create Set Bubbles
    let bubbles = '';
    for (let i = 1; i <= item.total; i++) {
        const isCompleted = i <= item.completed;
        const bgClass = isCompleted ? 'bg-primary-yellow border-primary-yellow' : 'border-white/30 hover:border-primary-yellow';
        const textClass = isCompleted ? 'text-app-bg' : 'text-transparent';
        
        bubbles += `
            <button onclick="toggleSet(${item.id}, ${i})" 
                class="w-6 h-6 rounded-full border-2 ${bgClass} flex items-center justify-center transition-all text-[10px] font-black ${textClass}">
                ✓
            </button>
        `;
    }

    // Notes Section (Only if finished OR if note already exists)
    let notesHtml = '';
    if (isFinished || item.notes) {
        if (item.notes) {
            // Display existing note
            notesHtml = `
            <div class="mt-2 flex items-start gap-2 pl-2 border-l-2 border-white/20">
                <p class="text-xs text-white/60 italic font-medium leading-tight">"${item.notes}"</p>
                <button onclick="editNote(${item.id})" class="text-white/30 hover:text-white">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
            </div>`;
        } else {
            // Show "Add Note" button
            notesHtml = `
            <div class="mt-2">
                <button onclick="addNotePrompt(${item.id})" class="text-[10px] font-bold text-primary-yellow hover:underline flex items-center gap-1">
                    + Add Note
                </button>
            </div>`;
        }
    }
    
    return `
    <div class="flex flex-col group-item animate-fade-in py-3 border-b border-white/5 last:border-0" id="item-${item.id}">
        <div class="flex items-start gap-3 w-full">
            <button onclick="deleteItem(${item.id}, 'workouts')" class="delete-btn hidden text-white/50 hover:text-danger transition-colors mt-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            
            <div class="w-full pr-2">
                <div class="flex justify-between items-center mb-1">
                    <h4 class="text-primary-yellow font-black text-base tracking-tight">${item.name}</h4>
                    <span class="${valueColor} whitespace-nowrap ml-2">${item.completed}/${item.total}</span>
                </div>
                
                <p class="text-white/90 text-xs font-bold mb-2">${item.detail}</p>
                
                <!-- Interactive Controls -->
                <div class="flex items-center justify-between">
                    <!-- Bubbles -->
                    <div class="flex gap-1.5">
                        ${bubbles}
                    </div>

                    <!-- Plus/Minus Controls -->
                    <div class="flex items-center gap-3 bg-app-bg/30 rounded-full px-2 py-1">
                        <button onclick="modifySet(${item.id}, -1)" class="text-white hover:text-white/70 font-bold text-lg leading-none px-1">−</button>
                        <button onclick="modifySet(${item.id}, 1)" class="text-primary-yellow hover:text-yellow-300 font-bold text-lg leading-none px-1">+</button>
                    </div>
                </div>

                ${notesHtml}
            </div>
        </div>
    </div>`;
}

// Render Hydration Item
function renderHydration(item) {
    return `
    <div class="flex items-center justify-between group-item animate-fade-in py-3 border-b border-white/5 last:border-0" id="item-${item.id}">
        <div class="flex items-center gap-3">
            <button onclick="deleteItem(${item.id}, 'hydration')" class="delete-btn hidden text-white/50 hover:text-danger transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div>
                <h4 class="text-secondary-blue font-black text-base tracking-tight">${item.name}</h4>
                <p class="text-white/80 text-xs font-bold">${item.detail}</p>
            </div>
        </div>
    </div>`;
}

function isToday() {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
}

function renderEmptyState(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-6 text-center animate-fade-in-up">
                <svg class="w-10 h-10 text-white/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p class="text-white/40 text-sm font-medium">${message}</p>
            </div>`;
    }
}

// Skeleton loading state (HCI: Perceived Performance)
function showLoadingState(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center gap-3 py-3">
                    <div class="skeleton w-10 h-10 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                        <div class="skeleton h-4 w-3/4 rounded"></div>
                        <div class="skeleton h-3 w-1/2 rounded"></div>
                    </div>
                </div>
                <div class="flex items-center gap-3 py-3">
                    <div class="skeleton w-10 h-10 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                        <div class="skeleton h-4 w-2/3 rounded"></div>
                        <div class="skeleton h-3 w-1/3 rounded"></div>
                    </div>
                </div>
            </div>`;
    }
}

function renderAll() {
    const today = new Date();
    const viewingToday = currentDate.toDateString() === today.toDateString();
    
    if (viewingToday) {
        // Show actual data for today
        appData = loadData();
        document.getElementById('activityList').innerHTML = appData.activities.map(renderActivity).join('');
        document.getElementById('workoutList').innerHTML = appData.workouts.map(renderWorkout).join('');
        document.getElementById('hydrationList').innerHTML = appData.hydration.map(renderHydration).join('');
        
        calculateTotals();
        updateEditState();
    } else {
        // Show empty state for other dates
        const isFutureDate = currentDate > today;
        const emptyMessage = isFutureDate 
            ? 'Nothing scheduled yet' 
            : 'No entries logged';
        
        renderEmptyState('activityList', emptyMessage);
        renderEmptyState('workoutList', emptyMessage);
        renderEmptyState('hydrationList', emptyMessage);
        
        // Reset summary for empty state
        updateSummary(0, 0, 0, 0);
    }
}

// INTERACTION LOGIC

// Direct Bubble Click
window.toggleSet = function(id, setIndex) {
    const workout = appData.workouts.find(w => w.id === id);
    if (workout) {
        const wasComplete = workout.completed === workout.total;
        
        if (workout.completed === setIndex) {
            workout.completed = setIndex - 1; // Toggle off
        } else {
            workout.completed = setIndex; // Toggle on up to this point
        }
        
        saveAndRender();
        
        // Celebrate if just completed all sets
        if (!wasComplete && workout.completed === workout.total) {
            checkWorkoutCompletion(workout);
        }
    }
}

// Plus/Minus Buttons
window.modifySet = function(id, change) {
    const workout = appData.workouts.find(w => w.id === id);
    if (workout) {
        const wasComplete = workout.completed === workout.total;
        const newVal = workout.completed + change;
        
        if (newVal >= 0 && newVal <= workout.total) {
            workout.completed = newVal;
            saveAndRender();
            
            // Celebrate if just completed all sets
            if (!wasComplete && workout.completed === workout.total) {
                checkWorkoutCompletion(workout);
            }
        }
    }
}

// Notes Logic
window.addNotePrompt = function(id) {
    const note = prompt("How did the workout feel?");
    if (note) {
        const workout = appData.workouts.find(w => w.id === id);
        if(workout) {
            workout.notes = note;
            saveAndRender();
        }
    }
}

window.editNote = function(id) {
    const workout = appData.workouts.find(w => w.id === id);
    if(workout) {
        const note = prompt("Update note:", workout.notes);
        if (note !== null) {
            workout.notes = note; // Empty string removes it
            saveAndRender();
        }
    }
}

function saveAndRender() {
    localStorage.setItem('syncnergyData', JSON.stringify(appData));
    renderAll();
}

// Toggle Edit Mode
editBtn.addEventListener('click', () => {
    isEditMode = !isEditMode;
    if(isEditMode) {
        editBtn.classList.add('text-primary-yellow');
        editBtn.classList.remove('text-white');
    } else {
        editBtn.classList.add('text-white');
        editBtn.classList.remove('text-primary-yellow');
    }
    updateEditState();
});

function updateEditState() {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        if (isEditMode) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });
}

window.deleteItem = function(id, type) {
    // HCI: Error Prevention - Show confirmation modal
    pendingDelete = { id, type };
    showDeleteModal(type);
}

// ========================================
// DELETE CONFIRMATION SYSTEM (HCI: Error Prevention)
// ========================================
let pendingDelete = null;
let deletedItemBackup = null;
let undoTimeout = null;

const deleteModal = document.getElementById('deleteModal');
const deleteModalContent = document.getElementById('deleteModalContent');
const deleteModalTitle = document.getElementById('deleteModalTitle');
const deleteModalDesc = document.getElementById('deleteModalDesc');

function showDeleteModal(type) {
    const typeNames = {
        activities: 'Activity',
        workouts: 'Workout',
        hydration: 'Hydration Entry'
    };
    
    deleteModalTitle.textContent = `Delete ${typeNames[type]}?`;
    deleteModalDesc.textContent = `This will remove the ${typeNames[type].toLowerCase()} from your log. You can undo this action.`;
    
    deleteModal.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        deleteModalContent.classList.remove('scale-95');
        deleteModalContent.classList.add('scale-100');
    }, 10);
}

window.hideDeleteModal = function() {
    deleteModalContent.classList.remove('scale-100');
    deleteModalContent.classList.add('scale-95');
    setTimeout(() => {
        deleteModal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
    pendingDelete = null;
}

window.confirmDelete = function() {
    if (!pendingDelete) return;
    
    const { id, type } = pendingDelete;
    const itemToDelete = appData[type].find(item => item.id === id);
    
    // Backup for undo
    deletedItemBackup = { item: { ...itemToDelete }, type };
    
    // Remove item
    appData[type] = appData[type].filter(item => item.id !== id);
    saveAndRender();
    
    hideDeleteModal();
    showUndoToast(type);
}

// ========================================
// UNDO SYSTEM (HCI: Error Recovery)
// ========================================
const undoToast = document.getElementById('undoToast');
const undoMessage = document.getElementById('undoMessage');

function showUndoToast(type) {
    const typeNames = {
        activities: 'Activity',
        workouts: 'Workout', 
        hydration: 'Hydration entry'
    };
    
    undoMessage.textContent = `${typeNames[type]} deleted`;
    undoToast.classList.remove('opacity-0', 'pointer-events-none');
    undoToast.classList.add('opacity-100');
    
    // Auto-hide after 5 seconds
    if (undoTimeout) clearTimeout(undoTimeout);
    undoTimeout = setTimeout(() => {
        hideUndoToast();
        deletedItemBackup = null;
    }, 5000);
}

window.hideUndoToast = function() {
    undoToast.classList.remove('opacity-100');
    undoToast.classList.add('opacity-0', 'pointer-events-none');
    if (undoTimeout) clearTimeout(undoTimeout);
}

window.undoDelete = function() {
    if (!deletedItemBackup) return;
    
    const { item, type } = deletedItemBackup;
    appData[type].push(item);
    saveAndRender();
    
    hideUndoToast();
    deletedItemBackup = null;
    
    // Show confirmation
    showCelebration('✅', 'Restored!');
}

// ========================================
// CELEBRATION SYSTEM (HCI: Positive Feedback)
// ========================================
const celebrationOverlay = document.getElementById('celebrationOverlay');
const celebrationContent = document.getElementById('celebrationContent');
const celebrationEmoji = document.getElementById('celebrationEmoji');
const celebrationText = document.getElementById('celebrationText');

function showCelebration(emoji, text) {
    celebrationEmoji.textContent = emoji;
    celebrationText.textContent = text;
    
    celebrationOverlay.classList.remove('opacity-0');
    celebrationOverlay.classList.add('opacity-100');
    
    setTimeout(() => {
        celebrationContent.classList.remove('scale-0');
        celebrationContent.classList.add('scale-100');
    }, 50);
    
    setTimeout(() => {
        celebrationContent.classList.remove('scale-100');
        celebrationContent.classList.add('scale-0');
        setTimeout(() => {
            celebrationOverlay.classList.remove('opacity-100');
            celebrationOverlay.classList.add('opacity-0');
        }, 300);
    }, 1200);
}

// Check for workout completion and celebrate
function checkWorkoutCompletion(workout) {
    if (workout.completed === workout.total && workout.completed > 0) {
        showCelebration('🎉', `${workout.name} Complete!`);
    }
}

// Initialize date display
updateDateDisplay();

renderAll();
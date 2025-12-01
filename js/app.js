// Syncnergy Fitness App - JavaScript Interactivity
// Demonstrates HCI Principles: Visibility, Feedback, Affordance, Usability

// ========================================
// 0. DATA & GOALS MANAGEMENT
// ========================================
const defaultGoals = {
    steps: 10000,
    calories: 2000,
    workout: 60
};

function getGoals() {
    const stored = localStorage.getItem('syncnergyGoals');
    return stored ? JSON.parse(stored) : { ...defaultGoals };
}

function saveGoals(goals) {
    localStorage.setItem('syncnergyGoals', JSON.stringify(goals));
}

// ========================================
// 1. SMART INSIGHTS (Mock Data for Demo)
// ========================================
function renderInsights() {
    const container = document.getElementById('insightsContainer');
    if (!container) return;
    
    const goals = getGoals();
    
    // Mock data insights for demo - showcases HCI principle of personalized feedback
    const insights = [
        {
            icon: '🔥',
            title: "You're on track!",
            text: `70% of your daily ${goals.calories.toLocaleString()} calorie burn achieved.`
        },
        {
            icon: '🏃',
            title: 'Step Boost!',
            text: `You walked 2.3 km today — that's +18% from yesterday!`
        },
        {
            icon: '🏆',
            title: 'Streak: 5 Days Active!',
            text: 'Keep your momentum going!'
        },
        {
            icon: '💧',
            title: 'Hydration Check',
            text: "You've logged 5/8 glasses of water — keep it up!"
        }
    ];
    
    container.innerHTML = insights.map(insight => `
        <div class="flex items-start gap-4">
            <span class="text-xl flex-shrink-0">${insight.icon}</span>
            <div class="flex-1">
                <h4 class="text-primary-yellow text-xs font-semibold">${insight.title}</h4>
                <p class="text-white text-xs">${insight.text}</p>
            </div>
        </div>
    `).join('');
}

// ========================================
// 2. STATS CAROUSEL - Scroll Snap & Page Indicators
// ========================================
const carouselScroll = document.getElementById('carouselScroll');
const indicators = document.querySelectorAll('.indicator');

// Update active indicator based on scroll position
function updateIndicators() {
    if (!carouselScroll) return;
    
    const scrollLeft = carouselScroll.scrollLeft;
    const itemWidth = carouselScroll.offsetWidth;
    const currentIndex = Math.round(scrollLeft / itemWidth);
    
    // Update indicators - set active one to full opacity, others to 30%
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.remove('bg-white/30');
            indicator.classList.add('bg-white');
        } else {
            indicator.classList.remove('bg-white');
            indicator.classList.add('bg-white/30');
        }
    });
}

// Listen to scroll events - instant update for better responsiveness
let scrollTimeout;
carouselScroll?.addEventListener('scroll', () => {
    // Instant update for better responsiveness
    updateIndicators();
    
    // Snap to nearest card after scroll stops
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        if (!carouselScroll) return;
        const scrollLeft = carouselScroll.scrollLeft;
        const itemWidth = carouselScroll.offsetWidth;
        const currentIndex = Math.round(scrollLeft / itemWidth);
        carouselScroll.scrollTo({
            left: currentIndex * itemWidth,
            behavior: 'smooth'
        });
    }, 100);
}, { passive: true });

// Initial update
updateIndicators();

// Click indicators to scroll to specific card
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        if (!carouselScroll) return;
        const itemWidth = carouselScroll.offsetWidth;
        carouselScroll.scrollTo({
            left: itemWidth * index,
            behavior: 'smooth'
        });
    });
});

// Touch swipe support for mobile (already handled by scroll-snap, but adding smooth behavior)
let startX = 0;
let scrollStart = 0;

carouselScroll?.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollStart = carouselScroll.scrollLeft;
});

// ========================================
// 3. BOTTOM NAVIGATION - Active State Management with Modals
// ========================================
const navButtons = document.querySelectorAll('.nav-btn');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get the nav type
        const navType = button.getAttribute('data-nav');
        
        // Navigate to log.html for list button
        if (navType === 'list') {
            window.location.href = 'log.html';
            return;
        }
        // Navigate to stats.html for stats button
        if (navType === 'stats') {
            window.location.href = 'stats.html';
            return;
        }
        
        // Remove active class from all buttons
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const navName = navType.charAt(0).toUpperCase() + navType.slice(1);
        
        // Show modal for navigation
        let message = '';
        if (navType === 'home') {
            message = 'View your daily dashboard with activity summary, insights, and quick actions.';
        } else if (navType === 'stats') {
            message = 'Explore detailed statistics, charts, and progress over time.';
        } else if (navType === 'profile') {
            message = 'Manage your account settings, goals, and personal information.';
        }
        
        showModal(navName, message, () => {
            showToast(`Navigated to ${navName}`);
        });
    });
});

// Set Home as active by default
if (navButtons[0]) navButtons[0].classList.add('active');

// ========================================
// 4. QUICK ACTIONS - Button Clicks with Modal Dialogs
// ========================================
const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const actionName = button.getAttribute('data-action');
        
        // Visual feedback: Brief scale animation (already in CSS with active state)
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Show modal dialog based on action
        let message = '';
        if (actionName === 'Log Activity') {
            message = 'Track your daily steps, distance, and flights climbed. This will help you meet your daily movement goals!';
        } else if (actionName === 'Log Workout') {
            message = 'Record your gym sessions, runs, or home workouts. Choose from cardio, strength training, or flexibility exercises.';
        } else if (actionName === 'Add Water') {
            message = 'Stay hydrated! Track your water intake to reach your daily hydration goal of 8 glasses.';
        }
        
        showModal(actionName, message, () => {
            showToast(`${actionName} confirmed!`);
        });
    });
});

// ========================================
// 5. MODAL DIALOG SYSTEM
// ========================================
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');
let modalConfirmCallback = null;

function showModal(title, message, onConfirm) {
    if (!modal || !modalTitle || !modalMessage) return;
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalConfirmCallback = onConfirm;
    
    // Show modal
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    setTimeout(() => {
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);
}

function hideModal() {
    if (!modal || !modalContent) return;
    
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
}

modalCancel?.addEventListener('click', hideModal);

modalConfirm?.addEventListener('click', () => {
    if (modalConfirmCallback) {
        modalConfirmCallback();
    }
    hideModal();
});

// Close modal when clicking outside
modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});

// ========================================
// 6. TOAST NOTIFICATION SYSTEM
// ========================================
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
let toastTimeout;

function showToast(message, duration = 2500) {
    // Clear any existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    // Set message and show toast
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');
    
    // Hide after duration
    toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
    }, duration);
}

// ========================================
// 7. GOAL EDITING SYSTEM
// ========================================
const goalModal = document.getElementById('goalModal');
const goalModalContent = document.getElementById('goalModalContent');
const goalModalTitle = document.getElementById('goalModalTitle');
const goalModalIcon = document.getElementById('goalModalIcon');
const goalInput = document.getElementById('goalInput');
const goalUnit = document.getElementById('goalUnit');
let currentEditingGoal = null;

const goalConfig = {
    steps: { icon: '👟', title: 'Daily Steps Goal', unit: 'steps per day', min: 1000, max: 50000 },
    calories: { icon: '🔥', title: 'Calorie Burn Goal', unit: 'calories per day', min: 500, max: 5000 },
    workout: { icon: '⏱️', title: 'Active Minutes Goal', unit: 'minutes per day', min: 10, max: 180 }
};

function showGoalModal(goalType, currentValue) {
    const config = goalConfig[goalType];
    if (!config || !goalModal || !goalModalContent) return;
    
    currentEditingGoal = goalType;
    if (goalModalIcon) goalModalIcon.textContent = config.icon;
    if (goalModalTitle) goalModalTitle.textContent = config.title;
    if (goalUnit) goalUnit.textContent = config.unit;
    if (goalInput) {
        goalInput.value = currentValue;
        goalInput.min = config.min;
        goalInput.max = config.max;
    }
    
    // Show modal
    goalModal.classList.remove('opacity-0', 'pointer-events-none');
    goalModal.classList.add('opacity-100');
    setTimeout(() => {
        goalModalContent.classList.remove('scale-95');
        goalModalContent.classList.add('scale-100');
        if (goalInput) {
            goalInput.focus();
            goalInput.select();
        }
    }, 10);
}

function hideGoalModal() {
    if (!goalModal || !goalModalContent) return;
    
    goalModalContent.classList.remove('scale-100');
    goalModalContent.classList.add('scale-95');
    setTimeout(() => {
        goalModal.classList.remove('opacity-100');
        goalModal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
    currentEditingGoal = null;
}

function saveGoal() {
    if (!currentEditingGoal) return;
    
    const newValue = parseInt(goalInput.value);
    const config = goalConfig[currentEditingGoal];
    
    if (isNaN(newValue) || newValue < config.min || newValue > config.max) {
        showToast(`Please enter a value between ${config.min} and ${config.max}`, 3000);
        return;
    }
    
    // Save to localStorage
    const goals = getGoals();
    goals[currentEditingGoal] = newValue;
    saveGoals(goals);
    
    // Update UI
    updateGoalDisplays();
    renderInsights();
    
    hideGoalModal();
    showToast(`${goalConfig[currentEditingGoal].title} updated to ${newValue.toLocaleString()}!`);
}

function updateGoalDisplays() {
    const goals = getGoals();
    
    // Update step goal display
    const stepsGoalEl = document.getElementById('stepsGoalDisplay');
    if (stepsGoalEl) stepsGoalEl.textContent = `${goals.steps.toLocaleString()} steps`;
    
    // Update calories goal display
    const caloriesGoalEl = document.getElementById('caloriesGoalDisplay');
    if (caloriesGoalEl) caloriesGoalEl.textContent = `${goals.calories.toLocaleString()} calories`;
    
    // Update workout goal display
    const workoutGoalEl = document.getElementById('workoutGoalDisplay');
    if (workoutGoalEl) workoutGoalEl.textContent = `${goals.workout} minutes`;
    
    // Update button data attributes
    document.querySelectorAll('.edit-goal-btn').forEach(btn => {
        const type = btn.dataset.goalType;
        if (goals[type]) {
            btn.dataset.current = goals[type];
        }
    });
}

// Close goal modal on backdrop click
if (goalModal) {
    goalModal.addEventListener('click', (e) => {
        if (e.target === goalModal) {
            hideGoalModal();
        }
    });
}

// Enter key to save goal
if (goalInput) {
    goalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveGoal();
        }
    });
}

// ========================================
// 8. SMOOTH SCROLLING & USABILITY
// ========================================
// Ensure smooth scrolling is enabled
document.documentElement.style.scrollBehavior = 'smooth';

// ========================================
// 9. KEYBOARD ACCESSIBILITY (HCI Best Practice)
// ========================================
// Allow keyboard navigation for carousel
carouselScroll?.addEventListener('keydown', (e) => {
    if (!carouselScroll) return;
    const itemWidth = carouselScroll.offsetWidth;
    const currentScroll = carouselScroll.scrollLeft;
    
    if (e.key === 'ArrowLeft') {
        carouselScroll.scrollTo({
            left: currentScroll - itemWidth,
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowRight') {
        carouselScroll.scrollTo({
            left: currentScroll + itemWidth,
            behavior: 'smooth'
        });
    }
});

// ========================================
// 10. RESPONSIVE TOUCH FEEDBACK
// ========================================
// Add subtle visual feedback for all interactive elements
const interactiveElements = document.querySelectorAll('button, .action-btn');

interactiveElements.forEach(element => {
    element.addEventListener('touchstart', () => {
        element.style.opacity = '0.8';
    });
    
    element.addEventListener('touchend', () => {
        element.style.opacity = '1';
    });
});

// ========================================
// 11. ONBOARDING SYSTEM (HCI: Help & Documentation)
// ========================================
const onboardingModal = document.getElementById('onboardingModal');
const onboardingContent = document.getElementById('onboardingContent');

function showOnboarding() {
    if (!onboardingModal) return;
    
    onboardingModal.classList.remove('opacity-0', 'pointer-events-none');
    onboardingModal.classList.add('opacity-100');
    setTimeout(() => {
        onboardingContent.classList.remove('scale-95');
        onboardingContent.classList.add('scale-100');
    }, 10);
}

window.dismissOnboarding = function() {
    if (!onboardingModal || !onboardingContent) return;
    
    const dontShowAgain = document.getElementById('dontShowAgain');
    if (dontShowAgain && dontShowAgain.checked) {
        localStorage.setItem('syncnergyOnboardingDone', 'true');
    }
    
    onboardingContent.classList.remove('scale-100');
    onboardingContent.classList.add('scale-95');
    setTimeout(() => {
        onboardingModal.classList.remove('opacity-100');
        onboardingModal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
}

function checkOnboarding() {
    const hasSeenOnboarding = localStorage.getItem('syncnergyOnboardingDone');
    if (!hasSeenOnboarding) {
        setTimeout(() => showOnboarding(), 1000);
    }
}

// ========================================
// 12. INITIALIZE APP
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Syncnergy Fitness App Loaded');
    console.log('HCI Principles Applied:');
    console.log('✓ Visibility - Clear UI elements with proper hierarchy');
    console.log('✓ Feedback - Toast notifications and visual responses');
    console.log('✓ Affordance - Hover states and button designs indicate clickability');
    console.log('✓ Usability - Intuitive navigation and smooth interactions');
    console.log('✓ Error Prevention - Confirmation dialogs for destructive actions');
    console.log('✓ Error Recovery - Undo functionality for deletions');
    console.log('✓ Help & Documentation - Onboarding hints for new users');

    // Initialize goal displays from localStorage
    updateGoalDisplays();

    // Render smart insights based on user data
    renderInsights();

    // Initialize edit goal button handlers
    document.querySelectorAll('.edit-goal-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const goalType = button.dataset.goalType;
            const currentValue = parseInt(button.dataset.current);
            console.log('Edit goal clicked:', goalType, currentValue);
            showGoalModal(goalType, currentValue);
        });
    });

    // Check for first-time user onboarding
    checkOnboarding();

    // Welcome message (only if not showing onboarding)
    const hasSeenOnboarding = localStorage.getItem('syncnergyOnboardingDone');
    if (hasSeenOnboarding) {
        setTimeout(() => {
            showToast('Welcome back! 🔥', 2500);
        }, 500);
    }
});

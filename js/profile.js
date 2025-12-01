// PROFILE SCREEN LOGIC - Enhanced with HCI Principles

// 1. DOM ELEMENTS
const editBtn = document.getElementById('editBtn');
const screenTitle = document.getElementById('screenTitle');
const bottomNav = document.getElementById('bottomNav');
const editActionBar = document.getElementById('editActionBar');
const settingsInputs = [
    document.getElementById('inputUnit'), 
    document.getElementById('notifToggle'),
    document.getElementById('darkToggle'),
    document.getElementById('reminderToggle')
];

// Elements to toggle
const viewModeElements = document.querySelectorAll('.view-mode-only');
const editModeElements = document.querySelectorAll('.edit-mode-only');

// 2. STATE & LOAD DATA
let isEditing = false;

// Default Data - Enhanced
const defaultProfile = {
    name: "Marc Santiago",
    bio: "💪 Fitness enthusiast",
    sex: "Male",
    height: 167,
    weight: 85,
    dob: "2005-06-24",
    bmi: 30.5,
    level: 12,
    streak: 123,
    achievements: 15,
    progress: 22,
    memberSince: "Jan 2024",
    goals: {
        steps: 10000,
        calories: 500,
        water: 2.5,
        workouts: 5,
        weight: 55
    },
    settings: {
        unit: "metric",
        notifications: true,
        darkMode: true,
        reminders: true
    },
    image: "https://i.pravatar.cc/300?img=11"
};

// Load Data
function loadProfile() {
    const data = JSON.parse(localStorage.getItem('syncnergyProfile')) || defaultProfile;
    
    // Populate View - Basic Info
    document.getElementById('displayName').innerText = data.name;
    document.getElementById('displayBio').innerText = data.bio || "💪 Fitness enthusiast";
    document.getElementById('displaySex').innerText = data.sex;
    document.getElementById('displayHeight').innerText = `${data.height} cm`;
    document.getElementById('displayCurrentWeight').innerText = `${data.weight} kg`;
    document.getElementById('displayAge').innerText = calculateAge(data.dob) + " years";
    document.getElementById('displayLevel').innerText = data.level || 12;
    document.getElementById('displayStreak').innerText = data.streak || 123;
    document.getElementById('displayAchievements').innerText = data.achievements || 15;
    document.getElementById('displayProgress').innerText = data.progress || 22;
    document.getElementById('displayMemberSince').innerText = data.memberSince || "Jan 2024";
    
    // Activity Level based on workouts
    updateActivityLevel(data.goals.workouts);
    
    // BMI Update
    const calculatedBMI = calculateBMI(data.height, data.weight);
    updateBMIDisplay(calculatedBMI);
    updateBMIIndicator(calculatedBMI);

    // Goals
    document.getElementById('displayStepsGoal').innerText = Number(data.goals.steps).toLocaleString();
    document.getElementById('displayCalGoal').innerText = `${data.goals.calories} kcal`;
    document.getElementById('displayWaterGoal').innerText = `${data.goals.water} L`;
    document.getElementById('displayWorkoutGoal').innerText = `${data.goals.workouts} days`;
    document.getElementById('displayWeightGoal').innerText = `${data.goals.weight} kg`;
    
    // Weight difference
    const weightDiff = data.weight - data.goals.weight;
    document.getElementById('weightDiff').innerText = weightDiff > 0 
        ? `${weightDiff} kg to go!` 
        : weightDiff < 0 
            ? `${Math.abs(weightDiff)} kg to gain!`
            : "Goal reached! 🎉";
    
    document.getElementById('profilePic').src = data.image;

    // Populate Inputs
    document.getElementById('inputName').value = data.name;
    document.getElementById('inputBio').value = data.bio || "";
    document.getElementById('inputSex').value = data.sex;
    document.getElementById('inputHeight').value = data.height;
    document.getElementById('inputCurrentWeight').value = data.weight;
    document.getElementById('inputDob').value = data.dob;
    document.getElementById('inputStepsGoal').value = data.goals.steps;
    document.getElementById('inputCalGoal').value = data.goals.calories;
    document.getElementById('inputWaterGoal').value = data.goals.water;
    document.getElementById('inputWorkoutGoal').value = data.goals.workouts;
    document.getElementById('inputWeightGoal').value = data.goals.weight;
    
    // Settings
    document.getElementById('inputUnit').value = data.settings.unit;
    document.getElementById('notifToggle').checked = data.settings.notifications;
}

// Calculate Age from DOB
function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Update Activity Level Display
function updateActivityLevel(workoutsPerWeek) {
    const activityEl = document.getElementById('displayActivityLevel');
    if (workoutsPerWeek >= 6) {
        activityEl.innerText = "🔥 Very Active";
        activityEl.className = "text-xs font-bold text-green-400";
    } else if (workoutsPerWeek >= 4) {
        activityEl.innerText = "💪 Active";
        activityEl.className = "text-xs font-bold text-primary-yellow";
    } else if (workoutsPerWeek >= 2) {
        activityEl.innerText = "🚶 Moderate";
        activityEl.className = "text-xs font-bold text-secondary-blue";
    } else {
        activityEl.innerText = "😴 Sedentary";
        activityEl.className = "text-xs font-bold text-white/50";
    }
}

// Helper to Color Code BMI
function updateBMIDisplay(bmiValue) {
    const bmiEl = document.getElementById('displayBMI');
    const bmiLabel = document.getElementById('bmiLabel');
    bmiEl.innerText = bmiValue;

    if (bmiValue < 18.5) {
        bmiEl.className = "text-yellow-400 text-sm font-black bg-yellow-400/20 px-2 py-0.5 rounded-md";
        bmiLabel.innerText = "Underweight";
        bmiLabel.className = "text-[10px] font-bold text-yellow-400";
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
        bmiEl.className = "text-green-400 text-sm font-black bg-green-400/20 px-2 py-0.5 rounded-md";
        bmiLabel.innerText = "Normal";
        bmiLabel.className = "text-[10px] font-bold text-green-400";
    } else if (bmiValue >= 25 && bmiValue < 30) {
        bmiEl.className = "text-yellow-500 text-sm font-black bg-yellow-500/20 px-2 py-0.5 rounded-md";
        bmiLabel.innerText = "Overweight";
        bmiLabel.className = "text-[10px] font-bold text-yellow-500";
    } else {
        bmiEl.className = "text-red-500 text-sm font-black bg-red-500/20 px-2 py-0.5 rounded-md";
        bmiLabel.innerText = "Obese";
        bmiLabel.className = "text-[10px] font-bold text-red-500";
    }
}

// Update BMI Indicator Position
function updateBMIIndicator(bmiValue) {
    const indicator = document.getElementById('bmiIndicator');
    if (!indicator) return;
    
    let position = 0;
    if (bmiValue < 18.5) {
        position = (bmiValue / 18.5) * 25;
    } else if (bmiValue < 25) {
        position = 25 + ((bmiValue - 18.5) / 6.5) * 25;
    } else if (bmiValue < 30) {
        position = 50 + ((bmiValue - 25) / 5) * 25;
    } else {
        position = 75 + Math.min(((bmiValue - 30) / 10) * 25, 24);
    }
    
    indicator.style.left = `${position}%`;
}

// 3. EDIT MODE TOGGLE
window.toggleEditMode = function() {
    isEditing = !isEditing;

    if (isEditing) {
        screenTitle.innerText = "EDIT PROFILE";
        screenTitle.classList.add('text-primary-yellow');
        
        viewModeElements.forEach(el => el.classList.add('hidden'));
        editModeElements.forEach(el => el.classList.remove('hidden'));
        
        settingsInputs.forEach(el => {
            if (el) el.removeAttribute('disabled');
        });
        
        showToast("✏️ Edit mode enabled");
        
    } else {
        screenTitle.innerText = "PROFILE";
        screenTitle.classList.remove('text-primary-yellow');
        
        viewModeElements.forEach(el => el.classList.remove('hidden'));
        editModeElements.forEach(el => el.classList.add('hidden'));
        
        settingsInputs.forEach(el => {
            if (el) el.setAttribute('disabled', 'true');
        });
        
        loadProfile();
    }
}

editBtn.addEventListener('click', toggleEditMode);

// 4. SAVE FUNCTION
window.saveProfile = function() {
    const existingData = JSON.parse(localStorage.getItem('syncnergyProfile')) || defaultProfile;
    
    const newProfile = {
        name: document.getElementById('inputName').value || "User",
        bio: document.getElementById('inputBio').value || "💪 Fitness enthusiast",
        sex: document.getElementById('inputSex').value,
        height: parseFloat(document.getElementById('inputHeight').value) || 170,
        weight: parseFloat(document.getElementById('inputCurrentWeight').value) || 70,
        dob: document.getElementById('inputDob').value,
        bmi: 0,
        level: existingData.level || 12,
        streak: existingData.streak || 123,
        achievements: existingData.achievements || 15,
        progress: existingData.progress || 22,
        memberSince: existingData.memberSince || "Jan 2024",
        goals: {
            steps: parseInt(document.getElementById('inputStepsGoal').value) || 10000,
            calories: parseInt(document.getElementById('inputCalGoal').value) || 500,
            water: parseFloat(document.getElementById('inputWaterGoal').value) || 2.5,
            workouts: parseInt(document.getElementById('inputWorkoutGoal').value) || 5,
            weight: parseInt(document.getElementById('inputWeightGoal').value) || 55
        },
        settings: {
            unit: document.getElementById('inputUnit').value,
            notifications: document.getElementById('notifToggle')?.checked ?? true,
            darkMode: true,
            reminders: document.getElementById('reminderToggle')?.checked ?? true
        },
        image: document.getElementById('profilePic').src
    };

    newProfile.bmi = calculateBMI(newProfile.height, newProfile.weight);

    localStorage.setItem('syncnergyProfile', JSON.stringify(newProfile));

    isEditing = false; 
    screenTitle.innerText = "PROFILE";
    screenTitle.classList.remove('text-primary-yellow');
    
    viewModeElements.forEach(el => el.classList.remove('hidden'));
    editModeElements.forEach(el => el.classList.add('hidden'));
    settingsInputs.forEach(el => {
        if (el) el.setAttribute('disabled', 'true');
    });
    
    loadProfile();
    
    showToast("✅ Profile updated successfully!");
}

// 5. HELPER FUNCTIONS

window.changePhoto = function() {
    const pics = [
        'https://i.pravatar.cc/300?img=11',
        'https://i.pravatar.cc/300?img=12',
        'https://i.pravatar.cc/300?img=13',
        'https://i.pravatar.cc/300?img=14',
        'https://i.pravatar.cc/300?img=15'
    ];
    const currentSrc = document.getElementById('profilePic').src;
    const currentIndex = pics.findIndex(p => currentSrc.includes(p.split('img=')[1]));
    const nextIndex = (currentIndex + 1) % pics.length;
    document.getElementById('profilePic').src = pics[nextIndex];
    showToast("📷 Photo changed!");
}

function calculateBMI(heightCm, weightKg) {
    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
    return isNaN(bmi) ? 0 : parseFloat(bmi);
}

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
let toastTimeout;

function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
        toast.classList.remove('opacity-100');
    }, 2500);
}

// Reset Data Modal
window.resetData = function() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    document.getElementById('modalContent').classList.remove('scale-95');
    document.getElementById('modalContent').classList.add('scale-100');
}

window.hideModal = function() {
    const modal = document.getElementById('confirmModal');
    document.getElementById('modalContent').classList.remove('scale-100');
    document.getElementById('modalContent').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
    }, 200);
}

window.confirmReset = function() {
    localStorage.removeItem('syncnergyProfile');
    localStorage.removeItem('syncnergyData');
    hideModal();
    showToast("🗑️ All data has been reset");
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Initialize
loadProfile();
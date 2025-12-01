# Syncnergy 🏃‍♂️💪

A modern fitness tracking web application designed with Human-Computer Interaction (HCI) principles at its core. Built for the HCI Finals project.

## 📱 Project Description

Syncnergy is a comprehensive fitness companion that helps users track their daily activities, workouts, and hydration levels. The app features an intuitive dark-themed interface optimized for mobile devices, providing users with actionable insights and encouraging progress tracking.

### Key Features
- **Activity Tracking** - Log daily activities with calorie burn estimates
- **Workout Management** - Track sets, reps, and workout completion
- **Hydration Monitoring** - Quick-add water intake with visual feedback
- **Daily Summary** - Real-time progress overview with motivational messages
- **Statistics Dashboard** - Weekly insights with interactive charts
- **Profile & Goals** - Customizable fitness goals and personal settings

## 🧠 HCI Principles Applied

### 1. Visibility of System Status
- Real-time progress updates in the daily summary section
- Loading skeleton states for perceived performance
- Visual feedback on all interactive elements (button presses, hover states)

### 2. Match Between System and Real World
- Intuitive icons and emojis (💧 for water, 🔥 for calories, 💪 for workouts)
- Natural language in progress messages
- Familiar fitness terminology throughout

### 3. User Control and Freedom
- Undo functionality for deleted items (5-second recovery window)
- Delete confirmation modal to prevent accidental data loss
- Easy navigation with back buttons and clear exit paths

### 4. Consistency and Standards
- Uniform button styling across all sections
- Consistent color coding (yellow for calories, blue for hydration)
- Standardized card layouts and spacing

### 5. Error Prevention
- Delete confirmation dialogs
- Input validation with min/max constraints
- Disabled states for unavailable actions (future dates)

### 6. Recognition Rather Than Recall
- Quick-add buttons for common water amounts (250ml, 500ml, etc.)
- Pre-filled workout templates
- Visual calendar for date selection

### 7. Flexibility and Efficiency of Use
- Quick actions for power users
- Streamlined data entry flows
- One-tap logging for frequent activities

### 8. Aesthetic and Minimalist Design
- Clean dark theme reducing visual clutter
- Strategic use of whitespace
- Information hierarchy with typography

### 9. Help Users Recognize, Diagnose, and Recover from Errors
- Clear error messages
- Undo toast notifications
- Empty state guidance

### 10. Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Skip-to-content links
- Screen reader friendly structure
- Sufficient color contrast

### 11. Emotional Design
- Celebration animations on workout completion
- Encouraging progress messages
- Delightful micro-interactions
- First-time user onboarding hints

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure and accessibility |
| **Tailwind CSS v3** | Utility-first styling via CDN |
| **Vanilla JavaScript** | Interactive functionality and state management |
| **Chart.js** | Statistics visualization |
| **LocalStorage** | Client-side data persistence |

### Custom Design Tokens
```css
--app-bg: #0A0A14      /* Deep dark background */
--card-bg: #313846     /* Card surfaces */
--card-action: #41586C /* Action buttons */
--primary-yellow: #FFC243  /* Calories, highlights */
--secondary-blue: #608EE9  /* Hydration, accents */
```

## 📂 Project Structure

```
syncnergy-web/
├── index.html          # Home dashboard
├── log.html            # Activity/workout/hydration log
├── stats.html          # Statistics and charts
├── profile.html        # User profile and goals
├── add_activity.html   # Add new activity
├── add_workout.html    # Add new workout
├── add_hydration.html  # Log water intake
├── add.html            # Quick add menu
├── styles.css          # Custom styles and animations
├── js/
│   ├── app.js          # Main app logic
│   ├── log.js          # Log screen functionality
│   ├── stats.js        # Charts and statistics
│   ├── profile.js      # Profile management
│   ├── add_activity.js # Activity form handling
│   └── add_workout.js  # Workout form handling
└── pics/               # Image assets
```

## 🚀 Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/santiagomarc/Syncnergy.git
   ```

2. Open `index.html` in a modern browser

3. For best experience, use browser developer tools to simulate mobile viewport (390px width recommended)

## 👥 Authors

HCI Finals Project - 2025

## 📄 License

This project is for educational purposes.

// Get habits from localStorage or initialize empty array
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Function to save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Function to add a new habit
function addHabit() {
    const habitInput = document.getElementById('habitInput');
    const habitText = habitInput.value.trim();
    
    if (habitText) {
        const habit = {
            id: Date.now(),
            text: habitText,
            completed: false,
            date: new Date().toLocaleDateString(),
            circles: new Array(30).fill('empty') // 'empty', 'success', or 'skipped'
        };
        
        habits.push(habit);
        saveHabits();
        displayHabits();
        habitInput.value = '';
    }
}

// Function to toggle habit completion
function toggleHabit(id) {
    habits = habits.map(habit => {
        if (habit.id === id) {
            return { ...habit, completed: !habit.completed };
        }
        return habit;
    });
    
    saveHabits();
    displayHabits();
}

// Function to delete a habit
function deleteHabit(id) {
    habits = habits.filter(habit => habit.id !== id);
    saveHabits();
    displayHabits();
}

// Function to toggle circles
function toggleCircle(habitId, circleIndex) {
    habits = habits.map(habit => {
        if (habit.id === habitId) {
            const newCircles = [...habit.circles];
            // Cycle through states: empty -> success -> skipped -> empty
            switch (newCircles[circleIndex]) {
                case 'empty':
                    newCircles[circleIndex] = 'success';
                    break;
                case 'success':
                    newCircles[circleIndex] = 'skipped';
                    break;
                case 'skipped':
                    newCircles[circleIndex] = 'empty';
                    break;
            }
            return { ...habit, circles: newCircles };
        }
        return habit;
    });
    
    saveHabits();
    displayHabits();
}

// Function to display habits
function displayHabits() {
    const habitsList = document.getElementById('habitsList');
    habitsList.innerHTML = '';
    
    habits.forEach(habit => {
        const habitElement = document.createElement('div');
        habitElement.className = `habit-item ${habit.completed ? 'completed' : ''}`;
        
        // Create circles HTML with day numbers
        const circlesHTML = habit.circles
            .map((state, index) => `
                <div class="circle-container">
                    <div 
                        class="circle ${state !== 'empty' ? state : ''}"
                        onclick="toggleCircle(${habit.id}, ${index})"
                        title="Day ${index + 1}"
                    ></div>
                </div>
            `)
            .join('');
        
        habitElement.innerHTML = `
            <div>
                <h3>${habit.text}</h3>
                <small>Created: ${habit.date}</small>
                <div class="habit-circles">
                    ${circlesHTML}
                </div>
            </div>
            <div>
                <button class="complete-btn" onclick="toggleHabit(${habit.id})">
                    ${habit.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteHabit(${habit.id})">Delete</button>
            </div>
        `;
        
        habitsList.appendChild(habitElement);
    });
}

// Initial display of habits
displayHabits();

// Remove or comment out any code that updates or displays numbers
// If there's a function that updates numbers, either remove it or modify it
// to not display anything
function updateNumber(number) {
    // Comment out or remove number display logic
    return;
} 
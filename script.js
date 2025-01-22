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
        habitElement.draggable = true;
        
        // Add drag event listeners
        habitElement.addEventListener('dragstart', () => {
            habitElement.classList.add('dragging');
        });
        
        habitElement.addEventListener('dragend', () => {
            habitElement.classList.remove('dragging');
            saveNewOrder();
        });
        
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
            <button class="delete-btn" onclick="deleteHabit(${habit.id})">×</button>
            <div>
                <h3>${habit.text}</h3>
                <small>Created: ${habit.date}</small>
                <div class="habit-circles">
                    ${circlesHTML}
                </div>
            </div>
        `;
        
        // Store the habit ID on the element for reference
        habitElement.dataset.habitId = habit.id;
        
        habitsList.appendChild(habitElement);
    });
}

// Add these new functions for drag and drop functionality
function initializeDragAndDrop() {
    const habitsList = document.getElementById('habitsList');
    let draggedItem = null;
    let initialY;
    let currentY;

    // Mouse events (existing code)
    habitsList.addEventListener('dragover', e => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const siblings = [...habitsList.querySelectorAll('.habit-item:not(.dragging)')];
        
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            const offset = e.clientY - box.top - box.height / 2;
            return offset < 0;
        });
        
        habitsList.insertBefore(draggingItem, nextSibling);
    });

    // Touch events
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.habit-item')) {
            draggedItem = e.target.closest('.habit-item');
            draggedItem.classList.add('dragging');
            initialY = e.touches[0].clientY;
            
            // Store the initial position
            const rect = draggedItem.getBoundingClientRect();
            draggedItem.style.position = 'fixed';
            draggedItem.style.width = rect.width + 'px';
            draggedItem.style.top = rect.top + 'px';
            draggedItem.style.left = rect.left + 'px';
            draggedItem.style.zIndex = 1000;
        }
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (draggedItem) {
            e.preventDefault();
            currentY = e.touches[0].clientY;
            const deltaY = currentY - initialY;
            
            // Move the dragged item
            draggedItem.style.transform = `translateY(${deltaY}px)`;
            
            // Find position to insert
            const siblings = [...habitsList.querySelectorAll('.habit-item:not(.dragging)')];
            const nextSibling = siblings.find(sibling => {
                const box = sibling.getBoundingClientRect();
                return currentY < box.top + box.height / 2;
            });
            
            if (nextSibling && nextSibling !== draggedItem.nextElementSibling) {
                habitsList.insertBefore(draggedItem, nextSibling);
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', function() {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem.style.position = '';
            draggedItem.style.width = '';
            draggedItem.style.top = '';
            draggedItem.style.left = '';
            draggedItem.style.transform = '';
            draggedItem.style.zIndex = '';
            
            saveNewOrder();
            draggedItem = null;
        }
    });

    // Prevent click events during drag
    habitsList.addEventListener('click', function(e) {
        if (draggedItem) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}

function saveNewOrder() {
    const habitsList = document.getElementById('habitsList');
    const habitElements = habitsList.querySelectorAll('.habit-item');
    const newHabits = [];
    
    habitElements.forEach(element => {
        const habitId = parseInt(element.dataset.habitId);
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
            newHabits.push(habit);
        }
    });
    
    habits = newHabits;
    saveHabits();
}

// Initialize drag and drop after page load
document.addEventListener('DOMContentLoaded', () => {
    displayHabits();
    initializeDragAndDrop();
});

// Remove or comment out any code that updates or displays numbers
// If there's a function that updates numbers, either remove it or modify it
// to not display anything
function updateNumber(number) {
    // Comment out or remove number display logic
    return;
} 
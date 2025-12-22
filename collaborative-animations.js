// Real-time Collaborative Animations (Simulated)
let simulatedUsers = [];
let userCount = 1; // Start with current user

function initCollaborativeAnimations() {
    const canvas = document.getElementById('collaborative-canvas');
    const userCursorsContainer = document.getElementById('user-cursors');
    const userCountElement = document.getElementById('user-count');
    const sharedElements = document.querySelectorAll('.shared-element');

    if (!canvas) return;

    // Create current user cursor
    const currentUserCursor = createUserCursor('Você', '#00ff88');
    userCursorsContainer.appendChild(currentUserCursor);

    // Simulate additional users
    simulateUsers();

    // Make shared elements draggable
    sharedElements.forEach(element => {
        makeElementDraggable(element);
        
        // Add hover effect
        element.addEventListener('mouseenter', () => {
            gsap.to(element, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Update user count display
    function updateUserCount() {
        if (userCountElement) {
            userCountElement.textContent = userCount;
        }
    }

    // Simulate users joining/leaving
    function simulateUsers() {
        // Add random users
        const addUserInterval = setInterval(() => {
            if (userCount < 5 && Math.random() > 0.7) {
                addSimulatedUser();
            }
        }, 3000);

        // Remove users randomly
        const removeUserInterval = setInterval(() => {
            if (userCount > 1 && Math.random() > 0.8) {
                removeSimulatedUser();
            }
        }, 5000);

        // Simulate user interactions
        setInterval(() => {
            if (simulatedUsers.length > 0) {
                const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
                if (randomUser && randomUser.cursor) {
                    moveSimulatedCursor(randomUser);
                }
            }
        }, 100);
    }

    function createUserCursor(name, color) {
        const cursor = document.createElement('div');
        cursor.className = 'user-cursor';
        cursor.style.borderColor = color;
        cursor.innerHTML = `<span class="cursor-label">${name}</span>`;
        
        // Follow mouse
        document.addEventListener('mousemove', (e) => {
            if (cursor === currentUserCursor) {
                gsap.to(cursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: 'power2.out'
                });
            }
        });

        return cursor;
    }

    function addSimulatedUser() {
        const colors = ['#0066ff', '#ff0066', '#ffaa00', '#00ffff'];
        const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const color = colors[simulatedUsers.length % colors.length];
        const name = names[simulatedUsers.length % names.length];

        const cursor = createUserCursor(name, color);
        userCursorsContainer.appendChild(cursor);

        const user = {
            id: Date.now(),
            name: name,
            color: color,
            cursor: cursor,
            targetX: Math.random() * window.innerWidth,
            targetY: Math.random() * window.innerHeight,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        };

        simulatedUsers.push(user);
        userCount++;
        updateUserCount();

        // Position cursor
        gsap.set(cursor, {
            x: user.x,
            y: user.y
        });
    }

    function removeSimulatedUser() {
        if (simulatedUsers.length > 0) {
            const user = simulatedUsers.pop();
            if (user.cursor) {
                gsap.to(user.cursor, {
                    opacity: 0,
                    scale: 0,
                    duration: 0.3,
                    onComplete: () => {
                        user.cursor.remove();
                    }
                });
            }
            userCount--;
            updateUserCount();
        }
    }

    function moveSimulatedCursor(user) {
        // Random movement
        if (Math.random() > 0.95) {
            user.targetX = Math.random() * window.innerWidth;
            user.targetY = Math.random() * window.innerHeight;
        }

        // Smooth movement
        user.x += (user.targetX - user.x) * 0.05;
        user.y += (user.targetY - user.y) * 0.05;

        gsap.to(user.cursor, {
            x: user.x,
            y: user.y,
            duration: 0.1,
            ease: 'power2.out'
        });
    }

    function makeElementDraggable(element) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                gsap.to(element, {
                    x: currentX,
                    y: currentY,
                    duration: 0.1,
                    ease: 'power2.out'
                });
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
            }
        });

        element.style.cursor = 'grab';
        gsap.set(element, { x: 0, y: 0 });
    }

    // Collaborative highlight effect
    sharedElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Simulate other users also interacting
            simulatedUsers.forEach(user => {
                if (user.cursor && Math.random() > 0.7) {
                    const rect = element.getBoundingClientRect();
                    user.targetX = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
                    user.targetY = rect.top + rect.height / 2 + (Math.random() - 0.5) * 100;
                }
            });
        });
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollaborativeAnimations);
} else {
    initCollaborativeAnimations();
}

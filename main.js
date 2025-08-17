// Global variables
let currentUser = null
let events = []
const registeredEvents = []

function initializeRealData() {
  if (!localStorage.getItem("events")) {
    const realEvents = [
      {
        id: 1,
        title: "Diwali",
        category: "culture",
        date: "2024-11-01",
        time: "06:00 PM",
        location: "Main Auditorium",
        organizer: "Cultural Committee",
        description:
          "Celebrate the festival of lights with traditional performances, rangoli competition, and delicious sweets. Join us for an evening filled with cultural activities, traditional music, dance performances, and a grand feast.",
        image: "diwali.png",
        rules:
          "Open to all students and faculty. Traditional attire encouraged. Please bring your student ID for entry.",
        maxParticipants: 800,
        currentParticipants: 456,
      },
      {
        id: 2,
        title: "Hackathon",
        category: "technology",
        date: "2024-11-15",
        time: "09:00 AM",
        location: "Tech Hub",
        organizer: "Tech Club",
        description:
          "48-hour coding marathon to build innovative solutions for real-world problems. Teams will work on cutting-edge technologies including AI, blockchain, and IoT solutions.",
        image: "hackathon.png",
        rules:
          "Teams of 2-4 members. Bring your own laptops. Food and beverages provided. Internet and power backup available 24/7.",
        maxParticipants: 200,
        currentParticipants: 156,
      },
      {
        id: 3,
        title: "BGMI Tournament",
        category: "sports",
        date: "2024-11-20",
        time: "02:00 PM",
        location: "Gaming Arena",
        organizer: "Gaming Club",
        description:
          "Battle Grounds Mobile India tournament with exciting prizes for winners. Multiple rounds including solo, duo, and squad matches with professional gaming setup.",
        image: "bgmi.png",
        rules:
          "Solo and squad matches. Mobile device required. Registration fee: ₹50. Valid student ID mandatory for participation.",
        maxParticipants: 100,
        currentParticipants: 78,
      },
      {
        id: 4,
        title: "Navratri Festival",
        category: "culture",
        date: "2024-10-15",
        time: "07:00 PM",
        location: "Open Ground",
        organizer: "Cultural Committee",
        description:
          "Nine nights of traditional Garba and Dandiya dance celebrations. Experience the vibrant colors, traditional music, and authentic Gujarati culture with professional dance instructors.",
        image: "navratri.png",
        rules:
          "Traditional attire mandatory. Dandiya sticks will be provided. Food stalls available. Photography allowed in designated areas only.",
        maxParticipants: 1000,
        currentParticipants: 723,
      },
      {
        id: 5,
        title: "New Student Orientation",
        category: "academics",
        date: "2024-08-15",
        time: "10:00 AM",
        location: "Main Auditorium",
        organizer: "Academic Office",
        description:
          "Welcome new students to the campus with introduction to facilities, programs, faculty members, and campus life. Includes campus tour and interaction with senior students.",
        image: "orientation.png",
        rules:
          "Mandatory for all new students. Bring student ID and admission documents. Parents are welcome to attend the welcome session.",
        maxParticipants: 500,
        currentParticipants: 487,
      },
      {
        id: 6,
        title: "Volleyball Championship",
        category: "sports",
        date: "2024-12-05",
        time: "04:00 PM",
        location: "Sports Complex",
        organizer: "Sports Committee",
        description:
          "Inter-department volleyball championship with trophies for winning teams. Professional referees and live commentary. Refreshments provided for all participants.",
        image: "volleyball.png",
        rules:
          "Teams of 6 players. Department-wise registration required. Sports attire mandatory. Medical certificate required for participation.",
        maxParticipants: 120,
        currentParticipants: 96,
      },
      {
        id: 7,
        title: "Internal Hackathon",
        category: "technology",
        date: "2024-12-10",
        time: "11:00 AM",
        location: "Computer Lab",
        organizer: "CS Department",
        description:
          "Department-level coding competition to select teams for external hackathons. Focus on problem-solving, algorithm design, and software development skills.",
        image: "internal-hackathon.png",
        rules:
          "Open to CS students only. Individual participation. Duration: 4 hours. Programming languages: C++, Java, Python allowed.",
        maxParticipants: 50,
        currentParticipants: 42,
      },
    ]

    localStorage.setItem("events", JSON.stringify(realEvents))
  }

  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }
}

// Authentication functions
function handleLogin(e) {
  e.preventDefault()
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
    window.location.href = "dashboard.html"
  } else {
    alert("Invalid credentials. Please check your email and password.")
  }
}

function handleRegister(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const userData = {
    id: Date.now(),
    name: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Check if email already exists
  if (users.find((u) => u.email === userData.email)) {
    alert("Email already registered")
    return
  }

  users.push(userData)
  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem("currentUser", JSON.stringify(userData))

  window.location.href = "dashboard.html"
}

function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

function checkAuth() {
  const user = localStorage.getItem("currentUser")
  if (!user) {
    window.location.href = "index.html"
    return
  }

  currentUser = JSON.parse(user)
  updateUserInfo()
  updateSidebarForRole()
}

function updateUserInfo() {
  const userNameElements = document.querySelectorAll("#userName")
  userNameElements.forEach((el) => {
    el.textContent = `Welcome, ${currentUser.name}!`
  })
}

function updateSidebarForRole() {
  const sidebarMenu = document.getElementById("sidebarMenu")
  if (!sidebarMenu) return

  // Add role-specific menu items
  if (currentUser.role === "faculty" || currentUser.role === "admin") {
    const createEventItem = document.createElement("li")
    createEventItem.innerHTML = `
            <a href="create-event.html">
                <i class="fas fa-plus-circle"></i>
                <span>Create Event</span>
            </a>
        `
    sidebarMenu.appendChild(createEventItem)
  }

  if (currentUser.role === "admin") {
    const analyticsItem = document.createElement("li")
    analyticsItem.innerHTML = `
            <a href="analytics.html">
                <i class="fas fa-chart-line"></i>
                <span>Analytics</span>
            </a>
        `
    sidebarMenu.appendChild(analyticsItem)

    const archiveItem = document.createElement("li")
    archiveItem.innerHTML = `
            <a href="past-archive.html">
                <i class="fas fa-archive"></i>
                <span>Past Archive</span>
            </a>
        `
    sidebarMenu.appendChild(archiveItem)
  }
}

// Dashboard functions
function loadDashboard() {
  updateWelcomeMessage()
  loadQuickActions()
  loadUpcomingEvents()
}

function updateWelcomeMessage() {
  const welcomeMessage = document.getElementById("welcomeMessage")
  const currentRole = document.getElementById("currentRole")

  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome, ${currentUser.name}!`
  }

  if (currentRole) {
    currentRole.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
  }
}

function loadQuickActions() {
  const quickActions = document.getElementById("quickActions")
  if (!quickActions) return

  let actions = []

  if (currentUser.role === "student") {
    actions = [
      {
        icon: "fas fa-calendar-plus",
        title: "Register for Event",
        description: "Browse and register for upcoming events",
        action: () => (window.location.href = "events.html"),
      },
      {
        icon: "fas fa-bookmark",
        title: "My Events",
        description: "View your registered events",
        action: () => (window.location.href = "my-events.html"),
      },
    ]
  } else if (currentUser.role === "faculty") {
    actions = [
      {
        icon: "fas fa-plus-circle",
        title: "Create Event",
        description: "Create and manage new events",
        action: () => (window.location.href = "create-event.html"),
      },
      {
        icon: "fas fa-cog",
        title: "Manage Events",
        description: "Edit and monitor your events",
        action: () => (window.location.href = "my-events.html"),
      },
    ]
  } else if (currentUser.role === "admin") {
    actions = [
      {
        icon: "fas fa-chart-line",
        title: "Analytics",
        description: "View platform analytics and reports",
        action: () => (window.location.href = "analytics.html"),
      },
      {
        icon: "fas fa-archive",
        title: "Past Archive",
        description: "Browse past events gallery",
        action: () => (window.location.href = "past-archive.html"),
      },
    ]
  }

  quickActions.innerHTML = actions
    .map(
      (action) => `
        <div class="action-card" onclick="(${action.action})()">
            <i class="${action.icon}"></i>
            <h4>${action.title}</h4>
            <p>${action.description}</p>
        </div>
    `,
    )
    .join("")
}

function loadUpcomingEvents() {
  const upcomingEvents = document.getElementById("upcomingEvents")
  if (!upcomingEvents) return

  events = JSON.parse(localStorage.getItem("events") || "[]")
  const upcomingEventsData = events.slice(0, 4) // Show first 4 events

  upcomingEvents.innerHTML = upcomingEventsData.map((event) => createEventCard(event)).join("")
}

function createEventCard(event) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return `
        <div class="event-card">
            <div class="event-image">
                <img src="assets/images/${event.image}" alt="${event.title}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.nextElementSibling.style.display='none';">
                <div class="event-image-fallback">
                    <i class="fas fa-calendar-alt"></i>
                </div>
            </div>
            <div class="event-content">
                <span class="event-category">${event.category}</span>
                <h4 class="event-title">${event.title}</h4>
                <div class="event-meta">
                    <div><i class="fas fa-calendar"></i> ${formattedDate}, ${event.time}</div>
                    <div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
                    <div><i class="fas fa-users"></i> ${event.currentParticipants}/${event.maxParticipants}</div>
                </div>
                <button class="btn-view-details" onclick="viewEventDetail(${event.id})">
                    View Details
                </button>
            </div>
        </div>
    `
}

// Events page functions
function loadEvents() {
  const eventsGrid = document.getElementById("eventsGrid")
  if (!eventsGrid) return

  events = JSON.parse(localStorage.getItem("events") || "[]")
  displayEvents(events)
}

function displayEvents(eventsToShow) {
  const eventsGrid = document.getElementById("eventsGrid")
  eventsGrid.innerHTML = eventsToShow.map((event) => createEventCard(event)).join("")
}

function filterEvents() {
  const categoryFilter = document.getElementById("categoryFilter").value
  const searchInput = document.getElementById("searchInput").value.toLowerCase()

  let filteredEvents = events

  if (categoryFilter) {
    filteredEvents = filteredEvents.filter((event) => event.category === categoryFilter)
  }

  if (searchInput) {
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchInput) || event.description.toLowerCase().includes(searchInput),
    )
  }

  displayEvents(filteredEvents)
}

function viewEventDetail(eventId) {
  window.location.href = `event-detail.html?ev=${eventId}`
}

// Event detail functions
function loadEventDetail() {
  const urlParams = new URLSearchParams(window.location.search)
  const eventId = Number.parseInt(urlParams.get("ev"))

  if (!eventId) {
    window.location.href = "events.html"
    return
  }

  events = JSON.parse(localStorage.getItem("events") || "[]")
  const event = events.find((e) => e.id === eventId)

  if (!event) {
    window.location.href = "events.html"
    return
  }

  displayEventDetail(event)
}

function displayEventDetail(event) {
  const container = document.getElementById("eventDetailContainer")
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const registeredEvents = JSON.parse(localStorage.getItem(`registeredEvents_${currentUser.id}`) || "[]")
  const isRegistered = registeredEvents.includes(event.id)

  container.innerHTML = `
        <div class="event-detail-header">
            <div class="event-detail-image">
                <img src="assets/images/${event.image}" alt="${event.title}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.nextElementSibling.style.display='none';">
                <div class="event-detail-image-fallback">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${event.title}</span>
                </div>
            </div>
        </div>
        <div class="event-detail-content">
            <h1 class="event-detail-title">${event.title}</h1>
            
            <div class="event-detail-meta">
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${event.time}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <span>${event.organizer}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${event.category}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-users"></i>
                    <span>${event.currentParticipants}/${event.maxParticipants} registered</span>
                </div>
            </div>
            
            <div class="event-description">
                <h3>About this event</h3>
                <p>${event.description}</p>
                
                <h3>Rules & Requirements</h3>
                <p>${event.rules}</p>
            </div>
            
            <button class="btn-register" 
                    onclick="registerForEvent(${event.id})" 
                    ${isRegistered ? "disabled" : ""}>
                ${isRegistered ? "Already Registered" : "Register Now"}
            </button>
        </div>
    `
}

function registerForEvent(eventId) {
  const registeredEvents = JSON.parse(localStorage.getItem(`registeredEvents_${currentUser.id}`) || "[]")

  if (!registeredEvents.includes(eventId)) {
    registeredEvents.push(eventId)
    localStorage.setItem(`registeredEvents_${currentUser.id}`, JSON.stringify(registeredEvents))

    // Update event participant count
    events = JSON.parse(localStorage.getItem("events") || "[]")
    const eventIndex = events.findIndex((e) => e.id === eventId)
    if (eventIndex !== -1) {
      events[eventIndex].currentParticipants++
      localStorage.setItem("events", JSON.stringify(events))
    }

    alert("Successfully registered for the event!")
    loadEventDetail() // Refresh the page
  }
}

// Mobile menu toggle functionality
function toggleMobileMenu() {
  const sidebar = document.querySelector(".sidebar")
  const overlay = document.querySelector(".mobile-overlay")

  sidebar.classList.toggle("mobile-open")

  if (!overlay) {
    const newOverlay = document.createElement("div")
    newOverlay.className = "mobile-overlay"
    newOverlay.onclick = closeMobileMenu
    document.body.appendChild(newOverlay)
  }

  document.body.classList.toggle("mobile-menu-open")
}

function closeMobileMenu() {
  const sidebar = document.querySelector(".sidebar")
  const overlay = document.querySelector(".mobile-overlay")

  sidebar.classList.remove("mobile-open")
  document.body.classList.remove("mobile-menu-open")

  if (overlay) {
    overlay.remove()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeRealData()
})

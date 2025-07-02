# 🚀 Collaborative Retro Board

A modern, real-time retrospective board application designed for agile teams to conduct effective sprint retrospectives and planning poker sessions.

## ✨ Features

### 🔄 Retrospective Board

- **Multiple Templates**: Choose from 6 different retrospective formats
  - Start, Stop, Continue
  - What Went Well, What Could Be Improved, Ideas
  - 4L (Liked, Learned, Lacked, Longed For)
  - DAKI (Drop, Add, Keep, Improve)
  - FLAP (Future, Lessons, Accomplishments, Problems)
  - Mountain Climber
- **Real-time Collaboration**: Live updates across all participants
- **Sticky Notes**: Create, edit, delete, and move notes between columns
- **Voting System**: Vote on sticky notes to identify priorities
- **Hot Topics**: Automatically highlights top-voted items
- **Drag & Drop**: Intuitive column management

### 🎯 Personal Features

- **My Stickies Highlighting**: Your notes are highlighted with a special border (persists across sessions)
- **Anonymous Participation**: Notes remain anonymous to others while being highlighted for you
- **Local Storage**: Your sticky notes are remembered even after leaving and rejoining

### ⏱️ Timer System

- **Collaborative Timer**: Start/stop timers visible to all participants
- **Visual Feedback**: Color-coded countdown (green → yellow → red)
- **Audio Notifications**: Pleasant chime sound when time expires
- **Flexible Duration**: Set timers from 1-60 minutes
- **Real-time Sync**: All participants see the same countdown

### 🎨 User Experience

- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations

### 🃏 Planning Poker

- **Estimation Sessions**: Collaborative story point estimation
- **Real-time Voting**: See when participants have voted
- **Reveal System**: Simultaneous card reveal
- **Consensus Detection**: Automatic detection of agreement

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Real-time**: WebSocket communication
- **Storage**: In-memory (with localStorage for user preferences)
- **Audio**: Web Audio API for notifications

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── client/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── retrospective/     # Retro board specific files
│   ├── planning-poker/    # Planning poker files
│   ├── shared/           # Shared components
│   └── index.html        # Main landing page
├── server/               # Backend files
│   └── server.js        # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🎮 How to Use

### Creating a Retrospective

1. **Start a Session**: Click "Create Room" on the homepage
2. **Choose Template**: Select from 6 different retrospective formats
3. **Share Room**: Share the room ID or link with your team
4. **Add Notes**: Use the floating "Add Note" button to create sticky notes
5. **Collaborate**: Vote, move, and discuss notes in real-time
6. **Set Timer**: Use the built-in timer to manage discussion time

### Joining a Session

1. **Enter Room ID**: Input the room ID shared by your facilitator
2. **Join Room**: Click "Join Room" to enter the session
3. **Participate**: Add notes, vote, and collaborate with your team

### Timer Usage

1. **Set Duration**: Choose 1-60 minutes
2. **Start Timer**: Click the start button (visible to all participants)
3. **Monitor Progress**: Watch the color-coded countdown
4. **Get Notified**: Hear the pleasant chime when time is up

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)

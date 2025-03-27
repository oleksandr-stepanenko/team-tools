# Team Retrospective Application

A real-time retrospective application built with Socket.IO that allows teams to conduct retrospective meetings remotely. This application enables creating and joining rooms, adding anonymous sticky notes, and voting on ideas.

## Features

- Create and join retrospective rooms with shareable room IDs
- Choose from 3 different retrospective templates:
  - Start, Stop, Continue
  - What Went Well, What Could Be Improved, Ideas
  - 4Ls: Liked, Learned, Lacked, Longed For
- Add anonymous sticky notes in different categories based on the selected template
- Vote on sticky notes
- Real-time updates for all participants in the room

## Technologies Used

- Node.js and Express for the server
- Socket.IO for real-time communication
- HTML, CSS, and JavaScript for the frontend
- UUID for generating unique identifiers

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   Or for development with auto-restart:
   ```
   npm run dev
   ```
4. Access the application at `http://localhost:3000`

## How to Use

1. **Create a Room**:
   - Click on the "Create Room" button on the home page
   - Select a retrospective template:
     - Start, Stop, Continue
     - What Went Well, What Could Be Improved, Ideas
     - 4Ls: Liked, Learned, Lacked, Longed For
   - Click "Create Room with Template"
   - A new room will be created with a unique ID using your selected template
   - The app will automatically join the newly created room

2. **Join a Room**:
   - Enter a valid room ID in the input field
   - Click the "Join Room" button
   - If the room exists, you'll join the retrospective board with the template that was selected when the room was created

3. **Share Room ID**:
   - Copy the room ID by clicking the "Copy ID" button
   - Share this ID with your team members to join the same room

4. **Add Sticky Notes**:
   - Click the "Add Note" button at the top of the board
   - Select a category from the dropdown (based on the active template)
   - Enter your note content
   - Click "Add Note" to submit

5. **Vote on Sticky Notes**:
   - Click the thumbs-up icon on any sticky note to vote
   - Click again to remove your vote
   - All votes are updated in real-time for all participants

## Available Templates

### Start, Stop, Continue
A simple but effective format focusing on what the team should:
- Start doing (new practices to adopt)
- Stop doing (harmful or ineffective practices)
- Continue doing (valuable practices to maintain)

### What Went Well, What Could Be Improved, Ideas
A classic retrospective format focusing on:
- What Went Well (positive aspects)
- What Could Be Improved (areas needing attention)
- Ideas (suggestions for future improvements)

### 4Ls: Liked, Learned, Lacked, Longed For
A deeper reflective format examining what participants:
- Liked (positive aspects)
- Learned (new insights gained)
- Lacked (missing elements)
- Longed For (wishes and desires)

## License

MIT 
# 🎙️ Deepgram Live Voice Transcriber

A cool web tool that listens to your voice and transcribes it live using the [Deepgram Speech-to-Text API](https://deepgram.com/product/speech-to-text). Built with **Vite**, **React**, and **Tailwind CSS**.

---

## 🚀 Features

- 🎤 Real-time voice transcription via microphone
- 📝 Live stacking transcript in a textarea
- 🛑 Start/Stop recording toggle
- 🔄 Refresh transcript with one click
- ⚡ Fast performance using Vite

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shridharrrr/Speech-to-text-using-deepgram-api.git
cd deepgram-transcriber
````

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

At the root of the project, create a `.env` file and add your [Deepgram API Key](https://console.deepgram.com/signup):

```env
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

> 🔐 Make sure your API key is kept private and `.env` is in `.gitignore`.

---

## 🧪 Run the Project

```bash
npm run dev
```

Then open your browser at:

```
http://localhost:5173
```

---

## 🛠 Tech Stack

* **Frontend**: React + Tailwind CSS
* **Build Tool**: Vite
* **Speech-to-Text**: Deepgram WebSocket API

---

## 📁 Folder Structure

```
deepgram-transcriber/
├─ public/
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ .env
├─ index.html
├─ tailwind.config.js
├─ vite.config.js
```

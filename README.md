# 🗺️ Geo Explorer: A New Era of AI-Powered Geolocation

<div align="center">

```
  ________              ______                 __            
                                         
```

**An open-source, AI-powered geolocation engine that thinks like a human expert.**

</div>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Gemini" src="https://img.shields.io/badge/Google_Gemini-8E77F0?style=for-the-badge&logo=google-gemini&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</p>

---

## 🚀 Project Vision: The Dawn of the Reasoning Engine

> **Geo Explorer is not just another map application. It is a glimpse into the future of human-computer interaction and a statement on the power of open, transparent AI.**

The world of AI-powered geolocation has been dominated by a "black box" philosophy: feed an image into a proprietary system and get a result, with no insight into the process. These tools are powerful, but they are static, opaque, and fundamentally limited by their own hidden databases.

**Geo Explorer represents a paradigm shift.** 💥

Our vision is to democratize this technology by building a **"glass box"**—an AI that doesn't just *know*, it *thinks*. We leverage a dynamic, real-time reasoning engine capable of solving geolocation puzzles from first principles, just like a human expert. This project is built on a revolutionary concept:

-   **Instead of a proprietary database**, our "database" is the live, indexed internet as understood by Google's Gemini model.
-   **Instead of a secret algorithm**, our "algorithm" is a sophisticated, open-source **chain-of-thought prompting strategy** that instructs the AI to think, reason, and deduce like a world-class forensic geolocator.

This is more than a tool. It is an exploration into how AI can perceive, understand, and navigate our world, with a process that is open for anyone to inspect, modify, and improve.

---

## ✨ An Arsenal of Features

Geo Explorer is a conversational AI-powered application that allows you to explore the world through text and images. It combines a natural language chat interface with an interactive map, creating a seamless and intuitive experience.

| Feature                               | Description                                                                                                                                                                                                | Icon      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **Forensic-Level Image Analysis**     | Upload any photo, and the AI will perform a deep forensic analysis of architecture, vegetation, soil, infrastructure, and cultural clues to pinpoint its location with astonishing accuracy.                  | `🕵️‍♂️`     |
| **Natural Language Understanding**    | Ask for directions, find places of interest, or get information about any location using plain, everyday language. No rigid syntax required.                                                                 | `🗣️`       |
| **Dynamic, Interactive Map**          | A live, dark-themed Google Map that updates in real-time to display single locations, multi-stop routes, and points of interest based on your conversation.                                                  | `🗺️`       |
| **Conversational Memory & Context**   | The AI remembers the current topic, allowing for natural follow-up questions. Find a museum, then ask for "restaurants nearby" without ever needing to mention the museum's name again.                       | `🧠`       |
| **AI-Powered Itinerary Planner**      | Transform from an explorer into a planner. Ask the AI to generate detailed, multi-day travel itineraries based on a location, tailored to your interests in food, history, art, or anything else.            | `✈️`       |
| **Grounded & Trustworthy Responses**  | Every response is grounded in real-time data from Google Search and Google Maps, complete with sources. This dramatically reduces the chance of AI "hallucinations" and provides verifiable information.       | `✅`       |
| **Sleek & Modern UI**                 | A beautiful, dark-themed interface with polished animations and custom-styled components, designed for an immersive and enjoyable user experience from the first click.                                     | `🎨`       |
| **Completely Open Source**            | The entire codebase, including the sophisticated AI prompts that form the application's "brain," is open for inspection, modification, and contribution under the MIT License.                                 | `🌍`       |

---

## 🤯 The Geo Explorer Philosophy: Reasoning Over Rote Memorization

To appreciate the innovation of Geo Explorer, it's essential to understand the two fundamentally different approaches to AI geolocation. We champion the "Glass Box" approach.

| Aspect                       | ⚫ The Old Way ("Black Box" Systems)                                                                                                    | ⚪ The Geo Explorer Way ("Glass Box" Engine)                                                                                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Technology**          | A massive, private, and static database of geotagged images.                                                                            | A dynamic, real-time reasoning engine powered by a Large Language Model (Gemini).                                                                                                                         |
| **Reasoning Process**        | Opaque. It's a pattern-matching lookup. It can't explain *why* it made a match.                                                         | **Transparent.** The AI follows an open-source "chain-of-thought" forensic protocol. Its entire reasoning process is defined in the code.                                                                |
| **Knowledge Base**           | **Finite and Static.** Can only identify places it has already seen and stored. Struggles with new constructions or un-indexed locations. | **Infinite and Dynamic.** Its "database" is the live internet. It can identify locations built yesterday and provide up-to-the-minute information via grounding.                                         |
| **Flexibility**              | Inflexible. It's a one-trick pony designed for one task: lookup.                                                                          | **Hyper-Flexible.** It's a multi-tool. It can identify a location, then answer questions about its history, find nearby restaurants, and even plan a multi-day trip around it.                           |
| **"The Secret Sauce"**       | A proprietary, inaccessible image database.                                                                                             | A sophisticated, open-source **system prompt** that teaches the AI how to think like an expert.                                                                                                           |

---

## 🔬 Core Features: A Technical Deep Dive

Each feature of Geo Explorer is a combination of frontend React components and backend AI logic. Below is a detailed exploration of each.

### 2.1. 🖼️ Multimodal Input (Text & Image)
-   **What It Is:** The application accepts user input in multiple forms: standard text descriptions, uploaded images, or a powerful combination of both.
-   **Technical Implementation:**
    -   **Frontend (`ChatInput.tsx`):** A controlled form uses a hidden `<input type="file">` triggered by a styled `<label>`.
    -   **Image Handling (`utils.ts`):** The selected `File` object is converted into a Base64-encoded string with its `mimeType` using the browser's `FileReader` API. This is the format required by the Gemini API.
    -   **API Payload (`App.tsx`):** The `promptParts` array is constructed with `{ text: ... }` and `{ inlineData: ... }` objects, creating a multimodal request.

### 2.2. 🧠 AI-Powered Geolocation & Analysis
-   **What It Is:** The AI's ability to accurately identify locations from images by executing a complex, multi-step forensic analysis protocol.
-   **Technical Implementation:**
    -   **The "Brain" (`App.tsx`):** The magic is the `IMAGE_SYSTEM_INSTRUCTION` system prompt. This prompt commands the AI to follow a rigorous "chain-of-thought" process: Deep Forensic Analysis -> OCR -> Hypothesis & Verification -> Disambiguation.
    -   **The Tools (`chats.create`):** The chat session is initialized with `tools: [{ googleSearch: {} }, { googleMaps: {} }]`, giving the AI live search capabilities to ground its analysis in real-world data.

### 2.3. 🗺️ Interactive Map Display
-   **What It Is:** A dynamic, dark-themed embedded Google Map that provides a constant visual reference.
-   **Technical Implementation:**
    -   **State Management (`App.tsx`):** The `mapConfig` state is the single source of truth, using a discriminated union (`MapConfig` in `types.ts`) to handle `'search'`, `'directions'`, or `null` states.
    -   **Component (`MapDisplay.tsx`):** This component constructs the correct `iframe` source URL based on the `mapConfig` type.
    -   **Dark Theme:** A clever CSS filter (`filter: 'invert(1) hue-rotate(180deg)'`) is applied to the `iframe` to create a dark theme.
    -   **Recenter & Key Prop:** A React `key` prop on the `iframe` is used to force a full reload when the map's source changes.

### 2.4. 💬 Conversational Memory & Follow-ups
-   **What It Is:** The ability for the AI to remember the current topic, allowing for natural, multi-turn conversations.
-   **Technical Implementation:**
    -   **Persistent Chat Session (`App.tsx`):** A `useRef` (`chatSessionRef`) holds the `Chat` object, persisting it across re-renders without triggering them. The `@google/genai` SDK automatically manages the history within this object.
    -   **Contextual Reset:** The memory is intentionally wiped (`chatSessionRef.current = null;`) when a new image is uploaded to prevent context from a previous location "leaking" into the analysis of a new one.

### 2.5. ✈️ AI Itinerary Planner
-   **What It Is:** A creative feature that transforms the app into a trip-planning assistant.
-   **Technical Implementation:**
    -   **Prompt Engineering (`App.tsx`):** This feature is enabled purely through `RULE F` in the system prompt, which tells the AI how to recognize an itinerary request and how to format the output using Markdown.
    -   **Proactive Suggestions:** The prompt instructs the AI to be proactive, suggesting tailored plans if the user's initial request is vague, encouraging deeper engagement.

---

## 📖 User Guide: From First Query to Full Itinerary

### 5.1. The Interface
-   **Chat Panel (Left):** Your conversation with the Geo Explorer AI.
-   **Map Panel (Right):** The visual representation of your conversation.
-   **Input Form (Bottom Left):** Where you type your messages and upload images.

### 5.2. Step-by-Step Workflows

1.  **📸 Identify a Location from a Photo**
    -   Click the **Paperclip Icon** 📎 and select an image.
    -   Optionally, add a question (e.g., "What's the history of this place?").
    -   Click the **Send Icon** ➡️.
    -   Watch as the AI provides a detailed description and pinpoints the location on the map.

2.  **🚗 Get Directions**
    -   Type a request, like *"Directions from Rajshahi College to Shah Makhdum College"* or *"How do I get to the airport from my current location?"*
    -   Click **Send** ➡️.
    -   The AI will confirm the route in the chat, and the map will update to show the A-to-B path.

3.  **🗓️ Plan a Trip**
    -   First, establish a location (e.g., find "The Louvre Museum").
    -   Ask a follow-up question: *"Plan a 4-day trip for me centered around here. I'm interested in art, history, and great food."*
    -   Click **Send** ➡️.
    -   The AI will generate a detailed, day-by-day itinerary in the chat. You can then ask more questions to refine the plan!

---

## 🤖 The AI's "Brain": A Deep Dive into Prompt Engineering

The most innovative aspect of this application is its use of a highly-structured system prompt to control the AI's behavior and make it communicate with the React frontend.

### 6.1. The Dual-Instruction Strategy
The app uses two distinct system instructions: `IMAGE_SYSTEM_INSTRUCTION` and `TEXT_SYSTEM_INSTRUCTION`. This is critical for performance. Image analysis requires a complex "chain-of-thought" process, while simple text queries can use a much faster, more direct logic. The app intelligently selects the right "brain" for the job based on whether an image is present.

### 6.2. The AI-UI Bridge: The Directive System 🌉
We translate the AI's natural language response into structured state changes using a custom "directive" system. The AI is commanded to end its response with a machine-readable directive that the React app can parse with Regular Expressions.

| Directive          | Purpose                                        | Regex (`App.tsx`)                                        |
| ------------------ | ---------------------------------------------- | -------------------------------------------------------- |
| `MAP_QUERY:`       | Update the map to a single location.           | `/MAP_QUERY:([\s\S]+)/`                                   |
| `SUGGESTIONS:`     | Handle ambiguous queries with multiple options.| `/SUGGESTIONS:([\s\S]+)/`                               |
| `DIRECTIONS_QUERY:`| Plot a route on the map with an origin/dest.   | `/DIRECTIONS_QUERY:[\s\S]*?({[\s\S]*})/`                  |
| (No Directive)     | Allow for conversational follow-ups.           | (No match)                                               |

<details>
<summary><strong>🤫 Click to view the full System Prompt for Image Analysis</strong></summary>

```typescript
const IMAGE_SYSTEM_INSTRUCTION = `You are Geo Explorer, an expert AI geolocator... 
// ... The full, detailed prompt as seen in App.tsx ...
`;
```

</details>

---

## 💻 Codebase & Tech Stack

This project is built with a modern, performant, and developer-friendly tech stack.

| Technology      | Purpose                                                                                   | Why We Chose It                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **React**       | Frontend library for building the user interface.                                         | Component-based architecture is perfect for managing a complex UI like a chat application. Its ecosystem and performance are unparalleled. |
| **TypeScript**  | Superset of JavaScript that adds static typing.                                           | Essential for building a robust, maintainable application. Type safety prevents countless bugs in a complex state-driven app.         |
| **Tailwind CSS**| A utility-first CSS framework for rapid UI development.                                     | Allows for building a beautiful, custom design system directly in the markup without writing custom CSS. Perfect for fast iteration.       |
| **Gemini AI**   | Google's next-generation Large Language Model.                                            | The core of our "brain." We specifically use `gemini-2.5-flash` for its powerful multimodal capabilities, tool use (grounding), and long context window. |

### File-by-File Breakdown
-   `index.html`: The single HTML entry point. Includes custom fonts and animations.
-   `metadata.json`: Configures app name, description, and requests `geolocation` permission.
-   `index.tsx`: Renders the main `<App />` component into the DOM.
-   `types.ts`: Centralized TypeScript type definitions for type safety (`ChatMessage`, `MapConfig`).
-   `utils.ts`: Pure helper functions (`fileToBase64`).
-   `components/Icons.tsx`: Library of reusable SVG icon components.
-   `components/MapDisplay.tsx`: The presentational component for the map `iframe`.
-   `components/ChatMessage.tsx`: Renders a single message bubble, suggestions, and sources.
-   `components/ChatInput.tsx`: The controlled form for all user input.
-   **`App.tsx`**: **The Orchestrator.** Manages all state, contains the AI system prompts, handles the API lifecycle, parses responses for directives, and passes data down to child components. It is the bridge between the AI's brain and the UI.
-   **`README.md`**: This document. You are here! 👋

---

## 🤝 Getting Started & Contributing

Geo Explorer is an open-source project, and we welcome contributions.

### Running Locally
1.  **Clone:** `git clone https://github.com/your-repo/geo-explorer.git`
2.  **Install:** `npm install`
3.  **API Key:** Set up your `.env` file with your Google AI API key.
4.  **Run:** `npm run dev`

### How to Contribute
1.  **Fork the repository.**
2.  **Create a new branch** (`git checkout -b feature/AmazingNewFeature`).
3.  **Submit a pull request** with a detailed description of your changes.

We are particularly interested in contributions that:
-   Improve the AI's prompting strategy.
-   Enhance the user interface and experience.
-   Add new, creative features from our roadmap.

---

## 🛣️ The Future of Open-Source Geolocation

This project is just the beginning. The foundation we have built—a dynamic, reasoning AI bridged to a reactive UI—is incredibly powerful. The roadmap for Geo Explorer is ambitious.

-   [ ] **Clickable Map Pins for Itineraries:** Parse locations from itinerary text and display them as clickable pins on the map.
-   [ ] **Voice Input/Output:** Integrate the Web Speech API for a hands-free experience.
-   [ ] **User Accounts & Saved Locations:** Allow users to save their favorite locations, routes, and itineraries.
-   [ ] **Enhanced AI Tooling:** Give the AI more "tools" to work with, such as a live weather API or a hotel booking API, to make its itineraries even more actionable.

**Join us in building the future of how we interact with our world.**

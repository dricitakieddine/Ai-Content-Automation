# AI Google Calendar Assistant

An AI‑powered scheduling assistant that turns natural‑language requests into automated Google Calendar actions — built with an LLM agent, n8n orchestration, and the Google Calendar API.

![Screenshot](profile.jpg)

## Features

- **Natural‑language scheduling** – type or speak a request like *"Schedule a meeting with Ahmed tomorrow at 3 PM"*.
- **AI intent understanding** – the LLM interprets the action (create, update, delete) and extracts structured data.
- **Date & time resolution** – relative expressions ("tomorrow", "next week") are resolved to actual dates.
- **Automated calendar actions** – events are created, updated, or deleted without manual clicks.
- **Confirmation feedback** – the assistant replies with what was scheduled.
- **End‑to‑end workflow** – n8n orchestrates the entire pipeline from request to confirmation.

## Tech Stack

- **n8n** – workflow orchestration
- **OpenAI API** – LLM for intent extraction
- **Google Calendar API** – event management
- **React + Tailwind** – UI (this dashboard)
- **Webhooks** – trigger workflows on request

## How It Works

1. User sends a natural‑language request.
2. AI extracts structured data (person, date, time, action).
3. n8n workflow calls the Google Calendar API.
4. Assistant confirms the scheduled event.

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/ai-calendar-assistant.git
   cd ai-calendar-assistant
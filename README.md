# 📊 SIPAC Dashboard — institutional planning & tracking

Frontend of **SIPAC**, my B.Eng. thesis project at the *Universidad de las Ciencias Informáticas*: a platform to plan and track an institution's activities, with KPI cards, charts, embedded **Grafana** panels and a bilingual interface. It consumes a **Django REST API** on top of a tuned **PostgreSQL** database.

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-embedded-F46800?logo=grafana&logoColor=white)
![Django](https://img.shields.io/badge/API-Django-092E20?logo=django&logoColor=white)

## Features

- 🔐 Login and registration against the Django API (token-based auth service).
- 📈 Dashboard with stat cards and activity charts (Chart.js / vue-chartjs).
- 📡 **Grafana integration**: panels embedded through a `useGrafana` composable (time range, auto-refresh, loading state) and predefined queries for activities, tasks and users.
- 🌐 Internationalization (Spanish / English) with `vue-i18n` and a language switcher.
- 🧭 Views for dashboard, tables, profile and settings, with a responsive sidebar layout.

## Structure

```
src/
├── views/          Dashboard, Login, Register, Profile, tables…
├── components/     dashboard/ (StatCard, ActivityChart, GrafanaPanel, Sidebar, TopBar…)
├── composables/    useGrafana.js
├── services/       api.service.js · auth.service.js · grafana.service.js
├── queries/        grafana/ (activities, tasks, users)
├── i18n/           locales/es.json · locales/en.json
└── router/         route definitions
```

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

The API base URL is set in `src/services/api.service.js` (default `http://127.0.0.1:8001/v1/`), and Grafana is reached through the `/grafana` proxy configured in `vite.config.js`.

---

Made by **[Dariel Angel Arro Moreno](https://darielangel.github.io)** · Full-stack developer (.NET · Vue · Django)

Perfetto 👍
Ti faccio un **recap stile README**, chiaro, ordinato e realistico, che puoi **copiare e incollare** nel progetto.
Include **stato attuale**, **architettura**, **regole**, **API**, **cosa manca**.

---

# 🏓 PingPong App – README

Applicazione web per la gestione del **ping pong amatoriale con logiche professionali**, ispirata ai circuiti ufficiali (ATP / WTA).
Consente a un gruppo di giocatori di registrarsi, giocare match singoli, vedere ranking ELO, statistiche, profili pubblici e storici match.

---

## 🧱 STACK TECNOLOGICO

### Backend (ME*N*)

* Node.js
* Express
* MongoDB + Mongoose
* JWT Authentication
* ELO Rating System

### Frontend

* Angular (NgModule classico)
* HTML + CSS separati
* HttpClient + Interceptor JWT
* Guard per rotte protette
* UX mobile-first (PWA-ready)

---

## 🔐 AUTENTICAZIONE

* Login / Register con JWT
* Token salvato in `localStorage`
* Middleware `authGuard` protegge tutte le rotte sensibili
* Endpoint `/users/me` restituisce l’utente loggato

---

## 👤 UTENTI

### User Model (semplificato)

```js
{
  username: String,
  email: String,
  role: 'USER' | 'ADMIN',
  eloRating: Number,
  stats: {
    matchesPlayed: Number,
    wins: Number,
    losses: Number,
    setsWon: Number,
    setsLost: Number,
    pointsFor: Number,
    pointsAgainst: Number
  }
}
```

* Ranking **individuale**
* Statistiche **persistite**, non ricalcolate
* Profilo pubblico accessibile

---

## 🏆 MATCH

### Tipologia

* Attualmente: **SINGOLO**
* (Doppio previsto in futuro)

### Regole configurabili per match

* Numero set:

    * 1 set
    * 3 set (best of 3)
* Punteggio set:

    * a 11
    * a 21

---

## ✅ VALIDAZIONE PUNTEGGI (UFFICIALI)

### Regola generale

* **Scarto minimo di 2**
* Vince solo chi **raggiunge o supera** il punteggio massimo

### Set a 11

* ✅ `11–0 … 11–9`
* ❌ `11–10`
* ✅ `12–10`
* ✅ `13–11`
* ❌ `10–8`

### Set a 21

* ✅ `21–0 … 21–19`
* ❌ `21–20`
* ✅ `22–20`
* ✅ `23–21`

### Funzione di validazione

```js
function validateSet(set, rules)
```

Usata **server-side**, quindi il backend è sempre autoritativo.

---

## 🧠 LOGICA MATCH

* Inserimento dinamico:

    * 1 set → 1 sezione
    * 3 set → 3 sezioni
* Il vincitore è determinato dai set vinti
* L’ELO viene aggiornato **solo per match singoli**
* Le statistiche utente vengono aggiornate al salvataggio del match

---

## 📊 ELO RATING

* Sistema ELO classico
* Aggiornato a ogni match singolo
* Ranking globale ordinato per ELO

---

## 📡 API MATCH (ATTUALI)

### Inserimento match

```
POST /api/matches
```

Protetta da `authGuard`

### Match dell’utente loggato

```
GET /api/matches/me
```

### Ultimi match globali

```
GET /api/matches/last
```

### Head to Head

```
GET /api/matches/head-to-head/:playerA/:playerB
```

Restituisce tutti i match tra due giocatori, indipendentemente dall’ordine player1/player2.

### Tutti i match

```
GET /api/matches
```

(Admin / uso futuro)

---

## 🖥️ FRONTEND – SEZIONI PRINCIPALI

### Login / Register

* Centrati
* UX pulita
* Redirect automatico

### Dashboard

* Nome utente (“Ciao Mario”)
* ELO attuale
* Posizione in classifica
* Ultimi match

### Ranking

* Lista ordinata per ELO
* Click su giocatore → profilo pubblico

### Profilo Giocatore

* Dati pubblici
* Statistiche
* Storico match
* Head to Head con utente loggato

### Inserimento Match

* Selezione avversario (escluso se stesso)
* Selezione:

    * 1 o 3 set
    * set a 11 o 21
* Input dinamico punteggi
* Validazione backend

---

## 📁 STRUTTURA BACKEND (SEMPLIFICATA)

```
src/
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── match.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── match.routes.js
├── models/
│   ├── User.js
│   └── Match.js
├── middlewares/
│   └── auth.middleware.js
├── utils/
│   ├── validateSet.js
│   └── elo.js
└── app.js
```

---

## 🟡 STATO ATTUALE DEL PROGETTO

### ✅ COMPLETATO

* Auth
* Ranking
* Inserimento match
* Validazione punteggi corretta
* ELO
* Head to Head
* Storico match base
* UI funzionante

### 🔜 DA FARE (ROADMAP)

#### F9 – Storico match avanzato

* Punteggi per set
* Vittoria / sconfitta
* Filtri

#### F10 – Dashboard sportiva

* Variazione ELO ultimo match
* Streak
* Card più ricche

#### F11 – Head to Head avanzato

* Statistiche aggregate
* Pulsante “Rivincita”

#### F12 – Tornei

* Round robin
* Eliminazione diretta
* Classifica torneo
* Impatto ELO ponderato

#### F13 – Doppio

* Coppie
* Statistiche separate
* Nessun impatto ranking singolo

#### F14 – UX avanzata

* Grafico ELO
* Badge
* PWA offline
* Notifiche

---

## 🎯 FILOSOFIA DEL PROGETTO

Non è solo un CRUD di match, ma una **vera esperienza sportiva digitale**:

* crescita nel tempo
* rivalità
* ranking credibile
* regole ufficiali
* base solida per estensioni future

---

1 -- Storico match per singolo giocatore (profile/:id)

2 -- Head-to-head funzionante davvero
3 -- tornei

# Wink Backend - Technical Test

Questa è una REST API sviluppata con **NestJS** e **MongoDB** per un test tecnico. Il progetto implementa un sistema di gestione post (CMS) e una visualizzazione pubblica (Blog), con autenticazione JWT completa.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (progettato su Express)
- **Linguaggio**: TypeScript
- **Database**: MongoDB
- **ORM**: Prisma ORM (v6)
- **Documentazione**: Swagger (OpenAPI 3.0)
- **Validazione**: Class-validator & Zod
- **Autenticazione**: JWT (Json Web Token) con Passport

---

## Setup e Installazione

1. **Clona la repository**:

   ```bash
   git clone https://github.com/miketester10/wink-backend.git
   cd wink_be
   ```

2. **Installa le dipendenze**:

   ```bash
   npm install
   ```

3. **Configura l'ambiente**:
   Crea un file `.env` nella root del progetto basandoti sulle variabili richieste:

   ```env
   DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/wink_db"
   JWT_SECRET="tua_secret_super_sicura"
   JWT_EXPIRES_IN=24
   PORT=3001
   API_PREFIX="api/v1"
   NODE_ENV="development"
   ```

4. **Inizializza il database e Prisma**:

   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

5. **Avvia il server**:

   ```bash
   # Sviluppo
   npm run start:dev

   # Produzione
   npm run build
   npm run start:prod
   ```

---

## Documentazione API (Swagger)

Una volta avviato il server, la documentazione interattiva è disponibile all'indirizzo:
`http://localhost:3001/api/v1/docs`

---

## Credenziali di Test

Il database è già popolato con i seguenti utenti e relativi post di esempio per testare le funzionalità CMS e Blog:

### Utente 1

- **Email**: `user@example.com`
- **Password**: `password123`

### Utente 2

- **Email**: `user2@example.com`
- **Password**: `password123`

---

## Funzionalità principali

- **Blog Pubblico**: `GET /posts` per visualizzare tutti i post pubblicati. Supporta **paginazione completa** e **filtro per hashtag**.
- **CMS (Protetto)**:
  - `POST /posts`: Crea un nuovo post (stato default: _draft_, autore: _Brian Fox_).
  - `POST /posts/:id/publish`: Pubblica un post esistente.
  - `DELETE /posts/:id`: Elimina un post (solo se ne sei l'autore).
  - `GET /posts/my-posts`: Visualizza tutti i tuoi post (sia bozze che pubblicati). Supporta **paginazione completa** e **filtro per hashtag**.
- **Auth**: Registrazione e Login con rilascio di token JWT.

---

## Qualità del Codice

- **Paginazione Avanzata**: Implementata tramite `prisma-extension-pagination` per tutte le liste di post, con metadata completi (`totalCount`, `totalPages`, `currentPage`, etc.).
- **Filtro Hashtags**: Entrambi gli endpoint di consultazione dei post permettono di filtrare i risultati per uno o più hashtag tramite query parameters.
- **Barrel Files**: Utilizzo di file `index.ts` per export puliti e centralizzati.
- **Standardizzazione Swagger**: Ogni endpoint include descrizioni chiare di input e tutti i possibili codici di risposta HTTP.
- **Validazione**: Input sanitizzati e validati tramite DTO e Pipes globali.

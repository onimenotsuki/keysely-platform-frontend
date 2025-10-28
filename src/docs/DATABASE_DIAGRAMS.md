# Database Schema - Keysely Platform# Database Schema - Keysely Platform

## Overview## Overview

This document contains the complete database structure of Keysely Platform, including all tables, relationships, indexes, RLS (Row Level Security) policies, and functions.This document contains the complete database structure of Keysely Platform, including all tables, relationships, indexes, RLS (Row Level Security) policies, and functions.

## UML Diagram - Entity-Relationship## UML Diagram - Entity-Relationship

`mermaid`mermaid

erDiagramerDiagram

    auth_users ||--o| profiles : "has one"    auth_users ||--o| profiles : "has one"

    profiles ||--o{ spaces : "owns many"    profiles ||--o{ spaces : "owns many"

    profiles ||--o{ bookings : "makes many"    profiles ||--o{ bookings : "makes many"

    profiles ||--o{ reviews : "writes many"    profiles ||--o{ reviews : "writes many"

    profiles ||--o{ favorites : "has many"    profiles ||--o{ favorites : "has many"

    profiles ||--o{ conversations_as_user : "initiates many"    profiles ||--o{ conversations_as_user : "initiates many"

    profiles ||--o{ conversations_as_owner : "receives many"    profiles ||--o{ conversations_as_owner : "receives many"

    profiles ||--o{ messages : "sends many"    profiles ||--o{ messages : "sends many"

    profiles ||--o| stripe_connect_accounts : "has one"    profiles ||--o| stripe_connect_accounts : "has one"

    profiles ||--o{ notifications : "receives many"    profiles ||--o{ notifications : "receives many"



    categories ||--o{ spaces : "categorizes many"    categories ||--o{ spaces : "categorizes many"



    spaces ||--o{ bookings : "receives many"    spaces ||--o{ bookings : "receives many"

    spaces ||--o{ reviews : "receives many"    spaces ||--o{ reviews : "receives many"

    spaces ||--o{ favorites : "favorited by many"    spaces ||--o{ favorites : "favorited by many"

    spaces ||--o{ conversations : "related to many"    spaces ||--o{ conversations : "related to many"



    bookings ||--o| reviews : "can have one"    bookings ||--o| reviews : "can have one"



    conversations ||--o{ messages : "contains many"    conversations ||--o{ messages : "contains many"



    auth_users {    auth_users {

        uuid id PK        uuid id PK

        string email        string email

        timestamp created_at        timestamp created_at

    }    }



    profiles {    profiles {

        uuid id PK        uuid id PK

        uuid user_id FK "UNIQUE, REFERENCES auth.users"        uuid user_id FK "UNIQUE, REFERENCES auth.users"

        text full_name        text full_name

        text avatar_url        text avatar_url

        text phone        text phone

        text bio        text bio

        text company        text company

        timestamp created_at        timestamp created_at

        timestamp updated_at        timestamp updated_at

    }    }



    categories {    categories {

        uuid id PK        uuid id PK

        text name        text name

        text description        text description

        text image_url        text image_url

        timestamp created_at        timestamp created_at

    }    }



    spaces {    spaces {

        uuid id PK        uuid id PK

        uuid owner_id FK "REFERENCES profiles.user_id"        uuid owner_id FK "REFERENCES profiles.user_id"

        text title        text title

        text description        text description

        uuid category_id FK "REFERENCES categories"        uuid category_id FK "REFERENCES categories"

        text address        text address

        text city        text city

        decimal price_per_hour        decimal price_per_hour

        integer capacity        integer capacity

        integer area_sqm        integer area_sqm

        text[] images        text[] images

        text[] features        text[] features

        text[] amenities        text[] amenities

        jsonb availability_hours        jsonb availability_hours

        text policies        text policies

        boolean is_active        boolean is_active

        decimal rating        decimal rating

        integer total_reviews        integer total_reviews

        timestamp created_at        timestamp created_at

        timestamp updated_at        timestamp updated_at

    }    }



    bookings {    bookings {

        uuid id PK        uuid id PK

        uuid user_id FK "REFERENCES profiles.user_id"        uuid user_id FK "REFERENCES profiles.user_id"

        uuid space_id FK "REFERENCES spaces"        uuid space_id FK "REFERENCES spaces"

        date start_date        date start_date

        date end_date        date end_date

        time start_time        time start_time

        time end_time        time end_time

        integer total_hours        integer total_hours

        decimal total_amount        decimal total_amount

        integer guests_count        integer guests_count

        text status "CHECK: pending|confirmed|cancelled|completed"        text status "CHECK: pending|confirmed|cancelled|completed"

        text notes        text notes

        text stripe_payment_intent_id        text stripe_payment_intent_id

        text stripe_session_id        text stripe_session_id

        text payment_status        text payment_status

        timestamp created_at        timestamp created_at

        timestamp updated_at        timestamp updated_at

    }    }



    reviews {    reviews {

        uuid id PK        uuid id PK

        uuid user_id FK "REFERENCES profiles.user_id"        uuid user_id FK "REFERENCES profiles.user_id"

        uuid space_id FK "REFERENCES spaces"        uuid space_id FK "REFERENCES spaces"

        uuid booking_id FK "REFERENCES bookings, NULL"        uuid booking_id FK "REFERENCES bookings, NULL"

        integer rating "CHECK: 1-5"        integer rating "CHECK: 1-5"

        text comment        text comment

        timestamp created_at        timestamp created_at

    }    }



    favorites {    favorites {

        uuid id PK        uuid id PK

        uuid user_id FK "REFERENCES profiles.user_id"        uuid user_id FK "REFERENCES profiles.user_id"

        uuid space_id FK "REFERENCES spaces"        uuid space_id FK "REFERENCES spaces"

        timestamp created_at        timestamp created_at

        unique user_space "UNIQUE(user_id, space_id)"        unique user_space "UNIQUE(user_id, space_id)"

    }    }



    conversations {    conversations {

        uuid id PK        uuid id PK

        uuid space_id FK "REFERENCES spaces"        uuid space_id FK "REFERENCES spaces"

        uuid user_id "User who initiated"        uuid user_id "User who initiated"

        uuid owner_id "Space owner"        uuid owner_id "Space owner"

        timestamp created_at        timestamp created_at

        timestamp updated_at        timestamp updated_at

    }    }



    messages {    messages {

        uuid id PK        uuid id PK

        uuid conversation_id FK "REFERENCES conversations"        uuid conversation_id FK "REFERENCES conversations"

        uuid sender_id "Can be user_id or owner_id"        uuid sender_id "Can be user_id or owner_id"

        text content        text content

        boolean is_read        boolean is_read

        timestamp created_at        timestamp created_at

    }    }



    stripe_connect_accounts {    stripe_connect_accounts {

        uuid id PK        uuid id PK

        uuid user_id FK "REFERENCES auth.users"        uuid user_id FK "REFERENCES auth.users"

        text stripe_account_id "UNIQUE"        text stripe_account_id "UNIQUE"

        boolean account_enabled        boolean account_enabled

        boolean details_submitted        boolean details_submitted

        boolean charges_enabled        boolean charges_enabled

        boolean payouts_enabled        boolean payouts_enabled

        text onboarding_url        text onboarding_url

        timestamp created_at        timestamp created_at

        timestamp updated_at        timestamp updated_at

    }    }



    notifications {    notifications {

        uuid id PK        uuid id PK

        uuid user_id FK "REFERENCES auth.users"        uuid user_id FK "REFERENCES auth.users"

        text title        text title

        text message        text message

        text type "CHECK: booking|payment|review|message|system"        text type "CHECK: booking|payment|review|message|system"

        boolean is_read        boolean is_read

        uuid related_id "Generic reference"        uuid related_id "Generic reference"

        timestamp created_at        timestamp created_at

        timestamp updated_at        timestamp updated_at

    }    }

`````



## Detailed Tables## Detailed Tables



### 1. profiles### 1. profiles



**Description:** Extended profile for authenticated users.**Description:** Extended profile for authenticated users.



**Fields:****Fields:**



- `id` (uuid, PK): Unique profile identifier- `id` (uuid, PK): Unique profile identifier

- `user_id` (uuid, FK → auth.users, UNIQUE): Reference to authentication user- `user_id` (uuid, FK → auth.users, UNIQUE): Reference to authentication user

- `full_name` (text): User's full name- `full_name` (text): User's full name

- `avatar_url` (text): Profile image URL- `avatar_url` (text): Profile image URL

- `phone` (text): Phone number- `phone` (text): Phone number

- `bio` (text): User biography/description- `bio` (text): User biography/description

- `company` (text): User's company- `company` (text): User's company

- `created_at` (timestamp): Creation date- `created_at` (timestamp): Creation date

- `updated_at` (timestamp): Last update date- `updated_at` (timestamp): Last update date



**Relationships:****Relationships:**



- One to One with `auth.users` (ON DELETE CASCADE)- One to One with `auth.users` (ON DELETE CASCADE)

- One to Many with `spaces` (as owner)- One to Many with `spaces` (as owner)

- One to Many with `bookings` (as user)- One to Many with `bookings` (as user)

- One to Many with `reviews` (as author)- One to Many with `reviews` (as author)

- One to Many with `favorites`- One to Many with `favorites`

- One to Many with `conversations` (as user or owner)- One to Many with `conversations` (as user or owner)

- One to One with `stripe_connect_accounts`- One to One with `stripe_connect_accounts`



**RLS Policies:****RLS Policies:**



- ✅ SELECT: Everyone can view all profiles- ✅ SELECT: Everyone can view all profiles

- ✅ INSERT: Users can create their own profile- ✅ INSERT: Users can create their own profile

- ✅ UPDATE: Users can update only their profile- ✅ UPDATE: Users can update only their profile



**Triggers:****Triggers:**



- `on_auth_user_created`: Automatically creates a profile when a user registers- `on_auth_user_created`: Automatically creates a profile when a user registers

- `update_profiles_updated_at`: Updates `updated_at` automatically- `update_profiles_updated_at`: Updates `updated_at` automatically



------



### 2. categories### 2. categories

**Descripción:** Categorías de espacios de trabajo.

**Description:** Workspace categories.

**Campos:**

**Fields:**- `id` (uuid, PK): Identificador único

- `name` (text, NOT NULL): Nombre de la categoría

- `id` (uuid, PK): Unique identifier- `description` (text): Descripción de la categoría

- `name` (text, NOT NULL): Category name- `image_url` (text): URL de imagen representativa

- `description` (text): Category description- `created_at` (timestamp): Fecha de creación

- `image_url` (text): Representative image URL

- `created_at` (timestamp): Creation date**Relaciones:**

- Uno a Muchos con `spaces`

**Relationships:**

**RLS Policies:**

- One to Many with `spaces`- ✅ SELECT: Todos pueden ver las categorías (público)



**RLS Policies:****Datos Seed:**

- Oficina Privada

- ✅ SELECT: Everyone can view categories (public)- Sala de Reuniones

- Coworking

**Seed Data:**- Sala de Conferencias

- Estudio Creativo

- Private Office- Consultorio Médico

- Meeting Room- Consultorios

- Coworking- Espacios para Consulta

- Conference Room

- Creative Studio---

- Medical Office

- Consulting Rooms### 3. spaces

- Consultation Spaces**Descripción:** Espacios de trabajo disponibles para renta.



---**Campos:**

- `id` (uuid, PK): Identificador único

### 3. spaces- `owner_id` (uuid, FK → profiles.user_id): Propietario del espacio

- `title` (text, NOT NULL): Título del espacio

**Description:** Available workspaces for rent.- `description` (text): Descripción detallada

- `category_id` (uuid, FK → categories): Categoría del espacio

**Fields:**- `address` (text, NOT NULL): Dirección física

- `city` (text, NOT NULL): Ciudad

- `id` (uuid, PK): Unique identifier- `price_per_hour` (decimal(10,2), NOT NULL): Precio por hora

- `owner_id` (uuid, FK → profiles.user_id): Space owner- `capacity` (integer, NOT NULL): Capacidad de personas

- `title` (text, NOT NULL): Space title- `area_sqm` (integer): Área en metros cuadrados

- `description` (text): Detailed description- `images` (text[]): Array de URLs de imágenes

- `category_id` (uuid, FK → categories): Space category- `features` (text[]): Características del espacio

- `address` (text, NOT NULL): Physical address- `amenities` (text[]): Amenidades disponibles

- `city` (text, NOT NULL): City- `availability_hours` (jsonb): Horarios de disponibilidad

- `price_per_hour` (decimal(10,2), NOT NULL): Price per hour- `policies` (text): Políticas del espacio

- `capacity` (integer, NOT NULL): Person capacity- `is_active` (boolean, default: true): Estado activo/inactivo

- `area_sqm` (integer): Area in square meters- `rating` (decimal(2,1), default: 0): Calificación promedio

- `images` (text[]): Array of image URLs- `total_reviews` (integer, default: 0): Total de reseñas

- `features` (text[]): Space features- `created_at` (timestamp): Fecha de creación

- `amenities` (text[]): Available amenities- `updated_at` (timestamp): Fecha de última actualización

- `availability_hours` (jsonb): Availability schedule

- `policies` (text): Space policies**Relaciones:**

- `is_active` (boolean, default: true): Active/inactive status- Muchos a Uno con `profiles` (como propietario)

- `rating` (decimal(2,1), default: 0): Average rating- Muchos a Uno con `categories`

- `total_reviews` (integer, default: 0): Total reviews- Uno a Muchos con `bookings`

- `created_at` (timestamp): Creation date- Uno a Muchos con `reviews`

- `updated_at` (timestamp): Last update date- Uno a Muchos con `favorites`

- Uno a Muchos con `conversations`

**Relationships:**

**RLS Policies:**

- Many to One with `profiles` (as owner)- ✅ SELECT: Todos pueden ver espacios activos; propietarios ven todos sus espacios

- Many to One with `categories`- ✅ INSERT: Propietarios pueden crear espacios

- One to Many with `bookings`- ✅ UPDATE: Propietarios pueden actualizar solo sus espacios

- One to Many with `reviews`- ✅ DELETE: Propietarios pueden eliminar solo sus espacios

- One to Many with `favorites`

- One to Many with `conversations`**Triggers:**

- `update_spaces_updated_at`: Actualiza `updated_at` automáticamente

**RLS Policies:**

---

- ✅ SELECT: Everyone can view active spaces; owners view all their spaces

- ✅ INSERT: Owners can create spaces### 4. bookings

- ✅ UPDATE: Owners can update only their spaces**Descripción:** Reservaciones de espacios.

- ✅ DELETE: Owners can delete only their spaces

**Campos:**

**Triggers:**- `id` (uuid, PK): Identificador único

- `user_id` (uuid, FK → profiles.user_id): Usuario que reserva

- `update_spaces_updated_at`: Updates `updated_at` automatically- `space_id` (uuid, FK → spaces): Espacio reservado

- `start_date` (date, NOT NULL): Fecha de inicio

---- `end_date` (date, NOT NULL): Fecha de fin

- `start_time` (time, NOT NULL): Hora de inicio

### 4. bookings- `end_time` (time, NOT NULL): Hora de fin

- `total_hours` (integer, NOT NULL): Total de horas reservadas

**Description:** Space reservations.- `total_amount` (decimal(10,2), NOT NULL): Monto total

- `guests_count` (integer, default: 1): Número de invitados

**Fields:**- `status` (text, NOT NULL, default: 'pending'): Estado de la reserva

  - CHECK: 'pending' | 'confirmed' | 'cancelled' | 'completed'

- `id` (uuid, PK): Unique identifier- `notes` (text): Notas adicionales

- `user_id` (uuid, FK → profiles.user_id): User making the booking- `stripe_payment_intent_id` (text): ID de intención de pago Stripe

- `space_id` (uuid, FK → spaces): Booked space- `stripe_session_id` (text): ID de sesión Stripe

- `start_date` (date, NOT NULL): Start date- `payment_status` (text, default: 'pending'): Estado del pago

- `end_date` (date, NOT NULL): End date- `created_at` (timestamp): Fecha de creación

- `start_time` (time, NOT NULL): Start time- `updated_at` (timestamp): Fecha de última actualización

- `end_time` (time, NOT NULL): End time

- `total_hours` (integer, NOT NULL): Total hours booked**Relaciones:**

- `total_amount` (decimal(10,2), NOT NULL): Total amount- Muchos a Uno con `profiles` (usuario)

- `guests_count` (integer, default: 1): Number of guests- Muchos a Uno con `spaces`

- `status` (text, NOT NULL, default: 'pending'): Booking status- Uno a Uno con `reviews` (opcional)

  - CHECK: 'pending' | 'confirmed' | 'cancelled' | 'completed'

- `notes` (text): Additional notes**RLS Policies:**

- `stripe_payment_intent_id` (text): Stripe payment intent ID- ✅ SELECT: Usuarios ven sus propias reservas; propietarios ven reservas de sus espacios

- `stripe_session_id` (text): Stripe session ID- ✅ INSERT: Usuarios pueden crear sus propias reservas

- `payment_status` (text, default: 'pending'): Payment status- ✅ UPDATE: Usuarios pueden actualizar sus propias reservas

- `created_at` (timestamp): Creation date

- `updated_at` (timestamp): Last update date**Triggers:**

- `update_bookings_updated_at`: Actualiza `updated_at` automáticamente

**Relationships:**

---

- Many to One with `profiles` (user)

- Many to One with `spaces`### 5. reviews

- One to One with `reviews` (optional)**Descripción:** Reseñas y calificaciones de espacios.



**RLS Policies:****Campos:**

- `id` (uuid, PK): Identificador único

- ✅ SELECT: Users view their own bookings; owners view bookings for their spaces- `user_id` (uuid, FK → profiles.user_id): Usuario que escribe la reseña

- ✅ INSERT: Users can create their own bookings- `space_id` (uuid, FK → spaces): Espacio reseñado

- ✅ UPDATE: Users can update their own bookings- `booking_id` (uuid, FK → bookings, NULL): Reservación relacionada (opcional)

- `rating` (integer, NOT NULL): Calificación (1-5)

**Triggers:**  - CHECK: rating >= 1 AND rating <= 5

- `comment` (text): Comentario de la reseña

- `update_bookings_updated_at`: Updates `updated_at` automatically- `created_at` (timestamp): Fecha de creación



---**Relaciones:**

- Muchos a Uno con `profiles` (autor)

### 5. reviews- Muchos a Uno con `spaces`

- Muchos a Uno con `bookings` (opcional, ON DELETE SET NULL)

**Description:** Space reviews and ratings.

**RLS Policies:**

**Fields:**- ✅ SELECT: Todos pueden ver reseñas (público)

- ✅ INSERT: Usuarios pueden crear sus propias reseñas

- `id` (uuid, PK): Unique identifier- ✅ UPDATE: Usuarios pueden actualizar sus propias reseñas

- `user_id` (uuid, FK → profiles.user_id): User writing the review

- `space_id` (uuid, FK → spaces): Reviewed space---

- `booking_id` (uuid, FK → bookings, NULL): Related booking (optional)

- `rating` (integer, NOT NULL): Rating (1-5)### 6. favorites

  - CHECK: rating >= 1 AND rating <= 5**Descripción:** Espacios favoritos de los usuarios.

- `comment` (text): Review comment

- `created_at` (timestamp): Creation date**Campos:**

- `id` (uuid, PK): Identificador único

**Relationships:**- `user_id` (uuid, FK → profiles.user_id): Usuario

- `space_id` (uuid, FK → spaces): Espacio favorito

- Many to One with `profiles` (author)- `created_at` (timestamp): Fecha de creación

- Many to One with `spaces`- **CONSTRAINT:** UNIQUE(user_id, space_id)

- Many to One with `bookings` (optional, ON DELETE SET NULL)

**Relaciones:**

**RLS Policies:**- Muchos a Uno con `profiles`

- Muchos a Uno con `spaces`

- ✅ SELECT: Everyone can view reviews (public)

- ✅ INSERT: Users can create their own reviews**RLS Policies:**

- ✅ UPDATE: Users can update their own reviews- ✅ SELECT: Usuarios ven solo sus propios favoritos

- ✅ INSERT: Usuarios pueden agregar favoritos

---- ✅ DELETE: Usuarios pueden eliminar sus favoritos



### 6. favorites---



**Description:** User favorite spaces.### 7. conversations

**Descripción:** Conversaciones entre usuarios y propietarios de espacios.

**Fields:**

**Campos:**

- `id` (uuid, PK): Unique identifier- `id` (uuid, PK): Identificador único

- `user_id` (uuid, FK → profiles.user_id): User- `space_id` (uuid, FK → spaces): Espacio relacionado

- `space_id` (uuid, FK → spaces): Favorite space- `user_id` (uuid): Usuario que inicia la conversación

- `created_at` (timestamp): Creation date- `owner_id` (uuid): Propietario del espacio

- **CONSTRAINT:** UNIQUE(user_id, space_id)- `created_at` (timestamp): Fecha de creación

- `updated_at` (timestamp): Fecha de última actualización

**Relationships:**

**Relaciones:**

- Many to One with `profiles`- Muchos a Uno con `spaces`

- Many to One with `spaces`- Uno a Muchos con `messages`

- Relación implícita con `profiles` (user_id y owner_id)

**RLS Policies:**

**RLS Policies:**

- ✅ SELECT: Users view only their own favorites- ✅ SELECT: Usuarios/propietarios pueden ver sus propias conversaciones

- ✅ INSERT: Users can add favorites- ✅ INSERT: Usuarios pueden crear conversaciones

- ✅ DELETE: Users can delete their favorites- ✅ UPDATE: Usuarios/propietarios pueden actualizar sus conversaciones



---**Índices:**

- `idx_conversations_user_id` (user_id)

### 7. conversations- `idx_conversations_owner_id` (owner_id)

- `idx_conversations_space_id` (space_id)

**Description:** Conversations between users and space owners.

**Triggers:**

**Fields:**- `update_conversations_updated_at`: Actualiza `updated_at` automáticamente



- `id` (uuid, PK): Unique identifier**Realtime:**

- `space_id` (uuid, FK → spaces): Related space- ✅ Habilitado en `supabase_realtime` publication

- `user_id` (uuid): User who initiates the conversation- ✅ REPLICA IDENTITY FULL

- `owner_id` (uuid): Space owner

- `created_at` (timestamp): Creation date---

- `updated_at` (timestamp): Last update date

### 8. messages

**Relationships:****Descripción:** Mensajes dentro de conversaciones.



- Many to One with `spaces`**Campos:**

- One to Many with `messages`- `id` (uuid, PK): Identificador único

- Implicit relationship with `profiles` (user_id and owner_id)- `conversation_id` (uuid, FK → conversations): Conversación relacionada

- `sender_id` (uuid): ID del remitente (puede ser user_id o owner_id)

**RLS Policies:**- `content` (text, NOT NULL): Contenido del mensaje

- `is_read` (boolean, default: false): Estado de lectura

- ✅ SELECT: Users/owners can view their own conversations- `created_at` (timestamp): Fecha de creación

- ✅ INSERT: Users can create conversations

- ✅ UPDATE: Users/owners can update their conversations**Relaciones:**

- Muchos a Uno con `conversations`

**Indexes:**- Relación implícita con `profiles` (sender_id)



- `idx_conversations_user_id` (user_id)**RLS Policies:**

- `idx_conversations_owner_id` (owner_id)- ✅ SELECT: Participantes de la conversación pueden ver mensajes

- `idx_conversations_space_id` (space_id)- ✅ INSERT: Participantes pueden enviar mensajes

- ✅ UPDATE: Participantes pueden actualizar mensajes (ej. marcar como leído)

**Triggers:**

**Índices:**

- `update_conversations_updated_at`: Updates `updated_at` automatically- `idx_messages_conversation_id` (conversation_id)

- `idx_messages_sender_id` (sender_id)

**Realtime:**- `idx_messages_created_at` (created_at)



- ✅ Enabled in `supabase_realtime` publication**Realtime:**

- ✅ REPLICA IDENTITY FULL- ✅ Habilitado en `supabase_realtime` publication

- ✅ REPLICA IDENTITY FULL

---

---

### 8. messages

### 9. stripe_connect_accounts

**Description:** Messages within conversations.**Descripción:** Cuentas de Stripe Connect para propietarios de espacios.



**Fields:****Campos:**

- `id` (uuid, PK): Identificador único

- `id` (uuid, PK): Unique identifier- `user_id` (uuid, FK → auth.users): Usuario propietario

- `conversation_id` (uuid, FK → conversations): Related conversation- `stripe_account_id` (text, UNIQUE): ID de cuenta en Stripe

- `sender_id` (uuid): Sender ID (can be user_id or owner_id)- `account_enabled` (boolean, default: false): Cuenta habilitada

- `content` (text, NOT NULL): Message content- `details_submitted` (boolean, default: false): Detalles enviados

- `is_read` (boolean, default: false): Read status- `charges_enabled` (boolean, default: false): Cargos habilitados

- `created_at` (timestamp): Creation date- `payouts_enabled` (boolean, default: false): Pagos habilitados

- `onboarding_url` (text): URL de onboarding de Stripe

**Relationships:**- `created_at` (timestamp): Fecha de creación

- `updated_at` (timestamp): Fecha de última actualización

- Many to One with `conversations`

- Implicit relationship with `profiles` (sender_id)**Relaciones:**

- Uno a Uno con `auth.users` (ON DELETE CASCADE)

**RLS Policies:**

**RLS Policies:**

- ✅ SELECT: Conversation participants can view messages- ✅ SELECT: Usuarios pueden ver su propia cuenta

- ✅ INSERT: Participants can send messages- ✅ INSERT: Usuarios pueden crear su propia cuenta

- ✅ UPDATE: Participants can update messages (e.g., mark as read)- ✅ UPDATE: Usuarios pueden actualizar su propia cuenta



**Indexes:****Triggers:**

- `update_stripe_connect_accounts_updated_at`: Actualiza `updated_at` automáticamente

- `idx_messages_conversation_id` (conversation_id)

- `idx_messages_sender_id` (sender_id)---

- `idx_messages_created_at` (created_at)

### 10. notifications

**Realtime:****Descripción:** Notificaciones del sistema para usuarios.



- ✅ Enabled in `supabase_realtime` publication**Campos:**

- ✅ REPLICA IDENTITY FULL- `id` (uuid, PK): Identificador único

- `user_id` (uuid, FK → auth.users): Usuario destinatario

---- `title` (text, NOT NULL): Título de la notificación

- `message` (text, NOT NULL): Mensaje de la notificación

### 9. stripe_connect_accounts- `type` (text, NOT NULL): Tipo de notificación

  - CHECK: 'booking' | 'payment' | 'review' | 'message' | 'system'

**Description:** Stripe Connect accounts for space owners.- `is_read` (boolean, default: false): Estado de lectura

- `related_id` (uuid): Referencia genérica a entidad relacionada

**Fields:**- `created_at` (timestamp): Fecha de creación

- `updated_at` (timestamp): Fecha de última actualización

- `id` (uuid, PK): Unique identifier

- `user_id` (uuid, FK → auth.users): Owner user**Relaciones:**

- `stripe_account_id` (text, UNIQUE): Stripe account ID- Muchos a Uno con `auth.users` (ON DELETE CASCADE)

- `account_enabled` (boolean, default: false): Account enabled- Referencia genérica a otras entidades vía `related_id`

- `details_submitted` (boolean, default: false): Details submitted

- `charges_enabled` (boolean, default: false): Charges enabled**RLS Policies:**

- `payouts_enabled` (boolean, default: false): Payouts enabled- ✅ SELECT: Usuarios pueden ver sus propias notificaciones

- `onboarding_url` (text): Stripe onboarding URL- ✅ UPDATE: Usuarios pueden actualizar sus notificaciones (ej. marcar como leído)

- `created_at` (timestamp): Creation date

- `updated_at` (timestamp): Last update date**Índices:**

- `idx_notifications_user_id` (user_id)

**Relationships:**- `idx_notifications_is_read` (user_id, is_read) - Índice compuesto

- `idx_notifications_created_at` (created_at DESC)

- One to One with `auth.users` (ON DELETE CASCADE)

**Triggers:**

**RLS Policies:**- `update_notifications_updated_at`: Actualiza `updated_at` automáticamente



- ✅ SELECT: Users can view their own account---

- ✅ INSERT: Users can create their own account

- ✅ UPDATE: Users can update their own account## Storage Buckets



**Triggers:**### space-images

**Descripción:** Almacenamiento de imágenes de espacios.

- `update_stripe_connect_accounts_updated_at`: Updates `updated_at` automatically

**Configuración:**

---- `public`: true

- Bucket ID: `space-images`

### 10. notifications

**Políticas de Storage:**

**Description:** System notifications for users.- ✅ SELECT: Todos pueden ver imágenes (público)

- ✅ INSERT: Usuarios autenticados pueden subir imágenes

**Fields:**- ✅ UPDATE: Usuarios pueden actualizar sus propias imágenes (folder = user_id)

- ✅ DELETE: Usuarios pueden eliminar sus propias imágenes (folder = user_id)

- `id` (uuid, PK): Unique identifier

- `user_id` (uuid, FK → auth.users): Recipient user---

- `title` (text, NOT NULL): Notification title

- `message` (text, NOT NULL): Notification message## Funciones (Functions)

- `type` (text, NOT NULL): Notification type

  - CHECK: 'booking' | 'payment' | 'review' | 'message' | 'system'### 1. handle_new_user()

- `is_read` (boolean, default: false): Read status**Propósito:** Crear automáticamente un perfil cuando se registra un nuevo usuario.

- `related_id` (uuid): Generic reference to related entity

- `created_at` (timestamp): Creation date**Trigger:** `on_auth_user_created` - AFTER INSERT en `auth.users`

- `updated_at` (timestamp): Last update date

**Lógica:**

**Relationships:**```sql

INSERT INTO public.profiles (user_id, full_name)

- Many to One with `auth.users` (ON DELETE CASCADE)VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');

- Generic reference to other entities via `related_id````



**RLS Policies:****Seguridad:** SECURITY DEFINER, search_path = public



- ✅ SELECT: Users can view their own notifications---

- ✅ UPDATE: Users can update their notifications (e.g., mark as read)

### 2. update_updated_at_column()

**Indexes:****Propósito:** Actualizar automáticamente la columna `updated_at` de cualquier tabla.



- `idx_notifications_user_id` (user_id)**Aplicado en:**

- `idx_notifications_is_read` (user_id, is_read) - Composite index- profiles

- `idx_notifications_created_at` (created_at DESC)- spaces

- bookings

**Triggers:**- conversations

- stripe_connect_accounts

- `update_notifications_updated_at`: Updates `updated_at` automatically- notifications



---**Lógica:**

```sql

## Storage BucketsNEW.updated_at = now();

RETURN NEW;

### space-images```



**Description:** Storage for space images.---



**Configuration:**## Índices (Indexes)



- `public`: true### Conversaciones y Mensajes

- Bucket ID: `space-images`- `idx_conversations_user_id` → conversations(user_id)

- `idx_conversations_owner_id` → conversations(owner_id)

**Storage Policies:**- `idx_conversations_space_id` → conversations(space_id)

- `idx_messages_conversation_id` → messages(conversation_id)

- ✅ SELECT: Everyone can view images (public)- `idx_messages_sender_id` → messages(sender_id)

- ✅ INSERT: Authenticated users can upload images- `idx_messages_created_at` → messages(created_at)

- ✅ UPDATE: Users can update their own images (folder = user_id)

- ✅ DELETE: Users can delete their own images (folder = user_id)### Notificaciones

- `idx_notifications_user_id` → notifications(user_id)

---- `idx_notifications_is_read` → notifications(user_id, is_read) [Compuesto]

- `idx_notifications_created_at` → notifications(created_at DESC)

## Functions

---

### 1. handle_new_user()

## Realtime Configuration

**Purpose:** Automatically create a profile when a new user registers.

### Tablas con Realtime Habilitado:

**Trigger:** `on_auth_user_created` - AFTER INSERT on `auth.users`- ✅ `messages` - Para chat en tiempo real

- ✅ `conversations` - Para actualización de conversaciones

**Logic:**

**Configuración:**

```sql```sql

INSERT INTO public.profiles (user_id, full_name)ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

```ALTER TABLE public.messages REPLICA IDENTITY FULL;

ALTER TABLE public.conversations REPLICA IDENTITY FULL;

**Security:** SECURITY DEFINER, search_path = public```



------



### 2. update_updated_at_column()## Resumen de Migraciones



**Purpose:** Automatically update the `updated_at` column for any table.| Fecha | Archivo | Descripción |

|-------|---------|-------------|

**Applied to:**| 2025-09-26 16:04:55 | `1ec91c5b...` | Creación inicial: profiles, categories, spaces, bookings, reviews, favorites + RLS + triggers |

| 2025-09-26 16:21:00 | `cfe73943...` | Actualización de ciudad a Guadalajara, México |

- profiles| 2025-09-26 17:04:50 | `9c15d42d...` | Storage bucket + políticas + seed categories |

- spaces| 2025-09-26 17:17:58 | `0122cf07...` | Agregado de categoría Consultorio Médico |

- bookings| 2025-09-26 19:05:01 | `2a67be54...` | Sistema de mensajería: conversations + messages + realtime |

- conversations| 2025-09-26 19:52:27 | `4f8a3f17...` | Stripe Connect: stripe_connect_accounts + campos en bookings |

- stripe_connect_accounts| 2025-09-26 20:04:24 | `86a08a6d...` | Sistema de notificaciones |

- notifications| 2025-09-26 21:19:27 | `21338ec9...` | Limpieza de categorías duplicadas + agregado de nuevas |



**Logic:**---



```sql## Notas de Seguridad (RLS)

NEW.updated_at = now();

RETURN NEW;Todas las tablas tienen Row Level Security (RLS) habilitado con políticas específicas:

```

✅ **Públicas (lectura):**

---- categories

- reviews

## Indexes- spaces (solo activos)



### Conversations and Messages🔒 **Protegidas por usuario:**

- profiles (lectura pública, escritura propia)

- `idx_conversations_user_id` → conversations(user_id)- bookings (usuario ve sus reservas, propietario ve reservas de sus espacios)

- `idx_conversations_owner_id` → conversations(owner_id)- favorites (solo propias)

- `idx_conversations_space_id` → conversations(space_id)- conversations (solo participantes)

- `idx_messages_conversation_id` → messages(conversation_id)- messages (solo participantes)

- `idx_messages_sender_id` → messages(sender_id)- notifications (solo propias)

- `idx_messages_created_at` → messages(created_at)- stripe_connect_accounts (solo propia)



### Notifications🛡️ **Cascade Deletes:**

- Eliminar usuario → elimina profile, bookings, reviews, favorites, stripe_connect_accounts, notifications

- `idx_notifications_user_id` → notifications(user_id)- Eliminar space → elimina bookings, reviews, favorites, conversations

- `idx_notifications_is_read` → notifications(user_id, is_read) [Composite]- Eliminar conversation → elimina messages

- `idx_notifications_created_at` → notifications(created_at DESC)

---

---

## Diagrama de Flujo de Datos Principal

## Realtime Configuration

```

### Tables with Realtime Enabled:Usuario se registra (auth.users)

    ↓

- ✅ `messages` - For real-time chatSe crea perfil automáticamente (profiles) [Trigger]

- ✅ `conversations` - For conversation updates    ↓

Usuario puede:

**Configuration:**    ├── Listar espacios (spaces) [Rol: Propietario]

    │   ├── Configurar Stripe Connect (stripe_connect_accounts)

```sql    │   └── Recibir conversaciones (conversations) [Rol: Owner]

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;    │

ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;    └── Reservar espacios (bookings) [Rol: Cliente]

ALTER TABLE public.messages REPLICA IDENTITY FULL;        ├── Procesar pago con Stripe

ALTER TABLE public.conversations REPLICA IDENTITY FULL;        ├── Marcar favoritos (favorites)

```        ├── Iniciar conversación (conversations) [Rol: User]

        │   └── Enviar/Recibir mensajes (messages) [Realtime]

---        ├── Escribir reseña (reviews)

        └── Recibir notificaciones (notifications)

## Migration Summary```



| Date | File | Description |---

|-------|---------|-------------|

| 2025-09-26 16:04:55 | `1ec91c5b...` | Initial creation: profiles, categories, spaces, bookings, reviews, favorites + RLS + triggers |## Próximas Consideraciones

| 2025-09-26 16:21:00 | `cfe73943...` | Updated city to Guadalajara, México |

| 2025-09-26 17:04:50 | `9c15d42d...` | Storage bucket + policies + seed categories |### Posibles Mejoras:

| 2025-09-26 17:17:58 | `0122cf07...` | Added Medical Office category |1. **Auditoría:** Tabla de logs para cambios críticos

| 2025-09-26 19:05:01 | `2a67be54...` | Messaging system: conversations + messages + realtime |2. **Soft Deletes:** Columna `deleted_at` en tablas principales

| 2025-09-26 19:52:27 | `4f8a3f17...` | Stripe Connect: stripe_connect_accounts + booking fields |3. **Versionado:** Sistema de versiones para spaces

| 2025-09-26 20:04:24 | `86a08a6d...` | Notifications system |4. **Analytics:** Tabla de eventos para tracking

| 2025-09-26 21:19:27 | `21338ec9...` | Cleanup duplicate categories + add new ones |5. **Búsqueda Full-Text:** Índices GIN para búsqueda avanzada

6. **Geocoding:** Campos lat/lng para búsqueda geográfica

---

### Optimizaciones:

## Security Notes (RLS)1. Índices adicionales basados en queries frecuentes

2. Materialized views para estadísticas

All tables have Row Level Security (RLS) enabled with specific policies:3. Particionado de tablas grandes (bookings, messages)

4. Archivado de datos históricos

✅ **Public (read):**

---

- categories

- reviews**Última actualización:** Octubre 27, 2025

- spaces (active only)**Versión del esquema:** 1.0.0


🔒 **Protected by user:**

- profiles (public read, own write)
- bookings (user sees their bookings, owner sees bookings for their spaces)
- favorites (own only)
- conversations (participants only)
- messages (participants only)
- notifications (own only)
- stripe_connect_accounts (own only)

🛡️ **Cascade Deletes:**

- Delete user → deletes profile, bookings, reviews, favorites, stripe_connect_accounts, notifications
- Delete space → deletes bookings, reviews, favorites, conversations
- Delete conversation → deletes messages

---

## Main Data Flow Diagram

```text
User registers (auth.users)
    ↓
Profile automatically created (profiles) [Trigger]
    ↓
User can:
    ├── List spaces (spaces) [Role: Owner]
    │   ├── Configure Stripe Connect (stripe_connect_accounts)
    │   └── Receive conversations (conversations) [Role: Owner]
    │
    └── Book spaces (bookings) [Role: Customer]
        ├── Process payment with Stripe
        ├── Mark favorites (favorites)
        ├── Initiate conversation (conversations) [Role: User]
        │   └── Send/Receive messages (messages) [Realtime]
        ├── Write review (reviews)
        └── Receive notifications (notifications)
```

---

## Future Considerations

### Possible Improvements:

1. **Audit Trail:** Log table for critical changes
2. **Soft Deletes:** `deleted_at` column in main tables
3. **Versioning:** Version system for spaces
4. **Analytics:** Event table for tracking
5. **Full-Text Search:** GIN indexes for advanced search
6. **Geocoding:** lat/lng fields for geographic search

### Optimizations:

1. Additional indexes based on frequent queries
2. Materialized views for statistics
3. Partitioning of large tables (bookings, messages)
4. Archiving of historical data

---

**Last Updated:** October 27, 2025
**Schema Version:** 1.0.0
`````

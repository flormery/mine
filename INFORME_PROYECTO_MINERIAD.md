# 📊 INFORME DETALLADO DEL PROYECTO MINERIAD

**Fecha del Informe:** 21 de Noviembre de 2025  
**Estado del Proyecto:** Actualizado y Funcional  
**Framework Principal:** Angular 20.3.0  
**Base de Datos:** Supabase

---

## 📑 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [¿Qué es Supabase?](#qué-es-supabase)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Módulos y Funcionalidades](#módulos-y-funcionalidades)
5. [Tecnologías Utilizadas](#tecnologías-utilizadas)
6. [Seguridad y Autenticación](#seguridad-y-autenticación)

---

## 🎯 Descripción General

**Mineriad** (NoticiasHoy) es una **plataforma web de noticias moderna y profesional** desarrollada con Angular 20, que proporciona acceso a noticias en tiempo real con un sistema de suscripción por planes (gratuito y premium).

### Objetivos Principales:
- ✅ Proporcionar contenido de noticias actualizado
- ✅ Gestionar usuarios con autenticación segura
- ✅ Ofrecer planes de pago (Free y Premium)
- ✅ Contar con un asistente chatbot para consultas
- ✅ Proteger contenido premium con guards
- ✅ Ofrecer análisis y reportes especiales

---

## 🗄️ ¿QUÉ ES SUPABASE?

### Definición
**Supabase** es una plataforma **Backend as a Service (BaaS)** de código abierto que proporciona:

- 🔐 **Base de Datos PostgreSQL**: Base de datos relacional poderosa y confiable
- 🔑 **Autenticación**: Sistema de login, registro y gestión de usuarios
- 📡 **Realtime API**: Actualizaciones en tiempo real de datos
- 🗃️ **Storage**: Almacenamiento de archivos (imágenes, documentos)
- 🔌 **REST API**: Acceso a datos mediante API

### En tu Proyecto:
Tu aplicación usa Supabase para:

```typescript
// src/supabaseClients.ts
- Almacenar perfiles de usuarios (user_profiles)
- Guardar datos de pagos y suscripciones
- Autenticar usuarios (login/registro)
- Gestionar noticias y contenido
- Rastrear transacciones de pago
```

### Ventajas de usar Supabase:
| Ventaja | Descripción |
|---------|------------|
| 🚀 **Rápido** | No necesitas desarrollar backend desde cero |
| 💰 **Económico** | Tier gratuito generoso, escalable según uso |
| 🔒 **Seguro** | Autenticación integrada y políticas de Row Level Security (RLS) |
| 📱 **Real-time** | Actualizaciones de datos en vivo sin recargar |
| 🛠️ **Fácil integración** | Bibliotecas para Angular, React, Vue, etc. |
| 📊 **Escalable** | PostgreSQL es potente y confiable |

---

## 📁 ESTRUCTURA DEL PROYECTO

```
mineriad/
├── src/
│   ├── index.html                    # Punto de entrada HTML
│   ├── main.ts                       # Punto de entrada de Angular
│   ├── styles.css                    # Estilos globales
│   ├── supabaseClients.ts            # ⭐ Configuración de Supabase
│   │
│   └── app/
│       ├── app.component.ts          # Componente raíz
│       ├── app.config.ts             # Configuración global
│       ├── app.routes.ts             # Definición de rutas
│       │
│       ├── 📂 authentication/        # Sistema de autenticación
│       │   ├── auth.routes.ts
│       │   ├── login/
│       │   ├── register/
│       │   ├── password-recovery/
│       │   └── verification-code/
│       │
│       ├── 📂 payment/               # Sistema de pagos
│       │   ├── plan-selection/       # Selección de planes
│       │   └── checkout/             # Proceso de pago
│       │
│       ├── 📂 chatbot/               # Asistente IA
│       │   ├── chatbot.component.ts
│       │   ├── chatbot.component.html
│       │   ├── chatbot.component.css
│       │   └── chatbot.service.ts    # Lógica de búsqueda
│       │
│       ├── 📂 premium/               # Contenido exclusivo
│       │   └── premium-content.component.ts
│       │
│       ├── 📂 services/              # Servicios compartidos
│       │   └── payment.service.ts    # Gestión de pagos
│       │
│       ├── 📂 guards/                # Protección de rutas
│       │   └── premium.guard.ts      # Solo usuarios premium
│       │
│       ├── 📂 models/                # Interfaces de datos
│       │   └── payment.models.ts     # Tipos de planes y pagos
│       │
│       └── 📂 noticiasp/             # Portal principal de noticias
│           └── noticiass.component.ts
│
├── public/                           # Archivos estáticos
├── angular.json                      # Configuración Angular
├── package.json                      # Dependencias
├── tsconfig.json                     # Configuración TypeScript
└── tailwind.config.js                # Configuración Tailwind CSS
```

---

## 🔍 DESCRIPCIÓN DETALLADA DE CARPETAS

### 1. 📂 **authentication/** - Sistema de Autenticación
**Propósito:** Gestionar login, registro y recuperación de contraseña

**Componentes:**
- **login.component.ts** - Página de inicio de sesión
- **register.component.ts** - Formulario de registro de nuevos usuarios
- **password-recovery.component.ts** - Recuperación de contraseña olvidada
- **verification-code.component.ts** - Verificación de códigos

**Características:**
- ✅ Validación de email y contraseña
- ✅ Integración con Supabase Auth
- ✅ SweetAlert2 para notificaciones elegantes
- ✅ Recuperación segura de contraseña

**Archivos clave:**
```typescript
// auth.routes.ts - Define rutas del módulo
// login.component.html - Formulario con estilos modernos
// Integración directa con Supabase.auth
```

---

### 2. 📂 **payment/** - Sistema de Pagos
**Propósito:** Gestionar planes de suscripción y transacciones de pago

**Subcarpetas:**

#### 📂 **plan-selection/**
- Muestra planes disponibles (Free y Premium)
- Animaciones atractivas
- Botones para elegir plan
- Comparativa de características

#### 📂 **checkout/**
- Formulario de pago seguro
- Validación de tarjeta de crédito
- Resumen de compra
- Integración con procesador de pagos

**Planes Disponibles:**

| Plan | Precio | Duración | Características |
|------|--------|----------|-----------------|
| **Free** | $0.00 | 365 días | • Acceso a noticias básicas<br>• Hasta 10 artículos/día<br>• Actualizaciones semanales<br>• Soporte por email |
| **Premium** | $9.99 | 30 días | • Acceso ilimitado a noticias<br>• Sin anuncios<br>• Noticias en tiempo real<br>• Contenido exclusivo<br>• Análisis detallados<br>• Soporte 24/7<br>• Descargar artículos offline |

**Flujo de Pago:**
```
Usuario → Selecciona Plan → Checkout → Procesa Pago → 
Actualiza DB (user_profiles) → Acceso Premium Activado
```

---

### 3. 📂 **chatbot/** - Asistente Inteligente
**Propósito:** Ayudar usuarios a buscar y filtrar noticias mediante conversación

**Componentes:**
- **chatbot.component.ts** - Interfaz de chat
- **chatbot.service.ts** - Lógica de procesamiento de mensajes

**Funcionalidades:**
- 🤖 Detecta intención del usuario (greeting, help, latest, search, etc.)
- 📰 Busca noticias en base de datos
- 🏷️ Filtra por categoría, lugar, diario
- 📊 Muestra resultados con imágenes
- 💬 Conversación natural

**Ejemplo de Intenciones Detectadas:**
```typescript
'hola' → greeting (saluda al usuario)
'últimas noticias' → latest (muestra noticias recientes)
'noticias de tecnología' → filter_by_category
'noticias de Madrid' → filter_by_location
'noticias de El País' → filter_by_newspaper
```

---

### 4. 📂 **premium/** - Contenido Exclusivo
**Propósito:** Mostrar beneficios y contenido protegido para usuarios premium

**Componente:**
- **premium-content.component.ts** - Página con:
  - Información del plan activo
  - Fecha de vencimiento de suscripción
  - Beneficios exclusivos
  - Análisis y reportes especiales

**Protección:**
- 🔒 Usa `premium.guard.ts` para permitir solo usuarios activos
- ⚠️ Redirige usuarios sin suscripción al panel de planes

---

### 5. 📂 **services/** - Lógica de Negocio
**Propósito:** Centralizar funciones compartidas entre componentes

#### **payment.service.ts** - Servicio de Pagos
```typescript
Responsabilidades:
✅ loadUserProfile()     - Obtiene datos del usuario
✅ createUserProfile()   - Crea perfil tras registro
✅ upgradePlan()         - Actualiza plan de suscripción
✅ processPay()          - Procesa transacciones
✅ createPayment()       - Registra pago en DB
```

**Observable RxJS:**
```typescript
userProfile$ // BehaviorSubject que emite cambios en el perfil
```

---

### 6. 📂 **guards/** - Protección de Rutas
**Propósito:** Controlar acceso a rutas según permisos del usuario

#### **premium.guard.ts**
- ✅ Verifica si usuario está autenticado
- ✅ Verifica si tiene plan activo
- ✅ Verifica si suscripción no ha expirado
- ❌ Redirige a `/payment/plans` si no cumple

---

### 7. 📂 **models/** - Definición de Tipos
**Propósito:** Definir interfaces TypeScript para datos

#### **payment.models.ts** - Tipos principales:
```typescript
// Tipos de planes
type PlanType = 'free' | 'premium'

// Datos del usuario suscrito
interface UserProfile {
  id: string
  email: string
  plan_type: PlanType
  payment_status: 'inactive' | 'active' | 'expired'
  subscription_start: string
  subscription_end: string
  created_at: string
  updated_at: string
}

// Información de transacción
interface Payment {
  user_id: string
  plan_type: PlanType
  amount: number
  status: 'pending' | 'completed' | 'failed'
  transaction_id: string
  created_at: string
}

// Datos de formulario de pago
interface PaymentFormData {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}
```

---

### 8. 📂 **noticiasp/** - Portal Principal
**Propósito:** Página principal - muestra todas las noticias

**Componente:**
- **noticiass.component.ts** - Portal completo con:
  - Galería de noticias
  - Búsqueda y filtrado
  - Navegación intuitiva
  - Integración chatbot
  - Botones de login/planes

**Interfaz de Datos:**
```typescript
interface Noticia {
  id: number
  diario: string           // Periódico (El País, ABC, Marca, etc.)
  titulo: string
  fecha: string
  enlace: string
  contenido: string
  autor: string
  categoria: string        // Política, Deportes, Tecnología, etc.
  imagen_url: string
  descripcion: string
  lugar: string           // Localización geográfica
}
```

---

## ⚙️ TECNOLOGÍAS UTILIZADAS

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Angular** | 20.3.0 | Framework principal |
| **TypeScript** | Latest | Tipado estático |
| **RxJS** | 7.8.0 | Programación reactiva |
| **Tailwind CSS** | 4.1.13 | Estilos y responsive |
| **SweetAlert2** | 11.26.3 | Notificaciones elegantes |
| **Chart.js** | 4.5.1 | Gráficos y estadísticas |
| **XLSX** | 0.18.5 | Exportación a Excel |

### Backend
| Tecnología | Propósito |
|------------|----------|
| **Supabase** | Base de datos + Autenticación |
| **PostgreSQL** | Base de datos relacional |

### Herramientas de Desarrollo
| Herramienta | Propósito |
|------------|----------|
| **Angular CLI** | Generación de componentes y construcción |
| **Karma + Jasmine** | Testing unitario |
| **TypeScript Compiler** | Compilación de TypeScript |
| **PostCSS + Autoprefixer** | Procesamiento de CSS |

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### Flujo de Autenticación
```
1. Usuario se registra
   └─> Supabase crea usuario en auth.users
   └─> Se crea perfil en user_profiles (plan: 'free')

2. Usuario inicia sesión
   └─> Supabase verifica credenciales
   └─> Genera JWT token
   └─> Se carga su perfil desde user_profiles

3. Usuario compra plan premium
   └─> Procesa pago
   └─> Actualiza user_profiles (plan_type: 'premium')
   └─> Premium.guard valida acceso a rutas premium

4. Suscripción se expira
   └─> Guard detecta fecha > subscription_end
   └─> Redirige a seleccionar nuevo plan
```

### Tokens JWT en Supabase
- ✅ Token generado al login
- ✅ Guardado en localStorage
- ✅ Usado en headers de solicitudes a Supabase
- ✅ Se refresca automáticamente

### Row Level Security (RLS)
```sql
-- Ejemplo: usuario solo puede ver su propio perfil
SELECT * FROM user_profiles
WHERE id = auth.uid()
```

---

## 📊 ESTRUCTURA DE BASE DE DATOS (Supabase)

### Tabla: `user_profiles`
```sql
Column              | Type      | Descripción
--------------------|-----------|---------------------
id                  | UUID      | PK, FK de auth.users
email               | TEXT      | Email del usuario
plan_type           | TEXT      | 'free' o 'premium'
payment_status      | TEXT      | 'active', 'inactive', 'expired'
subscription_start  | TIMESTAMP | Inicio de suscripción
subscription_end    | TIMESTAMP | Fin de suscripción
created_at          | TIMESTAMP | Fecha de creación
updated_at          | TIMESTAMP | Última actualización
```

### Tabla: `payments`
```sql
Column              | Type      | Descripción
--------------------|-----------|---------------------
id                  | UUID      | PK
user_id             | UUID      | FK a user_profiles
plan_type           | TEXT      | Plan comprado
amount              | DECIMAL   | Monto pagado
currency            | TEXT      | Moneda (USD)
payment_method      | TEXT      | 'card' o 'paypal'
status              | TEXT      | Estado del pago
transaction_id      | TEXT      | ID de transacción
card_last_digits    | TEXT      | Últimos 4 dígitos
created_at          | TIMESTAMP | Fecha de pago
```

### Tabla: `noticias`
```sql
Column              | Type      | Descripción
--------------------|-----------|---------------------
id                  | BIGINT    | PK
diario              | TEXT      | Periódico origen
titulo              | TEXT      | Título de noticia
fecha               | TIMESTAMP | Fecha de publicación
enlace              | TEXT      | URL original
contenido           | TEXT      | Texto completo
autor               | TEXT      | Autor del artículo
categoria           | TEXT      | Categoría (Política, Sports, etc.)
imagen_url          | TEXT      | URL de imagen
descripcion         | TEXT      | Resumen/descripción
lugar               | TEXT      | Localización geográfica
```

---

## 🚀 FLUJOS PRINCIPALES

### Flujo 1: Registro de Nuevo Usuario
```
┌─────────────────────────────────────┐
│ 1. Usuario accede a /register       │
├─────────────────────────────────────┤
│ 2. Completa formulario              │
│    - Email                          │
│    - Contraseña                     │
│    - Nombre                         │
├─────────────────────────────────────┤
│ 3. RegisterComponent valida datos   │
├─────────────────────────────────────┤
│ 4. PaymentService.createUserProfile │
│    - Supabase.auth.signUp()         │
│    - Crea en user_profiles (FREE)   │
├─────────────────────────────────────┤
│ 5. Redirecciona a portal (/noticias)│
│    Usuario tiene acceso GRATUITO    │
└─────────────────────────────────────┘
```

### Flujo 2: Compra de Plan Premium
```
┌──────────────────────────────────────┐
│ 1. Usuario logueado va a /plans      │
├──────────────────────────────────────┤
│ 2. Ve planes (Free - $0, Premium)    │
├──────────────────────────────────────┤
│ 3. Elige Premium → /payment/checkout │
├──────────────────────────────────────┤
│ 4. Completa datos de tarjeta         │
├──────────────────────────────────────┤
│ 5. PaymentService.processPay()       │
│    - Valida tarjeta                  │
│    - Crea registro en payments       │
│    - Actualiza user_profiles         │
│      plan_type: 'premium'            │
│      subscription_end: +30 días      │
├──────────────────────────────────────┤
│ 6. SweetAlert2 notifica éxito        │
│ 7. Acceso a:                         │
│    - /premium-content (protegido)    │
│    - Contenido sin anuncios          │
│    - Análisis detallados             │
└──────────────────────────────────────┘
```

### Flujo 3: Búsqueda de Noticias vía Chatbot
```
┌───────────────────────────────┐
│ 1. Usuario escribe en chat     │
├───────────────────────────────┤
│ "¿Noticias de tecnología?"    │
├───────────────────────────────┤
│ 2. ChatbotService.processMsg()│
│    - detectIntent()            │
│    - Identifica: CATEGORY      │
│    - Extrae: 'tecnología'     │
├───────────────────────────────┤
│ 3. Consulta Supabase:          │
│    SELECT * FROM noticias      │
│    WHERE categoria = 'tech'    │
├───────────────────────────────┤
│ 4. Muestra resultados          │
│    - Imágenes                  │
│    - Títulos                   │
│    - Enlaces a fuente          │
└───────────────────────────────┘
```

---

## 📝 CONFIGURACIÓN IMPORTANTES

### Archivo: `supabaseClients.ts`
```typescript
// CUIDADO: Expone credenciales públicas (normal en frontend)
// En producción, usar variables de entorno

const supabaseUrl = 'https://aswmdmtkpjrrckhwcqlw.supabase.co'
const supabaseKey = 'eyJhbGc...' // Clave pública (anon)

export const supabase = createClient(supabaseUrl, supabaseKey)
```

**Mejora recomendada:**
```typescript
// environment.prod.ts
export const environment = {
  supabase: {
    url: process.env['SUPABASE_URL'],
    key: process.env['SUPABASE_KEY']
  }
}
```

### Archivo: `app.routes.ts`
Define todas las rutas principales:
- `/` - Portal de noticias (público)
- `/login` - Inicio de sesión
- `/register` - Registro nuevo usuario
- `/payment/plans` - Selección de planes
- `/payment/checkout` - Carrito de compra
- `/premium-content` - Contenido exclusivo (protegido)

### Archivo: `app.config.ts`
Configuración global de Angular:
- Zone.js deshabilitada (performance)
- CommonModule y FormsModule importados
- Soporte para ngModel, ngIf, ngFor, etc.

---

## 📈 MÉTRICAS Y MONITOREO

### Funcionalidades Medibles:
- 📊 Número de usuarios registrados
- 💰 Ingresos por suscripciones
- 📰 Artículos consultados
- 🤖 Consultas al chatbot
- ⏰ Tiempo de sesión
- 🔄 Tasa de conversión (Free → Premium)

### SweetAlert2 para UX:
```typescript
// Notificación de éxito
Swal.fire({
  title: '¡Pago Exitoso!',
  text: 'Tu plan premium está activo',
  icon: 'success'
})

// Confirmación antes de acciones
Swal.fire({
  title: '¿Confirmar compra?',
  confirmButtonText: 'Sí, comprar',
  cancelButtonText: 'Cancelar'
})
```

---

## ✅ CHECKLIST DE FUNCIONALIDADES

- [x] Autenticación (Login/Registro)
- [x] Sistema de planes (Free/Premium)
- [x] Procesamiento de pagos
- [x] Portal de noticias
- [x] Chatbot inteligente
- [x] Protección de rutas premium
- [x] Perfiles de usuario
- [x] Gestor de suscripciones
- [x] Historial de pagos
- [x] Notificaciones elegantes (SweetAlert2)
- [x] Diseño responsive (Tailwind CSS)
- [x] Integración Supabase
- [ ] Exportación de reportes (XLSX configurado)
- [ ] Análisis con gráficos (Chart.js configurado)

---

## 🔧 PRÓXIMAS MEJORAS SUGERIDAS

1. **Variables de Entorno**: Mover credenciales a `.env`
2. **Row Level Security**: Implementar RLS en Supabase
3. **Notificaciones Email**: Confirmación de compra por email
4. **Webhooks**: Actualizar estado de pago automáticamente
5. **Caching**: Implementar estrategia de caché con RxJS
6. **Analytics**: Integrar Google Analytics o Mixpanel
7. **Testing**: Aumentar cobertura de unit tests
8. **Offline Mode**: Service Workers para funcionalidad offline
9. **CDN**: Optimizar entrega de imágenes
10. **A/B Testing**: Probar variaciones de UI para conversión

---

## 📞 SOPORTE Y DOCUMENTACIÓN

- 📚 **Angular Docs**: https://angular.dev
- 🗄️ **Supabase Docs**: https://supabase.com/docs
- 🎨 **Tailwind CSS**: https://tailwindcss.com
- 🚨 **SweetAlert2**: https://sweetalert2.github.io
- 📊 **Chart.js**: https://www.chartjs.org

---

## 📄 CONCLUSIÓN

**Mineriad** es una aplicación empresarial moderna y bien estructurada que aprovecha las capacidades de:
- ✨ **Angular** para UI/UX reactiva
- 🔐 **Supabase** para backend serverless
- 💳 **Sistema de pagos** robusto
- 🤖 **IA conversacional** para mejor experiencia

El proyecto está listo para producción con optimizaciones menores recomendadas en seguridad y variables de entorno.

---

**Última Actualización:** 21/11/2025  
**Versión del Informe:** 1.0  
**Estado:** ✅ Completo y Actualizado

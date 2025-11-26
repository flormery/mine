# Manual de Usuario - Mineriad 📰

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [¿Qué es Supabase?](#qué-es-supabase)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Requisitos Previos](#requisitos-previos)
5. [Guía de Inicio Rápido](#guía-de-inicio-rápido)
6. [Funcionalidades Principales](#funcionalidades-principales)
7. [Sistema de Autenticación](#sistema-de-autenticación)
8. [Sistema de Pagos y Planes](#sistema-de-pagos-y-planes)
9. [Chatbot de Noticias](#chatbot-de-noticias)
10. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

**Mineriad** es una plataforma web moderna construida con Angular 20 que permite a los usuarios explorar y acceder a noticias de múltiples fuentes. El sistema utiliza **Supabase** como backend para gestionar autenticación, almacenamiento de datos y pagos, además de integración con **Jupyter** para web scraping automático de noticias.

### Características Principales:
- ✅ Sistema de autenticación seguro
- ✅ Sistema de planes freemium
- ✅ Chatbot inteligente para buscar noticias
- ✅ Gestión de múltiples categorías y fuentes
- ✅ Panel de noticias premium
- ✅ Soporte de múltiples idiomas
- ✅ Interfaz moderna con Tailwind CSS

---

## ¿Qué es Supabase?

### Definición
**Supabase** es una plataforma de backend como servicio (BaaS) de código abierto que proporciona:

1. **Base de Datos PostgreSQL** - Base de datos relacional en la nube
2. **Autenticación** - Sistema de login y registro seguro
3. **Almacenamiento de Archivos** - Para guardar imágenes y documentos
4. **API en Tiempo Real** - WebSockets para actualizaciones automáticas
5. **Funciones Serverless** - Ejecutar código sin servidores
6. **Gestión de Sesiones** - Control de usuarios autenticados

### ¿Por qué usamos Supabase en Mineriad?

```
┌─────────────────────────────────────────┐
│          APLICACIÓN ANGULAR             │
│  (Frontend - Interfaz del Usuario)      │
└────────────┬────────────────────────────┘
             │
             │ API HTTP + Autenticación
             │
┌────────────▼────────────────────────────┐
│         SUPABASE (Backend)              │
├─────────────────────────────────────────┤
│ ✓ Autenticación de Usuarios             │
│ ✓ Base de Datos PostgreSQL              │
│ ✓ Almacenamiento de Noticias            │
│ ✓ Gestión de Planes de Pago             │
│ ✓ Historial de Usuarios                 │
│ ✓ Datos de Suscripciones                │
└─────────────────────────────────────────┘
```

---

## Estructura del Proyecto

### 📁 Carpetas Principales

```
mineriad/
├── src/
│   ├── app/
│   │   ├── authentication/        👤 Sistema de Login/Registro
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── password-recovery/
│   │   │   └── verification-code/
│   │   │
│   │   ├── chatbot/              🤖 Chatbot de Noticias
│   │   │   ├── chatbot.component.ts
│   │   │   └── chatbot.service.ts
│   │   │
│   │   ├── payment/              💳 Sistema de Pagos
│   │   │   ├── plan-selection/
│   │   │   └── checkout/
│   │   │
│   │   ├── premium/              ⭐ Contenido Premium
│   │   ├── noticiasp/            📰 Noticias
│   │   ├── guards/               🔐 Protección de Rutas
│   │   ├── services/             🛠️ Servicios (Pagos, etc)
│   │   ├── models/               📊 Modelos de Datos
│   │   └── app.routes.ts         🗺️ Rutas de la App
│   │
│   ├── supabaseClients.ts        🔌 Configuración de Supabase
│   └── main.ts                   🚀 Entrada de la App
│
├── public/                        📦 Archivos estáticos
├── angular.json                   ⚙️ Configuración Angular
├── tailwind.config.js            🎨 Configuración de estilos
└── package.json                  📋 Dependencias del Proyecto
```

### 📂 Descripción Detallada de Carpetas

#### 1. **authentication/** - Sistema de Autenticación
- **Propósito:** Gestionar el registro, inicio de sesión y recuperación de contraseña
- **Componentes:**
  - `login/` - Formulario de inicio de sesión
  - `register/` - Formulario de registro de nuevos usuarios
  - `password-recovery/` - Recuperación de contraseña olvidada
  - `verification-code/` - Verificación de email
- **Tecnología:** Integrado con Supabase Auth

#### 2. **chatbot/** - Asistente de Noticias
- **Propósito:** Interfaz conversacional para buscar y consultar noticias
- **Archivos:**
  - `chatbot.component.ts` - Lógica del componente
  - `chatbot.component.html` - Interfaz del chat
  - `chatbot.service.ts` - Lógica de procesamiento de preguntas
- **Funcionalidades:**
  - Búsqueda inteligente de noticias
  - Filtrado por categoría
  - Filtrado por ubicación
  - Búsqueda por fuente (diario)

#### 3. **payment/** - Sistema de Pagos
- **Propósito:** Gestionar suscripciones y planes de pago
- **Componentes:**
  - `plan-selection/` - Selección de planes (Free, Premium, Plus)
  - `checkout/` - Procesamiento de pagos
- **Planes Disponibles:**
  - **Free:** Acceso básico a noticias
  - **Premium:** Acceso a contenido premium + análisis
  - **Plus:** Acceso total + reportes personalizados

#### 4. **premium/** - Contenido Exclusivo
- **Propósito:** Mostrar noticias y análisis exclusivos para usuarios premium
- **Acceso:** Protegido por guards (solo usuarios pagados)

#### 5. **noticiasp/** - Gestión de Noticias
- **Propósito:** Componentes relacionados con la visualización de noticias
- **Integración:** Base de datos Supabase (scrapeo con Jupyter)

#### 6. **guards/** - Protección de Rutas
- **Propósito:** Verificar permisos antes de acceder a ciertos componentes
- **Archivo:** `premium.guard.ts`
- **Uso:** Redirige usuarios no autenticados o sin plan premium

#### 7. **services/** - Servicios Empresariales
- **Propósito:** Lógica centralizada para operaciones comunes
- **Principales:**
  - `payment.service.ts` - Gestión de pagos y suscripciones

#### 8. **models/** - Modelos de Datos
- **Propósito:** Definir estructuras de datos TypeScript
- **Archivo:** `payment.models.ts`
- **Ejemplos:** Interfaz de Planes, Pagos, Usuarios

---

## Requisitos Previos

### Software Necesario
- **Node.js** (v18 o superior)
- **npm** (viene con Node.js)
- **Angular CLI** (v20.3.1)
- **Git** (para control de versiones)
- **Visual Studio Code** (recomendado)

### Verificar Instalación
```bash
node --version          # Debe ser v18 o superior
npm --version           # Debe ser 9 o superior
ng version              # Debe ser 20.3.1 o similar
```

### Cuenta Supabase
1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Obtener URL y clave API del proyecto

---

## Guía de Inicio Rápido

### Paso 1: Instalación de Dependencias
```bash
# Navegar al directorio del proyecto
cd mineriad

# Instalar todas las dependencias
npm install
```

### Paso 2: Iniciar el Servidor de Desarrollo
```bash
# Iniciar Angular en modo desarrollo
npm start
```

**Resultado esperado:**
```
✔ Compiled successfully.
⠙ Compiling...

Application bundle generation complete. [7.234 seconds]

Initial Chunk Files | Names         | Raw Size
main.js              | main          | 348.75 kB | 
polyfills.js         | polyfills     | 36.34 kB  |
styles.js            | styles        | 0 bytes   |

Watch mode enabled. Watching for file changes...

➜  Local:   http://localhost:4200/
```

### Paso 3: Acceder a la Aplicación
- Abre tu navegador web
- Navega a `http://localhost:4200/`
- ¡La aplicación está lista para usar!

---

## Funcionalidades Principales

### 1. 👤 Autenticación

#### Registro de Nuevo Usuario
1. En la página principal, haz clic en **"Registrarse"**
2. Completa el formulario con:
   - Email válido
   - Contraseña segura (mín. 8 caracteres)
   - Confirmación de contraseña
3. Haz clic en **"Crear Cuenta"**
4. **Verifica tu email** en la bandeja de entrada

#### Iniciar Sesión
1. Haz clic en **"Iniciar Sesión"**
2. Ingresa tu email y contraseña
3. Haz clic en **"Entrar"**
4. Serás redirigido al panel principal

#### Recuperación de Contraseña
1. En la página de login, haz clic en **"¿Olvidaste tu contraseña?"**
2. Ingresa tu email
3. Recibirás un enlace de recuperación en tu email
4. Sigue el enlace y crea una nueva contraseña

### 2. 🤖 Chatbot de Noticias

El chatbot es tu asistente personal para buscar noticias.

#### Cómo Usarlo
El chatbot está disponible en la esquina inferior derecha de la pantalla.

#### Comandos Disponibles

**Búsqueda General:**
```
"Muéstrame las últimas noticias"
"¿Cuáles son las noticias de hoy?"
```

**Búsqueda por Categoría:**
```
"Noticias de tecnología"
"Muéstrame política"
"¿Hay noticias de deportes?"
```

**Búsqueda por Ubicación:**
```
"Noticias de Argentina"
"¿Qué pasa en Madrid?"
"Noticias de Latinoamérica"
```

**Búsqueda por Fuente:**
```
"Noticias de BBC"
"¿Qué dice La Nación?"
"Noticias de Reuters"
```

**Búsqueda Personalizada:**
```
"Busca noticias sobre inteligencia artificial"
"¿Hay noticias sobre criptomonedas?"
```

#### Estructura de Respuesta del Chatbot
```
┌─────────────────────────────────────────┐
│  Respuesta del Chatbot                  │
│                                         │
│  📖 Resumen de la búsqueda              │
│                                         │
│  Noticia 1                              │
│  📰 Título                              │
│  📅 Fecha: 25/11/2025                   │
│  🏢 Fuente: BBC News                    │
│  📍 Lugar: Reino Unido                  │
│  🔗 [Leer Más]                          │
│                                         │
│  Noticia 2                              │
│  ... (más noticias)                    │
└─────────────────────────────────────────┘
```

### 3. 💳 Planes y Suscripciones

#### Ver Planes Disponibles
1. Haz clic en **"Planes"** en la navegación principal
2. Verás tres opciones:

#### Plan Free (Gratuito)
```
├─ Acceso a noticias básicas
├─ Búsqueda simple
├─ 5 búsquedas diarias
├─ Sin acceso a premium
└─ Soporte por email
```

#### Plan Premium
```
├─ Acceso a todas las noticias
├─ Búsqueda avanzada con filtros
├─ Búsquedas ilimitadas
├─ Análisis de tendencias
├─ Exportar a Excel
└─ Soporte prioritario
```

#### Plan Plus
```
├─ Todo lo de Premium +
├─ Reportes personalizados
├─ API de integración
├─ Webhooks
├─ Análisis predictivo
└─ Soporte 24/7
```

#### Cambiar de Plan
1. Ve a tu **Perfil** → **Suscripción**
2. Haz clic en **"Cambiar Plan"**
3. Selecciona el nuevo plan
4. Completa el pago
5. Tu suscripción se actualizará inmediatamente

### 4. ⭐ Contenido Premium

#### Acceder a Premium
1. Suscríbete a un plan Premium o Plus
2. El contenido premium se desbloqueará automáticamente
3. Verás un distintivo ⭐ en noticias exclusivas

#### Funcionalidades Premium
- 📊 Análisis detallado de tendencias
- 📈 Gráficos de popularidad
- 🔍 Búsqueda avanzada multilingüe
- 📥 Descargar noticias en Excel
- 📧 Resumen diario por email
- 🔔 Alertas personalizadas

---

## Sistema de Autenticación

### Flujo de Autenticación

```
Usuario Accede a la App
        ↓
   ¿Tiene sesión?
   ├─ SÍ → Acceso Directo
   │
   └─ NO → Página de Login
          ├─ ¿Tiene cuenta?
          │  ├─ NO → Opción Registrarse
          │  │       ├─ Llenar formulario
          │  │       ├─ Verificar email
          │  │       └─ Login automático
          │  │
          │  └─ SÍ → Ingresar credenciales
          │          ├─ Validar con Supabase
          │          └─ Crear sesión
          │
          └─ ¿Olvidó contraseña?
             ├─ Ingresar email
             ├─ Recibir enlace
             ├─ Establecer nueva contraseña
             └─ Volver a login
```

### Seguridad

- ✅ Contraseñas encriptadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Verificación de email obligatoria
- ✅ Protección contra ataques CSRF
- ✅ Rate limiting en intentos de login

---

## Sistema de Pagos y Planes

### Cómo Funciona el Sistema de Pagos

1. **Seleccionar Plan** → Usuario elige un plan
2. **Procesar Pago** → Sistema valida los datos
3. **Confirmar Compra** → Supabase registra la transacción
4. **Activar Acceso** → Se otorgan permisos premium
5. **Enviar Confirmación** → Email de recepción

### Estados de Suscripción

```
ACTIVA (Azul)     ✅ Suscripción vigente
PRÓXIMA A VENCER  ⚠️  Vence en menos de 7 días
VENCIDA (Rojo)    ❌ Acceso limitado al plan Free
CANCELADA         🚫 Usuario canceló manualmente
```

### Renovación Automática

- Las suscripciones se renuevan automáticamente
- Recibirás un email 7 días antes del vencimiento
- Puedes cancelar en cualquier momento desde tu perfil

---

## Chatbot de Noticias

### ¿Cómo Funciona?

```
Entrada del Usuario
        ↓
Procesamiento de Lenguaje Natural
        ↓
Detección de Intención
        ├─ Categoría detectada
        ├─ Ubicación detectada
        ├─ Fuente detectada
        └─ Palabras clave detectadas
        ↓
Búsqueda en Base de Datos
        ↓
Procesamiento de Resultados
        ↓
Formato de Respuesta
        ↓
Mostrar al Usuario
```

### Algoritmo de Búsqueda

El chatbot utiliza múltiples técnicas:

1. **Coincidencia de Palabras Clave** - Busca términos exactos
2. **Análisis Semántico** - Entiende sinónimos y variaciones
3. **Filtrado Inteligente** - Aplica múltiples criterios
4. **Ordenamiento por Relevancia** - Noticias más relevantes primero
5. **Paginación** - Muestra resultados en lotes

### Ejemplos de Uso

#### Ejemplo 1: Búsqueda Simple
```
Usuario: "Últimas noticias"
Bot: Detecta → [Intención: Listar Todas]
Respuesta: Muestra las 10 noticias más recientes
```

#### Ejemplo 2: Búsqueda por Categoría
```
Usuario: "Noticias de tecnología"
Bot: Detecta → [Categoría: Tecnología]
Respuesta: Filtra por categoría y muestra resultados
```

#### Ejemplo 3: Búsqueda Avanzada
```
Usuario: "Noticias de economía desde Londres en BBC"
Bot: Detecta → [Categoría: Economía, Lugar: Londres, Fuente: BBC]
Respuesta: Aplica todos los filtros y muestra resultados
```

---

## Solución de Problemas

### ❌ "Email no confirmado"
**Problema:** No puedes iniciar sesión
**Solución:**
1. Revisa tu bandeja de entrada
2. Busca en la carpeta de Spam
3. Haz clic en el enlace de confirmación
4. Si no recibes el email, solicita uno nuevo desde login

### ❌ "Contraseña incorrecta"
**Problema:** Tu contraseña no funciona
**Solución:**
1. Usa la opción "¿Olvidaste tu contraseña?"
2. Ingresa tu email
3. Sigue el enlace enviado a tu correo
4. Establece una nueva contraseña

### ❌ "El chatbot no responde"
**Problema:** El chatbot parece congelado
**Solución:**
1. Recarga la página (F5)
2. Limpia el caché del navegador
3. Intenta en una pestaña privada/incógnita
4. Verifica tu conexión a internet

### ❌ "Error al procesar el pago"
**Problema:** No se puede completar el pago
**Solución:**
1. Verifica tus datos de tarjeta
2. Intenta con otra tarjeta
3. Contacta a soporte: support@mineriad.com
4. Asegúrate de tener suficientes fondos

### ❌ "No puedo acceder al contenido premium"
**Problema:** Suscrito pero sin acceso a premium
**Solución:**
1. Verifica tu suscripción en Perfil → Suscripción
2. Recarga la página
3. Cierra sesión y vuelve a iniciar
4. Si persiste, contacta a soporte

### 📌 Contactar a Soporte
- **Email:** support@mineriad.com
- **Horario:** Lunes a Viernes, 9:00 - 18:00 (UTC)
- **Tiempo de respuesta:** Máximo 24 horas

---

## Preguntas Frecuentes (FAQ)

### ¿Es gratis Mineriad?
Sí, hay un plan Free gratuito con funcionalidades básicas. Los planes Premium y Plus son pagos.

### ¿Puedo cambiar de plan cuando quiera?
Sí, puedes cambiar, actualizar o cancelar tu suscripción en cualquier momento desde tu perfil.

### ¿De dónde vienen las noticias?
Las noticias se recopilan de múltiples fuentes (BBC, Reuters, CNN, diarios locales, etc.) mediante web scraping automático usando Jupyter.

### ¿Con qué frecuencia se actualizan las noticias?
Las noticias se actualizan automáticamente cada hora. Cuando hay eventos importantes, la actualización puede ser cada 15 minutos.

### ¿Mis datos son seguros?
Sí, utilizamos Supabase que implementa encriptación de nivel empresarial y cumple con GDPR y otras regulaciones de privacidad.

### ¿Puedo descargar noticias?
Sí, con el plan Premium o Plus puedes descargar noticias en formato Excel.

### ¿Hay API disponible?
Sí, el plan Plus incluye acceso a nuestra API REST para integración personalizada.

### ¿Se puede usar en móvil?
Sí, la plataforma es totalmente responsive y funciona en teléfonos, tablets y escritorio.

---

## Guía de Teclado - Atajos Útiles

```
F5                    Recargar página
Ctrl + Shift + I      Abrir consola (para desarrolladores)
Ctrl + L              Seleccionar barra de direcciones
Escape                Cerrar chatbot
Enter                 Enviar mensaje en chatbot
```

---

## Contacto y Soporte

- 🌐 **Sitio Web:** https://mineriad.com
- 📧 **Email:** support@mineriad.com
- 💬 **Chat en Vivo:** Disponible en la app
- 🐦 **Twitter:** @mineriadnews
- 📱 **WhatsApp:** +34 6XX XXX XXX

---

**Versión:** 1.0  
**Última actualización:** 25 de Noviembre de 2025  
**Autores:** Equipo de Mineriad

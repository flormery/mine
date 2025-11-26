# Manual de Despliegue - Mineriad 🚀

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración Local](#configuración-local)
4. [Configuración de Supabase](#configuración-de-supabase)
5. [Configuración de Web Scraping con Jupyter](#configuración-de-web-scraping-con-jupyter)
6. [Build de Producción](#build-de-producción)
7. [Opciones de Despliegue](#opciones-de-despliegue)
8. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
9. [Troubleshooting](#troubleshooting)
10. [Lista de Verificación](#lista-de-verificación)

---

## Introducción

Este manual proporciona instrucciones completas para desplegar Mineriad en producción. Cubrimos desde la configuración inicial hasta el monitoreo en producción.

### Arquitectura General

```
┌──────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA MINERIAD              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │       FRONTEND (Angular 20)                     │   │
│  │  ├─ Hosted en Vercel/Netlify/AWS S3+CloudFront│   │
│  │  ├─ Componentes standalone                      │   │
│  │  ├─ Tailwind CSS                               │   │
│  │  └─ TypeScript                                 │   │
│  └──────────────┬──────────────────────────────────┘   │
│                 │ HTTPS                                 │
│  ┌──────────────▼──────────────────────────────────┐   │
│  │      SUPABASE (Backend + Base de Datos)        │   │
│  │  ├─ PostgreSQL                                 │   │
│  │  ├─ Autenticación JWT                          │   │
│  │  ├─ Almacenamiento de Archivos                 │   │
│  │  ├─ APIs REST                                  │   │
│  │  └─ Realtime Database                          │   │
│  └──────────────┬──────────────────────────────────┘   │
│                 │                                       │
│  ┌──────────────▼──────────────────────────────────┐   │
│  │    WEB SCRAPING (Jupyter + Python Scripts)    │   │
│  │  ├─ Recolecta noticias cada hora               │   │
│  │  ├─ Parsea HTML de múltiples fuentes           │   │
│  │  ├─ Guarda en Supabase                         │   │
│  │  └─ Ejecutado en servidor dedicado             │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Requisitos Previos

### Software Necesario

| Componente | Versión | Propósito |
|-----------|---------|----------|
| Node.js | 18+ | Runtime de JavaScript |
| npm | 9+ | Gestor de paquetes |
| Angular CLI | 20.3.1 | Herramientas de desarrollo |
| Git | 2.30+ | Control de versiones |
| Python | 3.9+ | Web scraping con Jupyter |
| PostgreSQL | 14+ | Base de datos (en Supabase) |

### Verificar Instalación

```powershell
# Windows PowerShell

# Verificar Node.js
node --version
# Esperado: v18.x.x o superior

# Verificar npm
npm --version
# Esperado: 9.x.x o superior

# Verificar Angular CLI
ng version
# Esperado: Angular CLI 20.3.1

# Verificar Git
git --version
# Esperado: git version 2.30.x o superior

# Verificar Python (si tienes instalado)
python --version
# Esperado: Python 3.9+
```

### Cuentas Requeridas

- [ ] Cuenta Supabase (supabase.com)
- [ ] Cuenta de hosting (Vercel, Netlify, AWS, etc.)
- [ ] Cuenta GitHub (para CI/CD)
- [ ] (Opcional) SendGrid o similar para emails

---

## Configuración Local

### Paso 1: Clonar el Repositorio

```powershell
# Navegar a la carpeta donde quieres el proyecto
cd C:\Users\Usuario\Scrip

# Clonar el repositorio
git clone https://github.com/flormery/mine.git mineriad
cd mineriad

# Verificar rama actual
git branch
# Esperado: * main (rama principal)
```

### Paso 2: Instalar Dependencias

```powershell
# Instalar todas las dependencias de npm
npm install

# Verificar que se instalaron correctamente
npm list | Select-Object -First 20
```

**Dependencias principales que se instalarán:**

```
@angular/core@20.3.0          - Core de Angular
@supabase/supabase-js@2.57.4  - Cliente de Supabase
chart.js@4.5.1                - Gráficas
sweetalert2@11.26.3           - Alertas modernas
xlsx@0.18.5                   - Exportar Excel
rxjs@7.8.0                    - Programación reactiva
tailwindcss@4.1.13            - Framework de CSS
```

### Paso 3: Configurar Variables de Entorno

Crear archivo `.env.local`:

```powershell
# Crear archivo de configuración
New-Item -ItemType File -Name ".env.local" -Value ""

# Editar el archivo (en VS Code)
code .env.local
```

**Contenido de `.env.local`:**

```env
# SUPABASE
SUPABASE_URL=https://aswmdmtkpjrrckhwcqlw.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# STRIPE (para pagos)
STRIPE_PUBLIC_KEY=pk_live_51234567890...
STRIPE_SECRET_KEY=sk_live_987654321...

# SENDGRID (para emails)
SENDGRID_API_KEY=SG.tu_api_key_aqui

# CONFIGURACIÓN DE APP
APP_URL=http://localhost:4200
API_URL=http://localhost:3000
NODE_ENV=development

# LOGGING
LOG_LEVEL=debug
```

**⚠️ IMPORTANTE: Mantener seguro el `.env.local`**

```powershell
# Agregar .env.local a .gitignore (si no está)
Add-Content .gitignore ".env.local"
```

### Paso 4: Verificar la Configuración

```powershell
# Navegar al archivo de configuración de Supabase
cat src/supabaseClients.ts

# Debería mostrar algo como:
# const supabaseUrl = 'https://aswmdmtkpjrrckhwcqlw.supabase.co'
# const supabaseKey = 'eyJhbGc...'
```

### Paso 5: Ejecutar en Desarrollo

```powershell
# Iniciar el servidor de desarrollo
npm start

# Resultado esperado:
# ✔ Compiled successfully.
# Application bundle generation complete.
# ➜  Local:   http://localhost:4200/
```

**Acceder a la aplicación:**
- Abre http://localhost:4200 en tu navegador
- Deberías ver la página de login de Mineriad

---

## Configuración de Supabase

### Paso 1: Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Iniciar sesión o crear cuenta
3. Hacer clic en "New Project"
4. Rellenar formulario:
   - **Project name:** mineriad-prod
   - **Database password:** Generar contraseña segura
   - **Region:** Seleccionar según tu ubicación (EU, US, Asia)
5. Hacer clic en "Create new project"

### Paso 2: Obtener Credenciales

```powershell
# Abrir Project Settings → API
# Copiar:
# - Project URL: https://xxxxx.supabase.co
# - anon key: eyJhbGc... (clave pública)
# - service_role key: eyJhbGc... (clave privada)
```

**Guardar en archivo seguro:**

```powershell
# Crear archivo .env.production
New-Item -ItemType File -Name ".env.production"

# Contenido:
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Paso 3: Crear Tablas en la Base de Datos

Supabase tiene un editor SQL. Ejecutar el siguiente SQL:

```sql
-- Tabla de Noticias
CREATE TABLE noticias (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  resumen VARCHAR(500),
  categoria VARCHAR(100),
  autor VARCHAR(255),
  diario VARCHAR(100),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  enlace VARCHAR(500) UNIQUE,
  imagen_url VARCHAR(500),
  descripcion TEXT,
  lugar VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios (mantenida por Supabase Auth)
-- Supabase crea esta automáticamente

-- Tabla de Suscripciones
CREATE TABLE suscripciones (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL, -- 'free', 'premium', 'plus'
  estado VARCHAR(50) NOT NULL, -- 'activa', 'vencida', 'cancelada'
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_vencimiento TIMESTAMP,
  precio_pagado DECIMAL(10, 2),
  metodo_pago VARCHAR(50),
  referencia_pago VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Búsquedas del Chatbot
CREATE TABLE busquedas_chatbot (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id),
  consulta TEXT NOT NULL,
  tipo_busqueda VARCHAR(50), -- 'categoria', 'lugar', 'fuente'
  resultados_encontrados INT,
  fecha_busqueda TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Preferences de Usuario
CREATE TABLE preferencias_usuario (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  categorias_favoritas TEXT[], -- Array de categorías
  notificaciones_activas BOOLEAN DEFAULT true,
  resumen_diario BOOLEAN DEFAULT false,
  idioma VARCHAR(10) DEFAULT 'es',
  tema VARCHAR(20) DEFAULT 'claro',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_noticias_categoria ON noticias(categoria);
CREATE INDEX idx_noticias_fecha ON noticias(fecha DESC);
CREATE INDEX idx_noticias_diario ON noticias(diario);
CREATE INDEX idx_suscripciones_usuario ON suscripciones(usuario_id);
CREATE INDEX idx_busquedas_usuario ON busquedas_chatbot(usuario_id);
```

### Paso 4: Configurar Políticas de Seguridad (RLS)

En Supabase → Authentication → Policies, agregar:

```sql
-- Política para noticias (lectura pública)
CREATE POLICY "Noticias lectura pública"
ON noticias FOR SELECT
TO authenticated, anon
USING (true);

-- Política para suscripciones (usuario solo ve las suyas)
CREATE POLICY "Usuarios ven sus suscripciones"
ON suscripciones FOR SELECT
TO authenticated
USING (auth.uid() = usuario_id);

-- Política para preferencias
CREATE POLICY "Usuarios ven sus preferencias"
ON preferencias_usuario FOR SELECT
TO authenticated
USING (auth.uid() = usuario_id);
```

### Paso 5: Habilitar Autenticación por Email

En Supabase → Authentication → Providers:

1. Verificar que "Email" esté habilitado
2. Configurar:
   - Enable Email Signup: ✅ ON
   - Enable Email Confirmations: ✅ ON
   - Autoconfirm users: ❌ OFF (requiere verificación)

---

## Configuración de Web Scraping con Jupyter

### ¿Qué es el Web Scraping en Mineriad?

El web scraping es un proceso automático que:
1. Visita sitios web de noticias
2. Extrae la información
3. Guarda en Supabase
4. Se ejecuta periódicamente (cada hora)

### Requisitos de Python

```powershell
# Verificar Python
python --version

# Si no está instalado, descargar desde python.org
# Asegurarse de marcar "Add Python to PATH"
```

### Paso 1: Crear Carpeta de Scraping

```powershell
# Crear estructura de carpetas
New-Item -ItemType Directory -Path "scraper" -Force
cd scraper

# Crear archivo requirements.txt
New-Item -ItemType File -Name "requirements.txt"
```

**Contenido de `requirements.txt`:**

```
requests==2.31.0
beautifulsoup4==4.12.2
lxml==4.9.3
supabase==2.3.0
python-dotenv==1.0.0
schedule==1.2.0
feedparser==6.0.10
```

### Paso 2: Instalar Dependencias de Python

```powershell
cd scraper

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt
```

### Paso 3: Crear Script de Scraping

Crear archivo `scraper/news_scraper.py`:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
News Scraper para Mineriad
Recopila noticias de múltiples fuentes y las guarda en Supabase
"""

import os
import logging
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import feedparser
import time

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

class NewsScraperMineriad:
    """Scraper de noticias para Mineriad"""
    
    def __init__(self):
        """Inicializar cliente de Supabase"""
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
    def scrape_bbc(self):
        """Scrapear noticias de BBC News"""
        try:
            logger.info("Iniciando scraping de BBC News...")
            feed_url = "http://feeds.bbc.co.uk/news/rss.xml"
            feed = feedparser.parse(feed_url)
            
            noticias_agregadas = 0
            for entry in feed.entries[:10]:  # Últimas 10 noticias
                try:
                    noticia = {
                        'titulo': entry.title,
                        'contenido': entry.summary[:500],
                        'diario': 'BBC News',
                        'categoria': 'Internacional',
                        'autor': entry.get('author', 'BBC News'),
                        'enlace': entry.link,
                        'fecha': datetime.now().isoformat(),
                        'lugar': 'Reino Unido'
                    }
                    
                    # Verificar si ya existe
                    existing = self.supabase.table('noticias').select('id').eq('enlace', noticia['enlace']).execute()
                    
                    if not existing.data:
                        self.supabase.table('noticias').insert(noticia).execute()
                        noticias_agregadas += 1
                        logger.info(f"✓ Noticia agregada: {noticia['titulo'][:50]}...")
                        
                except Exception as e:
                    logger.error(f"Error procesando noticia de BBC: {e}")
                    
            logger.info(f"✓ BBC News: {noticias_agregadas} noticias agregadas")
            return noticias_agregadas
            
        except Exception as e:
            logger.error(f"❌ Error scrapeando BBC: {e}")
            return 0
    
    def scrape_infobae(self):
        """Scrapear noticias de Infobae (ejemplo para Latinoamérica)"""
        try:
            logger.info("Iniciando scraping de Infobae...")
            feed_url = "https://www.infobae.com/feed/"
            feed = feedparser.parse(feed_url)
            
            noticias_agregadas = 0
            for entry in feed.entries[:10]:
                try:
                    noticia = {
                        'titulo': entry.title,
                        'contenido': entry.summary[:500] if hasattr(entry, 'summary') else '',
                        'diario': 'Infobae',
                        'categoria': self._detectar_categoria(entry.title),
                        'autor': 'Infobae',
                        'enlace': entry.link,
                        'fecha': datetime.now().isoformat(),
                        'lugar': 'Argentina'
                    }
                    
                    existing = self.supabase.table('noticias').select('id').eq('enlace', noticia['enlace']).execute()
                    
                    if not existing.data:
                        self.supabase.table('noticias').insert(noticia).execute()
                        noticias_agregadas += 1
                        logger.info(f"✓ Noticia Infobae agregada: {noticia['titulo'][:50]}...")
                        
                except Exception as e:
                    logger.error(f"Error procesando noticia de Infobae: {e}")
                    
            logger.info(f"✓ Infobae: {noticias_agregadas} noticias agregadas")
            return noticias_agregadas
            
        except Exception as e:
            logger.error(f"❌ Error scrapeando Infobae: {e}")
            return 0
    
    def _detectar_categoria(self, titulo):
        """Detectar categoría basada en palabras clave"""
        titulo_lower = titulo.lower()
        
        if any(word in titulo_lower for word in ['tecnología', 'tech', 'ai', 'software']):
            return 'Tecnología'
        elif any(word in titulo_lower for word in ['política', 'gobierno', 'ministro']):
            return 'Política'
        elif any(word in titulo_lower for word in ['economía', 'mercado', 'bolsa']):
            return 'Economía'
        elif any(word in titulo_lower for word in ['deporte', 'fútbol', 'liga']):
            return 'Deportes'
        else:
            return 'General'
    
    def ejecutar(self):
        """Ejecutar todos los scrapers"""
        logger.info("=" * 50)
        logger.info("INICIO DE SCRAPING DE MINERIAD")
        logger.info("=" * 50)
        
        total_noticias = 0
        
        # Ejecutar diferentes fuentes
        total_noticias += self.scrape_bbc()
        time.sleep(2)  # Esperar para no sobrecargar servidores
        
        total_noticias += self.scrape_infobae()
        time.sleep(2)
        
        # Agregar más fuentes aquí según sea necesario
        
        logger.info("=" * 50)
        logger.info(f"✓ SCRAPING COMPLETADO: {total_noticias} noticias agregadas")
        logger.info("=" * 50)
        
        return total_noticias

if __name__ == '__main__':
    scraper = NewsScraperMineriad()
    scraper.ejecutar()
```

### Paso 4: Crear Script de Ejecución Automática

Crear archivo `scraper/scheduler.py`:

```python
#!/usr/bin/env python3
"""
Scheduler para ejecutar el scraper automáticamente
"""

import schedule
import time
import logging
from news_scraper import NewsScraperMineriad

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def job():
    """Trabajo a ejecutar periódicamente"""
    logger.info("Ejecutando scraper automático...")
    scraper = NewsScraperMineriad()
    scraper.ejecutar()

# Agendar jobs
schedule.every().hour.at(":00").do(job)  # Cada hora en punto
schedule.every().day.at("08:00").do(job)  # 8 AM diariamente

logger.info("Scheduler iniciado. El scraper se ejecutará cada hora.")

# Mantener el scheduler en ejecución
while True:
    schedule.run_pending()
    time.sleep(60)
```

### Paso 5: Configurar Ejecución Automática

**Opción A: Windows Task Scheduler**

```powershell
# Crear script .bat
@echo off
cd C:\Users\Usuario\Scrip\mineriad\scraper
.\venv\Scripts\python.exe scheduler.py
```

Luego en Task Scheduler de Windows:
1. Crear tarea básica
2. Nombre: "Mineriad News Scraper"
3. Trigger: Diariamente a las 8:00 AM
4. Acción: Ejecutar script.bat

**Opción B: Cron job en Linux/Mac**

```bash
# Editar crontab
crontab -e

# Agregar línea:
0 * * * * cd /path/to/mineriad/scraper && ./venv/bin/python scheduler.py
```

---

## Build de Producción

### Paso 1: Crear Build Optimizado

```powershell
# Navegar al directorio raíz del proyecto
cd C:\Users\Usuario\Scrip\mineriad

# Crear build de producción
npm run build

# Resultado esperado:
# ✔ Compiled successfully.
# Initial Chunk Files | Names | Raw Size
# main.js | main | 185.23 kB |
# polyfills.js | polyfills | 36.34 kB |
```

**Los archivos compilados estarán en: `dist/mineriad/browser/`**

### Paso 2: Verificar el Build

```powershell
# Listar archivos generados
Get-ChildItem -Path "dist/mineriad/browser/" -Recurse | Select-Object Name, Length

# Verificar tamaños
Get-ChildItem -Path "dist/mineriad/browser/" | Measure-Object -Property Length -Sum
```

### Paso 3: Servir Build Localmente (Opcional)

```powershell
# Instalar servidor HTTP simple
npm install -g http-server

# Servir los archivos
http-server dist/mineriad/browser/ -p 8080

# Acceder en http://localhost:8080
```

---

## Opciones de Despliegue

### Opción 1: Vercel (Recomendado para Angular)

**Ventajas:** Muy rápido, CI/CD automático, almacenamiento en caché

#### Paso 1: Instalar Vercel CLI

```powershell
npm install -g vercel
```

#### Paso 2: Conectar a Vercel

```powershell
# Desde directorio raíz del proyecto
vercel login

# Seguir las instrucciones de autenticación
```

#### Paso 3: Desplegar

```powershell
# Primer despliegue (interactivo)
vercel

# Responder preguntas:
# Set up and deploy "C:\Users\Usuario\Scrip\mineriad"? [Y/n] → Y
# Which scope should contain your project? → Tu cuenta
# Link to existing project? [y/N] → N
# What's your project's name? → mineriad
# In which directory is your code located? → ./ (Enter)
# Want to modify these settings? [y/N] → N
```

#### Paso 4: Configurar Variables de Entorno

```powershell
# Desde CLI de Vercel
vercel env add SUPABASE_URL
# Pegar: https://aswmdmtkpjrrckhwcqlw.supabase.co

vercel env add SUPABASE_KEY
# Pegar: eyJhbGc...

# Redeploy
vercel --prod
```

**Resultado:**
```
✓ Production: https://mineriad.vercel.app
```

---

### Opción 2: Netlify

**Ventajas:** Buena integración con GitHub, formularios, funciones serverless

#### Paso 1: Conectar GitHub

1. Ir a [netlify.com](https://netlify.com)
2. Hacer clic en "Sign up"
3. Seleccionar "GitHub"
4. Autorizar Netlify

#### Paso 2: Crear Nuevo Sitio

1. Hacer clic en "New site from Git"
2. Seleccionar repositorio "mine"
3. Configurar:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/mineriad/browser`
4. Agregar variables de entorno:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
5. Hacer clic en "Deploy site"

**Resultado:** Sitio en https://mineriad-[random].netlify.app

---

### Opción 3: AWS (Más Control)

#### Paso 1: Crear Bucket S3

```powershell
# Usar AWS CLI
aws s3 mb s3://mineriad-prod --region us-east-1
```

#### Paso 2: Subir Archivos

```powershell
# Sincronizar build
aws s3 sync dist/mineriad/browser/ s3://mineriad-prod --delete

# Resultado: Archivos sincronizados
```

#### Paso 3: Configurar CloudFront (CDN)

En AWS Console:
1. Ir a CloudFront
2. Crear distribución
3. Origin: S3 bucket (mineriad-prod)
4. Configurar HTTPS
5. Crear

**Resultado:** URL como https://d123456.cloudfront.net

---

### Opción 4: Docker + Heroku

#### Paso 1: Crear Dockerfile

Crear archivo `Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Instalar servidor HTTP
RUN npm install -g http-server

# Copiar build del stage anterior
COPY --from=builder /app/dist/mineriad/browser ./dist

EXPOSE 3000

CMD ["http-server", "dist", "-p", "3000"]
```

#### Paso 2: Desplegar en Heroku

```powershell
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Crear aplicación
heroku create mineriad-prod

# Agregar remote de Git
git remote add heroku https://git.heroku.com/mineriad-prod.git

# Desplegar
git push heroku main

# Ver logs
heroku logs --tail
```

---

## Monitoreo y Mantenimiento

### Monitoreo de Rendimiento

#### Google Analytics

1. Ir a [analytics.google.com](https://analytics.google.com)
2. Crear propiedad
3. Copiar ID de seguimiento
4. Agregar a `src/index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Sentry (Error Tracking)

1. Ir a [sentry.io](https://sentry.io)
2. Crear proyecto
3. Instalar: `npm install @sentry/angular`
4. Inicializar en `src/main.ts`

### Logs y Alertas

#### En Supabase

```sql
-- Ver logs de autenticación
SELECT * FROM audit.audit_log_entries
ORDER BY created_at DESC
LIMIT 100;

-- Ver usuarios activos
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
ORDER BY last_sign_in_at DESC;
```

#### En la Plataforma de Hosting

**Vercel Logs:**
```
vercel logs -f
```

**Netlify Logs:**
```
netlify logs:functions
```

### Actualizar Dependencias

```powershell
# Verificar dependencias desactualizadas
npm outdated

# Actualizar todas
npm update

# Instalar versiones principales más nuevas
npm install @angular/core@latest
```

### Backup de Base de Datos

**Supabase hace backups automáticos**, pero para extra seguridad:

```powershell
# Exportar datos a SQL
# Desde Supabase Console → Database → Backups
# Hacer clic en "Download backup"
```

---

## Troubleshooting

### ❌ "Module not found"

```powershell
# Solución
rm -r node_modules
npm install
npm run build
```

### ❌ "Build timeout"

**En Vercel:**
```powershell
vercel build --prod --no-cache
```

### ❌ "Variables de entorno no cargadas"

Verificar en Vercel/Netlify:
1. Settings → Environment Variables
2. Confirmar que están presentes
3. Redeploy: `vercel --prod` o `netlify deploy --prod`

### ❌ "CORS error"

En Supabase → Authentication → URL Configuration:
```
Agregar URLs permitidas:
- http://localhost:4200
- https://mineriad.vercel.app
- https://yourdomain.com
```

### ❌ "Base de datos lenta"

```sql
-- Analizar query lenta
EXPLAIN ANALYZE SELECT * FROM noticias WHERE fecha > NOW() - INTERVAL '7 days';

-- Crear índices si es necesario
CREATE INDEX idx_noticias_fecha_desc ON noticias(fecha DESC);
```

---

## Lista de Verificación

### Antes del Primer Despliegue

- [ ] Verificar que `.env.local` está en `.gitignore`
- [ ] Ejecutar `npm run build` sin errores
- [ ] Verificar todas las variables de entorno
- [ ] Configurar CORS en Supabase
- [ ] Probar autenticación localmente
- [ ] Probar chatbot localmente
- [ ] Probar pagos (modo test)
- [ ] Ejecutar tests: `npm test`

### Despliegue a Producción

- [ ] Crear rama `production`
- [ ] Mergear `main` a `production`
- [ ] Ejecutar build final
- [ ] Configurar dominio personalizado
- [ ] Configurar certificado SSL/TLS
- [ ] Verificar Google Analytics
- [ ] Verificar Sentry
- [ ] Probar todos los flujos en producción
- [ ] Documentar URLs de producción
- [ ] Configurar alertas de downtime

### Mantenimiento Regular

- [ ] Revisar logs diariamente
- [ ] Actualizar dependencias mensuales
- [ ] Hacer backups de base de datos
- [ ] Monitorear rendimiento
- [ ] Revisar alertas de seguridad
- [ ] Actualizar contraseñas y keys

---

## Información de Contacto para Soporte

- 📧 **DevOps:** devops@mineriad.com
- 🔧 **Technical:** tech@mineriad.com
- 📱 **Emergencias:** +34 6XX XXX XXX

---

## Scripts Útiles de PowerShell

```powershell
# Limpiar y reinstalar
function Reset-Build {
    Remove-Item -r "node_modules", "dist", ".angular"
    npm install
    npm run build
}

# Deploy rápido (Vercel)
function Deploy-Prod {
    npm run build
    vercel --prod
    Write-Host "✓ Despliegue completado"
}

# Ver logs
function Show-Logs {
    vercel logs -f
}
```

---

**Versión:** 1.0  
**Última actualización:** 25 de Noviembre de 2025  
**Autor:** Equipo de DevOps Mineriad

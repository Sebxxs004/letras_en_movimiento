# Letras en Movimiento (MVC PHP + MySQL)

Proyecto académico, responsive, pensado para niños. Colócalo en `htdocs/` y crea la BD `letras_en_movimiento` (importa `letras_en_movimiento.sql`).

- PHP 8+, MySQL (XAMPP)
- URL base configurada en `config.php` → `BASE_URL`

## Accesos por defecto
- Admin: {"email": "admin@lem.test", "password": "Admin123*"}
- Niño demo: {"email": "nino@lem.test", "password": "Nino123*"}

> Se crean automáticamente al cargar `/public/index.php` si no existen.

## Rutas principales
- `/auth/login`, `/auth/register`
- `/dashboard/index` (niño)
- `/diagnostic/start` → resultado y nivel
- `/games/*` (6 juegos)
- `/profile/index` (estrellas, historial, certificado)
- `/admin/index` (gráfico de torta con niveles, estrellas, últimos diagnósticos)

## Audio
Usa **SpeechSynthesis** del navegador (no requiere API externa).

## Certificado PDF
Se genera con una versión mínima de FPDF (solo demostrativa). Para producción reemplazar con la librería completa.

## Notas
- Dificultad ajusta la cantidad/longitud de retos.
- Progreso y estrellas: al llegar a 100% en un juego/dificultad se otorga ⭐ automáticamente.
- Clasificación final y prueba final: puedes ampliarla en `games/` y controladores según tus necesidades.

# Services Search 🔍

Una aplicación móvil nativa desarrollada con **React Native** y **Expo Router** que permite a los usuarios buscar, filtrar y solicitar servicios profesionales de manera fluida y con validaciones en tiempo real.

---

## Características Principales

* **Navegación Basada en Archivos:** Implementación limpia utilizando la estructura nativa de `expo-router`.
* **Pantalla Principal (Services Search):**
    * Carrusel horizontal con **Top Servicios Recomendados** (filtrado automático para calificaciones $\ge$ 4.7).
    * Barra de categorías con filtros dinámicos en tiempo real.
    * Simulación de estados transaccionales (`loading` y `error`) aplicados exclusivamente a la lista de resultados inferiores, manteniendo los elementos superiores fijos.
* **Detalle del Servicio:** Vista enriquecida con información del proveedor, duración, badges de estatus dinámicos (Disponible/No Disponible) y etiquetas (#tags).
* **Formulario de Solicitud:**
    * Validaciones estrictas en tiempo real (Nombre completo $\ge$ 3 caracteres, teléfono puramente numérico, fecha con máscara `DD/MM/AAAA`).
    * Botón de envío deshabilitado dinámicamente si existen campos vacíos o inválidos.
    * Simulación de delay de 1.5 segundos en la petición de red con respuestas aleatorias de éxito o fallo mediante alertas nativas.
* **Diseño Consistente:** Header personalizado global con ícono unificado y tipografía adaptada por plataforma (Android e iOS).

---

## Instalación y Ejecución

Sigue estos pasos para clonar, instalar las dependencias y levantar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JoseRevete/ServicesSearch.git
   cd ServicesSearch

2. **Instalar dependencias:**
   ```bash
   npm install

3. **Ejecutar la aplicación:**
    ```bash
   npx expo start

---
## ¿Qué cambiarías en tu solución si este componente lo fueran a usar tres personas distintas del equipo en contextos diferentes?

Para que tres personas lo usen en contextos diferentes, cambiaría la lógica fija por props configurables, permitiendo pasar la acción del botón como una función (onPress) en lugar de dejar una ruta estática. También el componente deberia ser capaz de recibir cualquier tipo de datos (dado que actualmnete solo recibe tipo de dato Service) mediante props. Por último, añadiría una prop style para que cada desarrollador pueda ajustar el tamaño, márgenes o colores externamente según el contenedor donde lo vaya a renderizar, evitando así llenar el código de demasiados condicionales.
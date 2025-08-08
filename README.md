# Letrix

Un juego diario de palabras en español donde debes encontrar todas las combinaciones posibles usando las letras del día.

## ✨ Características

- **Letras diarias únicas**: Cada día se generan 5 letras diferentes (2 vocales + 3 consonantes)
- **Sistema de comodines**: Usa comodines para obtener letras adicionales
- **Composición visual**: Compone palabras pulsando las letras en el orden deseado
- **Puntuación inteligente**: Sistema de puntuación basado en la longitud de las palabras
- **Persistencia local**: Guarda tu progreso diario automáticamente
- **Interfaz moderna**: Diseño responsive con animaciones y efectos visuales

## 🚀 Cómo jugar

1. **Observa las letras del día** que aparecen en la parte superior
2. **Compone palabras** pulsando las letras en el orden que desees
3. **Usa comodines** si necesitas letras adicionales para formar más palabras
4. **Encuentra todas las palabras posibles** para completar el juego
5. **Comparte tu puntuación** con amigos cuando termines

## 🎮 Mecánicas del juego

### Letras del día
- Se generan automáticamente cada día
- Siempre incluyen 2 vocales y 3 consonantes
- Las letras son consistentes durante todo el día

### Sistema de comodines
- **Consonantes extra**: 2 disponibles por día
- **Vocales extra**: 1 disponible por día
- Usar comodines reduce la puntuación en un 30%

### Puntuación
- **Base**: 10 puntos por letra
- **Bonus por palabras largas**: 
  - 8+ letras: +50 puntos
  - 10+ letras: +100 puntos
- **Penalización por comodines**: -30%

## 🛠️ Tecnologías utilizadas

- **Frontend**: Vue.js 3 + Composition API
- **Estilos**: Tailwind CSS
- **Build tool**: Vite
- **Almacenamiento**: LocalStorage
- **Animaciones**: CSS personalizado + Tailwind

## 📦 Instalación y ejecución

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd wordgame
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - Navega a `http://localhost:3000`
   - ¡Disfruta del juego!

### Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build
- `npm run test` - Ejecutar tests

## 🎨 Estructura del proyecto

```
wordgame/
├── src/
│   ├── components/          # Componentes Vue
│   │   ├── DailyLetters.vue    # Letras del día
│   │   ├── WordComposer.vue    # Compositor de palabras
│   │   ├── GameStats.vue       # Estadísticas del juego
│   │   ├── FoundWords.vue      # Palabras encontradas
│   │   ├── ComodinesPanel.vue  # Panel de comodines
│   │   └── VictoryModal.vue    # Modal de victoria
│   ├── utils/               # Utilidades
│   │   ├── gameLogic.js     # Lógica del juego
│   │   └── storage.js       # Gestión de almacenamiento
│   ├── App.vue              # Componente principal
│   ├── main.js              # Punto de entrada
│   └── style.css            # Estilos globales
├── index.html               # HTML principal
├── package.json             # Dependencias y scripts
├── tailwind.config.js       # Configuración de Tailwind
└── vite.config.js           # Configuración de Vite
```

## 🔧 Configuración

### Personalización de estilos
- Edita `src/style.css` para estilos globales
- Modifica `tailwind.config.js` para personalizar Tailwind
- Los componentes usan clases de Tailwind para estilos

### Configuración del juego
- Ajusta el diccionario en `src/utils/gameLogic.js`
- Modifica la lógica de puntuación según tus preferencias
- Personaliza las animaciones en `tailwind.config.js`

## 📱 Responsive Design

El juego está optimizado para funcionar en:
- 📱 Dispositivos móviles
- 💻 Tablets
- 🖥️ Escritorio
- 🌐 Diferentes tamaños de pantalla

## 🎯 Características técnicas

- **Progressive Web App**: Funciona offline
- **LocalStorage**: Persistencia de datos local
- **Animaciones CSS**: Transiciones suaves y efectos visuales
- **Accesibilidad**: Navegación por teclado y lectores de pantalla
- **Performance**: Lazy loading y optimizaciones de Vue 3

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Diccionario de palabras en español
- Comunidad de Vue.js
- Tailwind CSS por el framework de estilos
- Vite por la herramienta de build

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en contactar.

---

**¡Disfruta jugando y mejorando tu vocabulario en español! 🎯✨**

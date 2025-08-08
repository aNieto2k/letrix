# 🔍 Guía de Debug del Juego de Palabras

Este documento explica cómo usar el objeto global `_debug` para debugging y desarrollo del juego.

## 📋 Métodos disponibles

### `_debug.getPalabras()`
Devuelve un array con **todas las palabras posibles** que se pueden formar con las letras disponibles del día.

```javascript
// Obtener todas las palabras posibles
const todasLasPalabras = _debug.getPalabras()
console.log(todasLasPalabras)
// Ejemplo de salida: ['CASA', 'MESA', 'SILLA', 'PUERTA', ...]
```

### `_debug.getPalabrasRestantes()`
Devuelve un array con las palabras que **aún no has encontrado** en el juego actual.

```javascript
// Obtener palabras que faltan por encontrar
const palabrasRestantes = _debug.getPalabrasRestantes()
console.log(palabrasRestantes)
// Ejemplo de salida: ['VENTANA', 'LIBRO', 'LAPIZ', ...]
```

### `_debug.getEstado()`
Devuelve un objeto con el **estado completo del juego**:

```javascript
// Obtener estado completo del juego
const estado = _debug.getEstado()
console.log(estado)
// Ejemplo de salida:
// {
//   letras: ['A', 'E', 'S', 'T', 'R'],
//   palabrasEncontradas: ['CASA', 'MESA'],
//   puntuacion: 80,
//   comodinesDisponibles: { consonantes: 2, vocales: 1 },
//   comodinesUsados: { consonantes: 0, vocales: 0 },
//   totalPalabras: 15,
//   juegoCompleto: false
// }
```

### `_debug.getLetras()`
Devuelve un array con las **letras disponibles** del día.

```javascript
// Obtener letras del día
const letras = _debug.getLetras()
console.log(letras)
// Ejemplo de salida: ['A', 'E', 'S', 'T', 'R']
```

### `_debug.getPalabrasEncontradas()`
Devuelve un array con las **palabras que ya has encontrado**.

```javascript
// Obtener palabras encontradas
const encontradas = _debug.getPalabrasEncontradas()
console.log(encontradas)
// Ejemplo de salida: ['CASA', 'MESA', 'SILLA']
```

### `_debug.getPuntuacion()`
Devuelve la **puntuación actual** del juego.

```javascript
// Obtener puntuación
const puntuacion = _debug.getPuntuacion()
console.log(puntuacion)
// Ejemplo de salida: 120
```

### `_debug.reiniciarJuego()`
**Reinicia el juego** a su estado inicial (útil para testing).

```javascript
// Reiniciar el juego
_debug.reiniciarJuego()
// Salida en consola: 🔄 Juego reiniciado
```

## 🚀 Casos de uso comunes

### 1. Ver todas las palabras posibles
```javascript
// En la consola del navegador
_debug.getPalabras()
```

### 2. Ver qué palabras faltan por encontrar
```javascript
// Útil para saber qué buscar
_debug.getPalabrasRestantes()
```

### 3. Verificar el estado del juego
```javascript
// Para debugging completo
const estado = _debug.getEstado()
console.table(estado)
```

### 4. Contar palabras encontradas vs. total
```javascript
const estado = _debug.getEstado()
console.log(`Progreso: ${estado.palabrasEncontradas.length}/${estado.totalPalabras}`)
```

### 5. Ver letras disponibles
```javascript
// Para verificar que las letras se cargaron correctamente
_debug.getLetras()
```

## ⚠️ Notas importantes

- **Solo disponible en desarrollo**: El objeto `_debug` solo está disponible cuando el juego está cargado
- **Consola del navegador**: Abre las herramientas de desarrollador (F12) y ve a la consola
- **Orden de ejecución**: Asegúrate de que el juego esté completamente cargado antes de usar los métodos
- **Reinicio**: El método `reiniciarJuego()` es útil para testing, pero no afecta las letras del día

## 🔧 Ejemplos avanzados

### Verificar si una palabra específica es posible
```javascript
const todasLasPalabras = _debug.getPalabras()
const palabraBuscada = 'CASA'
const esPosible = todasLasPalabras.includes(palabraBuscada)
console.log(`¿Se puede formar "${palabraBuscada}"? ${esPosible ? 'Sí' : 'No'}`)
```

### Analizar progreso del juego
```javascript
const estado = _debug.getEstado()
const progreso = (estado.palabrasEncontradas.length / estado.totalPalabras) * 100
console.log(`Progreso: ${progreso.toFixed(1)}%`)
```

### Ver palabras por longitud
```javascript
const todasLasPalabras = _debug.getPalabras()
const porLongitud = {}
todasLasPalabras.forEach(palabra => {
  const longitud = palabra.length
  porLongitud[longitud] = (porLongitud[longitud] || 0) + 1
})
console.table(porLongitud)
```

---

**💡 Tip**: Usa `console.table()` para ver los arrays de palabras de forma más legible en la consola.

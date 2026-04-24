# Fabian Portfolio editable

La landing ahora tiene dos formas de gestion:

- Editar `content.js` para cambios permanentes.
- Abrir el boton **Gestionar** en la web y usar el PIN local `fabian2026`.

Desde el panel puedes pegar un repo de GitHub, traer nombre, descripcion y lenguajes reales con la API de GitHub, revisar los campos y guardar. Esos proyectos se guardan en `localStorage` del navegador. Si luego quieres pasarlos a codigo, usa **Exportar JSON** y pega el resultado en `content.js`.

Solo necesitas tocar **`content.js`**.

## Lo minimo para anadir proyectos

Dentro de `projects`, puedes poner solo el repo:

```js
projects: [
  { repo: "https://github.com/tuusuario/tu-repo" }
]
```

Con eso ya se genera la tarjeta automaticamente.

## Si quieres personalizar mas (opcional)

```js
{
  repo: "https://github.com/tuusuario/tu-repo",
  previewImage: "./assets/previews/mi-preview.png", // opcional (prioridad alta)
  shortDescription: "Descripcion corta",
  type: "juego",
  tech: ["HTML", "CSS", "JavaScript"],
  status: "Terminado",
  liveUrl: "https://tu-deploy.com",
  objective: "Objetivo del proyecto",
  features: ["Feature 1", "Feature 2"],
  stack: ["HTML", "CSS", "JavaScript"],
  shots: ["Vista principal", "Pantalla 2"],
  previewTheme: "gaming"
}
```

## `previewTheme` disponibles

- `gaming`
- `music`
- `code`
- `dashboard`
- `agency`
- `eco`
- `generic`

## Notas de UX

- Toda la **tarjeta es clicable**.
- El detalle se abre en un panel animado.
- Clic fuera o tecla `Esc` cierra el panel con animacion.

# Portfolio Hub Editable (Version simple)

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

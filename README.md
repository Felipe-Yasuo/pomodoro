<h1 align="center">🍅 Pomodoro Timer</h1>
<p align="center"> Aplicação web de timer Pomodoro desenvolvida para praticar fundamentos de HTML, CSS e JavaScript
    puro. </p>

<p align="center"> Desenvolvido durante meus estudos de <strong> Fundamentos de Front-End (HTML, CSS e JavaScript)
    </strong>. </p>


## 🚀 Objetivo

- Estruturação semântica com HTML
- Layout responsivo com CSS (Grid, Flexbox, Media Queries)
- Manipulação de DOM
- Gerenciamento de estado
- Organização modular com ES Modules
- Persistência com localStorage
- Refatoração e melhoria de código

---

## 🚀 Funcionalidades

- ⏱ Timer de Pomodoro (25/5/15 padrão)
- 🔁 Ciclo automático (4 focos → pausa longa)
- ⏭ Pular foco ou pausa
- 📊 Indicador visual de progresso (círculo SVG)
- 📝 Histórico de sessões
- 💾 Persistência do estado do timer
- ⚙️ Configuração personalizada de tempo
- 🎨 Mudança automática de tema (Foco / Pausa / Pausa longa)
- 📱 Layout responsivo

  ---

  ## 🧠 O que eu aprendi nesse projeto

Durante o desenvolvimento eu pratiquei:

### 🔹 JavaScript

- `setInterval` e controle de tempo
- Organização por módulos (`state.js`, `timer.js`, `ui.js`, etc.)
- Separação de responsabilidades
- Refatoração para reduzir duplicação
- Eventos customizados
- Manipulação de classes e atributos
- Persistência com `localStorage`

### 🔹 CSS

- CSS Variables
- Grid Layout
- Flexbox
- Responsividade com `@media`
- Transições suaves
- Customização de scrollbar
- Organização de layout em múltiplas colunas

### 🔹 Arquitetura

- Separação de lógica e UI
- Controle de estado centralizado
- Função única de transição de sessão (`transitionSession`)
- Estrutura escalável para novas features

---

 ## 📂 Estrutura do Projeto

```
/js
 ├── main.js
 ├── state.js
 ├── timer.js
 ├── ui.js
 ├── history.js
 ├── storage.js
 └── settings.js

/css
 └── styles.css

/assets
 └── ícones e SVGs
```
---

## 🛠 Tecnologias

- HTML5
- CSS3
- JavaScript (ES Modules)
- LocalStorage API

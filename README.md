# FERRO — treino e progresso para iPhone

App de registo de treinos de ginásio, **iPhone-first**, offline e sem contas.
Reúne o que Hevy, Strong e afins cobram nos planos pagos — e acrescenta análise de
prontidão, equilíbrio muscular, recordes, fotos de progresso e ferramentas de treino.

> **Estado:** app completa e funcional, feita para ser instalada no ecrã principal do iPhone
> através do Safari. Não é um binário nativo da App Store: criar um `.ipa` exige um Mac com
> Xcode e uma conta de developer. O código é estático e pode ser embrulhado mais tarde
> (Capacitor/WKWebView) sem reescrever a lógica.

---

## Começar em 1 minuto

### No computador
1. Instala o [Node.js](https://nodejs.org) (só é preciso para servir os ficheiros).
2. Faz duplo clique em **`Iniciar Ferro.bat`**.
3. Abre `http://localhost:8080`.

Também podes abrir `index.html` diretamente no browser, mas o servidor é melhor
(cache offline, caminhos corretos e PWA).

### No iPhone
**Opção A — mesma Wi-Fi (rápido, para experimentar)**
1. Corre o `Iniciar Ferro.bat`. A janela mostra o endereço `http://192.168.x.x:8080`.
2. No iPhone, abre esse endereço no Safari (mesma rede Wi-Fi).
3. Partilhar → **Adicionar ao ecrã principal**.

**Opção B — alojar (recomendado: funciona em qualquer lado e offline)**
1. Publica esta pasta num host estático com HTTPS — Netlify Drop, Cloudflare Pages,
   GitHub Pages ou Vercel (arrastar a pasta chega).
2. Abre o URL no Safari do iPhone.
3. Partilhar → **Adicionar ao ecrã principal**.

Depois da primeira visita, o service worker guarda a app em cache: passa a abrir
sem internet e em ecrã inteiro, como uma app.

> Os dados ficam guardados **por origem**. Se mudares de endereço, exporta primeiro
> o backup (Definições → Exportar) e importa no novo.

---

## O que está incluído

### Treino
- **Treino ativo** com séries, peso, repetições, RPE e tipos de série (normal, aquecimento, drop set, falha).
- **Descanso automático** com temporizador flutuante, som, vibração e +15 s.
- **Superséries** e reordenação de exercícios.
- **Referência da última sessão** e pré-preenchimento de pesos/reps.
- **Recordes em tempo real** (peso máximo, 1RM estimado, reps, volume da série).
- **Resumo final** com volume, duração, repartição muscular, avaliação e notas.
- **Notas** por exercício e por treino; minimizar e retomar o treino.
- **Substituir exercícios**, calculadora de discos e gerador de aquecimento no próprio treino.

### Rotinas e programas
- Rotinas ilimitadas, com pastas, notas, ordem, séries/reps/descanso alvo e duplicação.
- **10 programas completos** (41 rotinas): Full Body, Upper/Lower, PPL, Push/Pull, StrongLifts 5×5,
  GZCLP, PHUL, Bro Split, Arnold Split e Casa com halteres.
- Adição de um programa inteiro com um toque.

### Análise
- **1RM estimado** por exercício (Epley, Brzycki, Lombardi, O’Conner, Wathan) com tabela de percentagens.
- Gráficos de **1RM, peso, volume e reps** por exercício.
- **Volume semanal** (12 semanas) e **mapa de consistência** (26 semanas).
- **Equilíbrio muscular** por grupo, ratio push/pull e upper/lower.
- **Prontidão diária** (sono, energia, dores, stress) com recomendação de intensidade.
- **Recordes pessoais** por exercício e histórico de sessões.
- **Conquistas** e níveis (23 marcos).

### Corpo
- Peso corporal com gráfico, variação a 30 dias e progresso para o objetivo.
- Medidas (peito, cintura, quadril, braço, coxa, gémeo, pescoço, ombros, % gordura).
- **Fotos de progresso** comprimidas e guardadas no dispositivo, com comparação lado a lado.
- IMC e peso saudável.

### Ferramentas
- Calculadora de 1RM e percentagens.
- Calculadora de discos com inventário configurável (barra + discos).
- Gerador de aquecimento.
- Temporizador de descanso e temporizador de intervalos (HIIT).
- Tabela RPE/RIR, IMC, força relativa (DOTS) e conversor kg/lb.

### Biblioteca
- **234 exercícios** em português, com músculo primário/secundários, equipamento,
  mecânica, nível, aliases em inglês e dica técnica.
- Pesquisa, filtros por músculo/equipamento, favoritos e exercícios personalizados.

### Dados e app
- 100% **offline** depois da primeira visita; instalável no ecrã principal.
- **Sem contas, sem paywalls, sem analytics.**
- Exportação **JSON** completa (com fotos) e **CSV** dos treinos.
- **Backup automático** opcional para um repositório **privado no GitHub** (dados; as fotos vão na exportação manual).
- Importação de backup, cópia de segurança automática diária e reposição total.
- Tema escuro e claro, unidades **kg/lb**, semana a começar à segunda ou domingo,
  objetivo semanal e séries-alvo por músculo.

---

## Limites conhecidos (e porquê)

- **Nativo iOS:** sem Mac/Xcode não é possível gerar um `.ipa`. Esta versão é uma PWA
  iPhone-first, com safe areas, gestos e ecrã inteiro. A lógica está isolada e pronta
  para um wrapper nativo.
- **Ecrã bloqueado:** o iOS suspende JavaScript com o ecrã bloqueado. O temporizador
  calcula pelo relógio (recupera o tempo certo ao voltar) e as notificações exigem
  permissão e a app instalada. O som funciona com a app aberta.
- **Sincronização:** não há nuvem por opção de privacidade. O backup é local e
  exportável — faz exportações regulares, porque o iOS pode limpar dados de sites
  pouco usados.
- **Vídeos de exercícios:** não incluídos (a app tem de funcionar offline e sem assets pesados).

---

## Estrutura

```
Ferro/
  index.html              shell, sprite de ícones, ordem dos scripts
  manifest.webmanifest    PWA (standalone, ícones, tema)
  sw.js                   cache offline
  serve.cjs               servidor local sem dependências
  Iniciar Ferro.bat       arranque no Windows
  css/app.css             design system + todos os componentes
  icons/                  ícones 180/192/512/maskable + SVG
  js/
    core/
      util.js             DOM, datas, formatação, IndexedDB, imagens
      calc.js             1RM, volume, PRs, discos, aquecimento, streaks, DOTS
      store.js            estado, persistência, rotinas, treino ativo, backup
      charts.js           gráficos em canvas (linha, sparkline, anéis)
      timer.js            temporizador de descanso global
      ui.js               toasts, sheets, confirmações, seletor de exercícios
    data/
      exercises.js        234 exercícios
      programs.js         10 programas
    views/                home, workout, routines, history, progress, body,
                          exercises, tools, achievements, settings
    app.js                router, tabbar, arranque
  _dev/                   harness de testes (não faz parte da app)
```

## Desenvolvimento

```bash
node serve.cjs            # http://localhost:8080
node _dev/shot.cjs home   # screenshots iPhone via Edge headless
node _dev/shot.cjs audit  # 32 testes de cálculos e fluxos no browser
```

O harness usa o DevTools Protocol do Edge (headless, viewport 390×844, DPR 2) e
guarda as imagens em `_dev/shots/`.

> Ao publicares alterações, sobe a versão em `sw.js` (`ferro-v1` → `ferro-v2`) para
> forçar os clientes a atualizar a cache offline.

## Privacidade

Não existe servidor, conta, telemetria ou publicidade. Treinos, medidas e fotos ficam
no armazenamento do próprio iPhone. Exportas tudo o que existe, a qualquer momento.

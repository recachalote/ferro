/* Programas de treino — Ferro */
window.FERRO_PROGRAMS = [
  {
    id: "fullbody3",
    name: "Full Body 3×",
    subtitle: "Corpo inteiro, 3 dias por semana",
    level: "beginner",
    days: 3,
    weeks: 8,
    focus: "Hipertrofia e força",
    equipment: "Ginásio completo",
    description: "Três sessões por semana que treinam o corpo inteiro, com ênfase nos movimentos compostos. Ideal para construir uma base sólida nos primeiros meses.",
    progression: "Dobra progressão: quando atinges o topo do intervalo de repetições em todas as séries, sobe 2,5 kg nos exercícios de barra e 2 kg nos halteres.",
    routines: [
      {
        name: "Full Body A",
        folder: "Full Body 3×",
        notes: "Descanso 2-3 min nos compostos e 60-90 s nos acessórios.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "6-8", rest: 180, note: "Desce até à paralela, sem perder a curvatura lombar." },
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "6-8", rest: 150, note: "Ombros encaixados e pés firmes no chão." },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 3, reps: "8-10", rest: 120, note: "Tronco a 45°, puxa a barra ao umbigo." },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "8-12", rest: 90 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "10-12", rest: 60, note: "Sem balançar o tronco." },
          { name: "Extensão de tríceps na corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Elevação de pernas suspenso", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "10-15", rest: 60 },
          { name: "Gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 3, reps: "12-15", rest: 60, note: "Pausa de 1 s no topo." }
        ]
      },
      {
        name: "Full Body B",
        folder: "Full Body 3×",
        notes: "Sessão com mais ênfase na cadeia posterior.",
        exercises: [
          { name: "Peso morto", muscle: "hamstrings", equipment: "barbell", sets: 3, reps: "5-6", rest: 180, note: "Barra junto às pernas e coluna neutra." },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 3, reps: "8-12", rest: 90, note: "Puxa com os cotovelos, não com as mãos." },
          { name: "Afundos com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90, note: "Repetições por perna." },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Flexões de braços", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60, note: "Corpo em prancha, sem afundar a bacia." },
          { name: "Elevação de gémeos sentado", muscle: "calves", equipment: "machine", sets: 3, reps: "15-20", rest: 60 }
        ]
      },
      {
        name: "Full Body C",
        folder: "Full Body 3×",
        notes: "Último treino da semana, com mais trabalho de isolamento.",
        exercises: [
          { name: "Agachamento frontal", muscle: "quads", equipment: "barbell", sets: 3, reps: "6-8", rest: 150, note: "Cotovelos altos para manter o tronco direito." },
          { name: "Supino com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 120, note: "Sem arquear a lombar." },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Rosca concentrada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps acima da cabeça", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Prancha lateral", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "30-40 s", rest: 45, note: "Cada lado." }
        ]
      }
    ]
  },
  {
    id: "upperlower4",
    name: "Upper/Lower 4×",
    subtitle: "Metade superior e inferior, 4 dias",
    level: "intermediate",
    days: 4,
    weeks: 10,
    focus: "Força e hipertrofia",
    equipment: "Ginásio completo",
    description: "Quatro sessões que dividem o corpo em metade superior e inferior, alternando dias de força com dias de hipertrofia. Bom equilíbrio entre carga e volume.",
    progression: "Sobe 2,5 kg nos levantamentos principais sempre que fizeres todas as séries dentro do intervalo; nos acessórios, acrescenta uma repetição por série antes de aumentar o peso.",
    routines: [
      {
        name: "Superior A — Força",
        folder: "Upper/Lower 4×",
        notes: "Descanso 2-3 min nos dois primeiros exercícios.",
        exercises: [
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 120 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 3, reps: "8-10", rest: 90 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "8-10", rest: 60 },
          { name: "Extensão de tríceps na testa", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "8-12", rest: 60 },
          { name: "Face pull na corda", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 60, note: "Trabalho de saúde do ombro." }
        ]
      },
      {
        name: "Inferior A — Força",
        folder: "Upper/Lower 4×",
        notes: "Aquecimento obrigatório de 5-10 min antes do agachamento.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Peso morto romeno", muscle: "hamstrings", equipment: "barbell", sets: 3, reps: "8-10", rest: 150, note: "Empurra a bacia para trás." },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 3, reps: "10-12", rest: 120 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "10-12", rest: 90 },
          { name: "Elevação de gémeos em pé", muscle: "calves", equipment: "machine", sets: 4, reps: "10-12", rest: 60 },
          { name: "Elevação de pernas", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "10-15", rest: 60 },
          { name: "Prancha frontal", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "40-50 s", rest: 45 }
        ]
      },
      {
        name: "Superior B — Hipertrofia",
        folder: "Upper/Lower 4×",
        notes: "Descanso 60-90 s; foca na ligação mente-músculo.",
        exercises: [
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 120 },
          { name: "Remada baixa na polia", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Supino na máquina", muscle: "chest", equipment: "machine", sets: 3, reps: "10-12", rest: 90 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Rosca alternada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Tríceps na corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Encolhimento com halteres", muscle: "traps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Inferior B — Hipertrofia",
        folder: "Upper/Lower 4×",
        notes: "Sessão mais curta e intensa, com foco em quadríceps e gémeos.",
        exercises: [
          { name: "Peso morto", muscle: "lowerback", equipment: "barbell", sets: 4, reps: "5-6", rest: 180, note: "Cada repetição começa no chão." },
          { name: "Agachamento búlgaro", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120, note: "Repetições por perna." },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora sentado", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos sentado", muscle: "calves", equipment: "machine", sets: 4, reps: "15-20", rest: 60 },
          { name: "Hiperextensão lombar", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Abdominal na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "ppl6",
    name: "Push Pull Legs 6×",
    subtitle: "Empurrar, puxar e pernas, 6 dias",
    level: "advanced",
    days: 6,
    weeks: 12,
    focus: "Hipertrofia",
    equipment: "Ginásio completo",
    description: "Divisão clássica em empurrar, puxar e pernas, repetida duas vezes por semana com ênfases diferentes. Volume elevado, pensado para quem já treina há algum tempo.",
    progression: "Sobe 2,5 kg nos compostos quando cumprires o topo do intervalo em todas as séries; a cada quatro semanas, acrescenta uma série aos principais ou uma repetição nos acessórios.",
    routines: [
      {
        name: "Empurrar A — Pesado",
        folder: "Push Pull Legs 6×",
        notes: "Dia de cargas altas no supino e no desenvolvimento.",
        exercises: [
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Supino inclinado com barra", muscle: "chest", equipment: "barbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Tríceps na corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps acima da cabeça", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Elevação frontal com disco", muscle: "shoulders", equipment: "plate", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Puxar A — Pesado",
        folder: "Push Pull Legs 6×",
        notes: "Peso morto no início, com técnica antes de carga.",
        exercises: [
          { name: "Peso morto", muscle: "hamstrings", equipment: "barbell", sets: 3, reps: "5-6", rest: 180 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 4, reps: "8-10", rest: 90 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 60 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "8-12", rest: 60 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Encolhimento com barra", muscle: "traps", equipment: "barbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Pernas A",
        folder: "Push Pull Legs 6×",
        notes: "Descanso 3 min antes das séries pesadas de agachamento.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Peso morto romeno", muscle: "hamstrings", equipment: "barbell", sets: 3, reps: "8-10", rest: 150 },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 3, reps: "10-12", rest: 120 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos em pé", muscle: "calves", equipment: "machine", sets: 4, reps: "12-15", rest: 60 },
          { name: "Abdominal na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Prancha frontal", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "45-60 s", rest: 45 }
        ]
      },
      {
        name: "Empurrar B — Volume",
        folder: "Push Pull Legs 6×",
        notes: "Cargas moderadas com mais repetições e menos descanso.",
        exercises: [
          { name: "Supino com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 150 },
          { name: "Crucifixo na máquina", muscle: "chest", equipment: "machine", sets: 3, reps: "10-12", rest: 60 },
          { name: "Elevação lateral na polia", muscle: "shoulders", equipment: "cable", sets: 4, reps: "12-15", rest: 45 },
          { name: "Flexões de braços", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60 },
          { name: "Extensão de tríceps na testa", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Tríceps na máquina", muscle: "triceps", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Puxar B — Volume",
        folder: "Push Pull Legs 6×",
        notes: "Prioriza amplitude e controlo na descida.",
        exercises: [
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 4, reps: "6-8", rest: 120, note: "Usa assistência se não chegares às 6 repetições." },
          { name: "Remada baixa na polia", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Puxada alta com triângulo", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Rosca alternada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca Scott", muscle: "biceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Pernas B",
        folder: "Push Pull Legs 6×",
        notes: "Segundo treino de pernas da semana, com mais ênfase no quadríceps.",
        exercises: [
          { name: "Agachamento frontal", muscle: "quads", equipment: "barbell", sets: 3, reps: "6-8", rest: 150 },
          { name: "Peso morto", muscle: "hamstrings", equipment: "barbell", sets: 3, reps: "6-8", rest: 180 },
          { name: "Afundo búlgaro", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 90 },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora sentado", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos sentado", muscle: "calves", equipment: "machine", sets: 4, reps: "15-20", rest: 45 },
          { name: "Hiperextensão lombar", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "pushpull4",
    name: "Push Pull 4×",
    subtitle: "Empurrar e puxar, 4 dias",
    level: "intermediate",
    days: 4,
    weeks: 10,
    focus: "Hipertrofia",
    equipment: "Ginásio completo",
    description: "Duas sessões de empurrar e duas de puxar por semana, alternando um dia pesado com outro de mais volume. Simples de organizar e fácil de recuperar.",
    progression: "Progride 2,5 kg nos exercícios de barra quando fizeres todas as séries no topo do intervalo e, nos acessórios, acrescenta uma repetição por série antes de subir o peso.",
    routines: [
      {
        name: "Empurrar A",
        folder: "Push Pull 4×",
        notes: "Dia pesado de peito e ombro.",
        exercises: [
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 150 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Tríceps na corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps acima da cabeça", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Flexões de braços", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60 }
        ]
      },
      {
        name: "Puxar A",
        folder: "Push Pull 4×",
        notes: "Peso morto seguido de trabalho vertical e horizontal.",
        exercises: [
          { name: "Peso morto", muscle: "hamstrings", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 4, reps: "6-8", rest: 120 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "8-10", rest: 60 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Empurrar B",
        folder: "Push Pull 4×",
        notes: "Sessão de volume, com mais máquinas e menos carga livre.",
        exercises: [
          { name: "Supino na máquina", muscle: "chest", equipment: "machine", sets: 4, reps: "8-12", rest: 90 },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 120 },
          { name: "Crucifixo na polia", muscle: "chest", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação lateral na polia", muscle: "shoulders", equipment: "cable", sets: 4, reps: "15-20", rest: 45 },
          { name: "Tríceps na máquina", muscle: "triceps", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Extensão de tríceps na testa", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Encolhimento com halteres", muscle: "traps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Puxar B",
        folder: "Push Pull 4×",
        notes: "Foco em dorsais e braços, com descanso curto.",
        exercises: [
          { name: "Remada baixa na polia", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90 },
          { name: "Puxada alta com triângulo", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Pullover na polia", muscle: "back", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Rosca alternada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca Scott", muscle: "biceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca inversa", muscle: "forearms", equipment: "barbell", sets: 3, reps: "12-15", rest: 45 }
        ]
      }
    ]
  },
  {
    id: "stronglifts5x5",
    name: "StrongLifts 5×5",
    subtitle: "Força bruta, 3 dias por semana",
    level: "beginner",
    days: 3,
    weeks: 12,
    focus: "Força",
    equipment: "Ginásio completo",
    description: "Programa de força com dois treinos alternados e ênfase nos cinco movimentos básicos. Pouco volume e cargas a subir de forma linear, treino após treino.",
    progression: "Adiciona 2,5 kg em cada treino no agachamento, supino, desenvolvimento e remada, e 5 kg no peso morto. Se falhares duas sessões seguidas no mesmo exercício, recua 10% e volta a subir.",
    routines: [
      {
        name: "Treino A",
        folder: "StrongLifts 5×5",
        notes: "Alterna com o treino B: A-B-A numa semana e B-A-B na seguinte.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 5, reps: "5", rest: 180, note: "Todas as séries com a mesma carga." },
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 5, reps: "5", rest: 180 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 5, reps: "5", rest: 180 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 120, note: "Acessório para reforçar as costas." },
          { name: "Prancha frontal", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "45-60 s", rest: 60 },
          { name: "Elevação de gémeos em pé", muscle: "calves", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Treino B",
        folder: "StrongLifts 5×5",
        notes: "O peso morto é feito apenas uma série de 5 repetições.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 5, reps: "5", rest: 180 },
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 5, reps: "5", rest: 180 },
          { name: "Peso morto", muscle: "lowerback", equipment: "barbell", sets: 1, reps: "5", rest: 240, note: "Uma só série, com técnica perfeita." },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 90 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "8-12", rest: 60 },
          { name: "Abdominal na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "gzclp",
    name: "GZCLP",
    subtitle: "Progressão em camadas, 4 dias",
    level: "intermediate",
    days: 4,
    weeks: 12,
    focus: "Força e hipertrofia",
    equipment: "Ginásio completo",
    description: "Estrutura em três camadas (T1, T2 e T3) que junta levantamentos pesados a trabalho de volume. Progressão simples e repetível, fácil de ajustar.",
    progression: "Nos T1 faz 5 séries de 3 e sobe 2,5 kg por semana; nos T2 faz 3 séries de 10 e nos T3 acrescenta repetições até ao topo do intervalo antes de aumentar o peso.",
    routines: [
      {
        name: "Dia 1 — T1 Agachamento",
        folder: "GZCLP",
        notes: "T1 = força, T2 = base, T3 = volume. Descansa 3 min no T1.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 5, reps: "3", rest: 180 },
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 3, reps: "10", rest: 120 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Remada baixa na polia", muscle: "back", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "15", rest: 45 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Dia 2 — T1 Desenvolvimento",
        folder: "GZCLP",
        notes: "Peso morto no T2 com carga moderada e mais repetições.",
        exercises: [
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 5, reps: "3", rest: 180 },
          { name: "Peso morto", muscle: "hamstrings", equipment: "barbell", sets: 3, reps: "10", rest: 150 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 90 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 3, reps: "12-15", rest: 90 },
          { name: "Extensão de tríceps na corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Dia 3 — T1 Supino",
        folder: "GZCLP",
        notes: "Segundo dia de agachamento, agora como T2.",
        exercises: [
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 5, reps: "3", rest: 180 },
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 3, reps: "10", rest: 150 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação lateral na polia", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15", rest: 45 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Dia 4 — T1 Peso morto",
        folder: "GZCLP",
        notes: "Último treino da semana; guarda energia para o T1.",
        exercises: [
          { name: "Peso morto", muscle: "lowerback", equipment: "barbell", sets: 5, reps: "3", rest: 240 },
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "10", rest: 120 },
          { name: "Remada baixa na polia", muscle: "back", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Puxada alta com triângulo", muscle: "back", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Tríceps na máquina", muscle: "triceps", equipment: "machine", sets: 3, reps: "15", rest: 45 },
          { name: "Abdominal na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "15", rest: 45 }
        ]
      }
    ]
  },
  {
    id: "phul",
    name: "PHUL",
    subtitle: "Power Hypertrophy Upper Lower",
    level: "intermediate",
    days: 4,
    weeks: 12,
    focus: "Força e hipertrofia",
    equipment: "Ginásio completo",
    description: "Dois dias de força e dois de hipertrofia, alternando metade superior e inferior. Junta cargas altas com volume moderado na mesma semana.",
    progression: "Nos dias de força sobe 2,5 kg quando fizeres o topo do intervalo; nos dias de hipertrofia, acrescenta uma repetição por série e só depois aumentas o peso.",
    routines: [
      {
        name: "Superior — Força",
        folder: "PHUL",
        notes: "Séries de 3-5 repetições com descanso longo.",
        exercises: [
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "3-5", rest: 180 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 4, reps: "3-5", rest: 180 },
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 150 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 3, reps: "6-8", rest: 120 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "6-8", rest: 90 },
          { name: "Extensão de tríceps na testa", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "6-8", rest: 90 },
          { name: "Encolhimento com barra", muscle: "traps", equipment: "barbell", sets: 3, reps: "8-10", rest: 90 }
        ]
      },
      {
        name: "Inferior — Força",
        folder: "PHUL",
        notes: "Agachamento e peso morto no mesmo dia: controla o volume total.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "3-5", rest: 240 },
          { name: "Peso morto", muscle: "hamstrings", equipment: "barbell", sets: 4, reps: "3-5", rest: 240 },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 3, reps: "8-10", rest: 120 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "8-10", rest: 90 },
          { name: "Elevação de gémeos em pé", muscle: "calves", equipment: "machine", sets: 4, reps: "8-10", rest: 60 },
          { name: "Abdominal na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Superior — Hipertrofia",
        folder: "PHUL",
        notes: "Repetições mais altas e descanso de 60-90 s.",
        exercises: [
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 120 },
          { name: "Remada baixa na polia", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Crucifixo na máquina", muscle: "chest", equipment: "machine", sets: 3, reps: "10-15", rest: 60 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Rosca alternada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Tríceps na corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-15", rest: 60 },
          { name: "Supino no smith", muscle: "chest", equipment: "smith", sets: 3, reps: "10-12", rest: 90 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Inferior — Hipertrofia",
        folder: "PHUL",
        notes: "Mais repetições e trabalho unilateral para corrigir assimetrias.",
        exercises: [
          { name: "Agachamento frontal", muscle: "quads", equipment: "barbell", sets: 4, reps: "8-10", rest: 150 },
          { name: "Peso morto romeno", muscle: "hamstrings", equipment: "barbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 4, reps: "10-15", rest: 60 },
          { name: "Cadeira flexora sentado", muscle: "hamstrings", equipment: "machine", sets: 4, reps: "10-15", rest: 60 },
          { name: "Afundo búlgaro", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90, note: "Repetições por perna." },
          { name: "Elevação de gémeos sentado", muscle: "calves", equipment: "machine", sets: 4, reps: "12-20", rest: 45 },
          { name: "Hiperextensão lombar", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "brosplit5",
    name: "Bro Split 5×",
    subtitle: "Um grupo muscular por dia",
    level: "intermediate",
    days: 5,
    weeks: 10,
    focus: "Hipertrofia",
    equipment: "Ginásio completo",
    description: "Divisão clássica com um grupo muscular por sessão, muito volume por músculo e recuperação longa. Para quem gosta de esgotar cada grupo até à falha.",
    progression: "Trabalha entre 1 e 2 repetições da falha e sobe 2,5 kg quando fizeres o topo do intervalo em todas as séries; nos isolamentos, aumenta repetições antes do peso.",
    routines: [
      {
        name: "Peito",
        folder: "Bro Split 5×",
        notes: "Alterna ângulos: plano, inclinado e declinado.",
        exercises: [
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Crucifixo na máquina", muscle: "chest", equipment: "machine", sets: 3, reps: "10-12", rest: 60 },
          { name: "Supino declinado na máquina", muscle: "chest", equipment: "machine", sets: 3, reps: "10-12", rest: 90 },
          { name: "Crucifixo na polia", muscle: "chest", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Flexões de braços", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60 }
        ]
      },
      {
        name: "Costas",
        folder: "Bro Split 5×",
        notes: "Começa pela barra fixa, enquanto estás fresco.",
        exercises: [
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 4, reps: "6-10", rest: 120 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada baixa na polia", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Pullover na polia", muscle: "back", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Encolhimento com barra", muscle: "traps", equipment: "barbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Hiperextensão lombar", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Ombros",
        folder: "Bro Split 5×",
        notes: "Não encolhas os ombros nas elevações laterais.",
        exercises: [
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Elevação frontal com disco", muscle: "shoulders", equipment: "plate", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação lateral na polia", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 },
          { name: "Encolhimento com halteres", muscle: "traps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Braços",
        folder: "Bro Split 5×",
        notes: "Alterna bíceps e tríceps para manter a intensidade.",
        exercises: [
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 4, reps: "8-10", rest: 60 },
          { name: "Supino fechado", muscle: "triceps", equipment: "barbell", sets: 4, reps: "8-10", rest: 90 },
          { name: "Rosca alternada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps na corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca Scott", muscle: "biceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Mergulhos nas paralelas", muscle: "triceps", equipment: "bodyweight", sets: 3, reps: "8-12", rest: 90 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Rosca inversa", muscle: "forearms", equipment: "barbell", sets: 3, reps: "12-15", rest: 45 }
        ]
      },
      {
        name: "Pernas",
        folder: "Bro Split 5×",
        notes: "Sessão longa: guarda 3 min de descanso para o agachamento.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "6-8", rest: 180 },
          { name: "Peso morto romeno", muscle: "hamstrings", equipment: "barbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 3, reps: "10-12", rest: 120 },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Afundo com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Elevação de gémeos em pé", muscle: "calves", equipment: "machine", sets: 4, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos sentado", muscle: "calves", equipment: "machine", sets: 3, reps: "15-20", rest: 45 }
        ]
      }
    ]
  },
  {
    id: "arnold6",
    name: "Arnold Split 6×",
    subtitle: "Peito e costas, ombros e braços, pernas",
    level: "advanced",
    days: 6,
    weeks: 12,
    focus: "Hipertrofia",
    equipment: "Ginásio completo",
    description: "Divisão de seis dias ao estilo Arnold, com peito e costas no mesmo treino e um bloco dedicado a ombros e braços. Volume muito alto, só para quem recupera bem.",
    progression: "Sobe 2,5 kg nos compostos quando cumprires o topo do intervalo e mantém os isolamentos entre 1 e 2 repetições da falha. A cada três semanas, faz uma semana com metade do volume.",
    routines: [
      {
        name: "Peito e Costas A",
        folder: "Arnold Split 6×",
        notes: "Supersérie opcional entre peito e costas.",
        exercises: [
          { name: "Supino com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 4, reps: "8-10", rest: 120 },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Crucifixo com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Puxada alta na polia", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Pullover com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Ombros e Braços A",
        folder: "Arnold Split 6×",
        notes: "Dia pesado para ombros e braços.",
        exercises: [
          { name: "Desenvolvimento militar", muscle: "shoulders", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 4, reps: "8-10", rest: 60 },
          { name: "Supino fechado", muscle: "triceps", equipment: "barbell", sets: 4, reps: "8-10", rest: 90 },
          { name: "Elevação lateral inclinado", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 45 },
          { name: "Rosca alternada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps na corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca punho", muscle: "forearms", equipment: "dumbbell", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Pernas A",
        folder: "Arnold Split 6×",
        notes: "Agachamento pesado seguido de trabalho de posterior.",
        exercises: [
          { name: "Agachamento com barra", muscle: "quads", equipment: "barbell", sets: 5, reps: "6-8", rest: 180 },
          { name: "Peso morto romeno", muscle: "hamstrings", equipment: "barbell", sets: 4, reps: "8-10", rest: 150 },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 4, reps: "10-12", rest: 120 },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos em pé", muscle: "calves", equipment: "machine", sets: 4, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos sentado", muscle: "calves", equipment: "machine", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Peito e Costas B",
        folder: "Arnold Split 6×",
        notes: "Ângulos diferentes do treino A, com mais máquinas.",
        exercises: [
          { name: "Supino inclinado com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Remada baixa na polia", muscle: "back", equipment: "cable", sets: 4, reps: "8-10", rest: 90 },
          { name: "Crucifixo na máquina", muscle: "chest", equipment: "machine", sets: 4, reps: "10-12", rest: 60 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90 },
          { name: "Supino declinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Puxada alta com triângulo", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Flexões de braços", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60 }
        ]
      },
      {
        name: "Ombros e Braços B",
        folder: "Arnold Split 6×",
        notes: "Mais volume e menos carga do que no treino A.",
        exercises: [
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Elevação frontal com disco", muscle: "shoulders", equipment: "plate", sets: 4, reps: "12-15", rest: 60 },
          { name: "Rosca Scott", muscle: "biceps", equipment: "ezbar", sets: 4, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps acima da cabeça", muscle: "triceps", equipment: "ezbar", sets: 4, reps: "10-12", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 4, reps: "15-20", rest: 45 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Mergulhos nas paralelas", muscle: "triceps", equipment: "bodyweight", sets: 3, reps: "8-12", rest: 90 },
          { name: "Encolhimento com halteres", muscle: "traps", equipment: "dumbbell", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Pernas B",
        folder: "Arnold Split 6×",
        notes: "Sessão com mais ênfase no quadríceps e nos gémeos.",
        exercises: [
          { name: "Agachamento frontal", muscle: "quads", equipment: "barbell", sets: 4, reps: "8-10", rest: 150 },
          { name: "Peso morto", muscle: "lowerback", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Afundo búlgaro", muscle: "quads", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90, note: "Repetições por perna." },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "15-20", rest: 45 },
          { name: "Cadeira flexora sentado", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "15-20", rest: 45 },
          { name: "Elevação de gémeos sentado", muscle: "calves", equipment: "machine", sets: 4, reps: "15-20", rest: 45 },
          { name: "Hiperextensão lombar", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "casahalteres3",
    name: "Casa com halteres",
    subtitle: "Equipamento mínimo, 3 dias por semana",
    level: "beginner",
    days: 3,
    weeks: 8,
    focus: "Hipertrofia geral",
    equipment: "Halteres, banco, barra fixa e kettlebell",
    description: "Programa de corpo inteiro pensado para treinar em casa com halteres, um banco e uma barra fixa. Movimentos simples e progressão fácil de seguir.",
    progression: "Quando fizeres o topo do intervalo em todas as séries, aumenta 2 kg em cada haltere ou passa para uma variação mais difícil. Sem peso extra, acrescenta uma série.",
    routines: [
      {
        name: "Casa A",
        folder: "Casa com halteres",
        notes: "Treino completo com halteres e peso do corpo.",
        exercises: [
          { name: "Agachamento goblet", muscle: "quads", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90, note: "Haltere junto ao peito, tronco direito." },
          { name: "Flexões de braços", muscle: "chest", equipment: "bodyweight", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90 },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 75 },
          { name: "Afundos com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 75, note: "Repetições por perna." },
          { name: "Rosca alternada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps acima da cabeça", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Prancha frontal", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "40-60 s", rest: 45 }
        ]
      },
      {
        name: "Casa B",
        folder: "Casa com halteres",
        notes: "Usa o kettlebell para o trabalho de cadeia posterior.",
        exercises: [
          { name: "Peso morto com halteres", muscle: "hamstrings", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Supino no chão com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 90 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 120, note: "Se precisares, usa uma banda de assistência." },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Agachamento búlgaro", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 75 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Flexão de tríceps no banco", muscle: "triceps", equipment: "bodyweight", sets: 3, reps: "10-12", rest: 60 },
          { name: "Elevação de gémeos em pé", muscle: "calves", equipment: "bodyweight", sets: 4, reps: "15-20", rest: 45 },
          { name: "Swing com kettlebell", muscle: "glutes", equipment: "kettlebell", sets: 3, reps: "15-20", rest: 60, note: "Movimento de bacia, não de braços." }
        ]
      },
      {
        name: "Casa C",
        folder: "Casa com halteres",
        notes: "Sessão com mais volume de ombros e braços.",
        exercises: [
          { name: "Agachamento sumo com haltere", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada curvada com halteres", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Desenvolvimento Arnold", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 75 },
          { name: "Elevação de gémeos sentado com halteres", muscle: "calves", equipment: "dumbbell", sets: 3, reps: "15-20", rest: 45 },
          { name: "Rosca concentrada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 45 },
          { name: "Extensão de tríceps deitado com halteres", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Abdominal bicicleta", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "20-30", rest: 45 },
          { name: "Prancha lateral", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "30-40 s", rest: 45, note: "Cada lado." }
        ]
      }
    ]
  }
];

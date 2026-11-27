/* Training programmes — Ferro */
window.FERRO_PROGRAMS = [
  {
    id: "fullbody3",
    name: "Full Body 3×",
    subtitle: "Full body, 3 days a week",
    level: "beginner",
    days: 3,
    weeks: 8,
    focus: "Hypertrophy and strength",
    equipment: "Full gym",
    description: "Three sessions a week that train the whole body, with an emphasis on compound movements. Ideal for building a solid base in your first few months.",
    progression: "Double progression: when you hit the top of the rep range on every set, add 2.5 kg to barbell exercises and 2 kg to dumbbells.",
    routines: [
      {
        name: "Full Body A",
        folder: "Full Body 3×",
        notes: "Rest 2-3 min on the compounds and 60-90 s on the accessories.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "6-8", rest: 180, note: "Squat to parallel without losing your lower-back arch." },
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "6-8", rest: 150, note: "Shoulders pinned back and feet planted firmly." },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 3, reps: "8-10", rest: 120, note: "Torso at 45°, row the bar to your navel." },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "8-12", rest: 90 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "10-12", rest: 60, note: "No swinging the torso." },
          { name: "Extensão de tríceps com corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Elevação de pernas suspenso", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "10-15", rest: 60 },
          { name: "Elevação de gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 3, reps: "12-15", rest: 60, note: "Pause for 1 s at the top." }
        ]
      },
      {
        name: "Full Body B",
        folder: "Full Body 3×",
        notes: "Session with more emphasis on the posterior chain.",
        exercises: [
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 3, reps: "5-6", rest: 180, note: "Bar close to the shins and a neutral spine." },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 3, reps: "8-12", rest: 90, note: "Drive with your elbows, not your hands." },
          { name: "Afundos com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90, note: "Reps per leg." },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Flexões", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60, note: "Body in a plank, don't let your hips sag." },
          { name: "Elevação de gémeos sentado na máquina", muscle: "calves", equipment: "machine", sets: 3, reps: "15-20", rest: 60 }
        ]
      },
      {
        name: "Full Body C",
        folder: "Full Body 3×",
        notes: "Last session of the week, with more isolation work.",
        exercises: [
          { name: "Agachamento frontal com barra", muscle: "quads", equipment: "barbell", sets: 3, reps: "6-8", rest: 150, note: "Elbows high to keep your torso upright." },
          { name: "Supino reto com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 120, note: "Don't arch your lower back." },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Rosca concentrada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps atrás da cabeça com haltere", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Prancha lateral", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "30-40 s", rest: 45, note: "Each side." }
        ]
      }
    ]
  },
  {
    id: "upperlower4",
    name: "Upper/Lower 4×",
    subtitle: "Upper and lower body, 4 days",
    level: "intermediate",
    days: 4,
    weeks: 10,
    focus: "Strength and hypertrophy",
    equipment: "Full gym",
    description: "Four sessions that split the body into upper and lower halves, alternating strength days with hypertrophy days. A good balance between load and volume.",
    progression: "Add 2.5 kg to the main lifts whenever you complete every set within the rep range; on accessories, add one rep per set before increasing the weight.",
    routines: [
      {
        name: "Upper A — Strength",
        folder: "Upper/Lower 4×",
        notes: "Rest 2-3 min on the first two exercises.",
        exercises: [
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 120 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 3, reps: "8-10", rest: 90 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "8-10", rest: 60 },
          { name: "Extensão de tríceps deitado com barra W", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "8-12", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 60, note: "Shoulder-health work." }
        ]
      },
      {
        name: "Lower A — Strength",
        folder: "Upper/Lower 4×",
        notes: "Mandatory 5-10 min warm-up before the squat.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Peso morto romeno com barra", muscle: "hamstrings", equipment: "barbell", sets: 3, reps: "8-10", rest: 150, note: "Push your hips back." },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 3, reps: "10-12", rest: 120 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "10-12", rest: 90 },
          { name: "Elevação de gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "10-12", rest: 60 },
          { name: "Elevação de pernas deitado", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "10-15", rest: 60 },
          { name: "Prancha frontal", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "40-50 s", rest: 45 }
        ]
      },
      {
        name: "Upper B — Hypertrophy",
        folder: "Upper/Lower 4×",
        notes: "Rest 60-90 s; focus on the mind-muscle connection.",
        exercises: [
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 120 },
          { name: "Remada baixa", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Chest press na máquina", muscle: "chest", equipment: "machine", sets: 3, reps: "10-12", rest: 90 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Rosca alternada com halteres", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps com corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Encolhimentos com halteres", muscle: "traps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Lower B — Hypertrophy",
        folder: "Upper/Lower 4×",
        notes: "Shorter, more intense session focused on quads and calves.",
        exercises: [
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 4, reps: "5-6", rest: 180, note: "Every rep starts from the floor." },
          { name: "Agachamento búlgaro com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120, note: "Reps per leg." },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos sentado na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "15-20", rest: 60 },
          { name: "Extensão lombar na máquina", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Crunch na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "ppl6",
    name: "Push Pull Legs 6×",
    subtitle: "Push, pull and legs, 6 days",
    level: "advanced",
    days: 6,
    weeks: 12,
    focus: "Hypertrophy",
    equipment: "Full gym",
    description: "Classic push, pull and legs split, repeated twice a week with different emphases. High volume, aimed at people who have been training for a while.",
    progression: "Add 2.5 kg to the compounds once you hit the top of the rep range on every set; every four weeks, add a set to the main lifts or a rep to the accessories.",
    routines: [
      {
        name: "Push A — Heavy",
        folder: "Push Pull Legs 6×",
        notes: "Heavy day on the bench press and overhead press.",
        exercises: [
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Supino inclinado com barra", muscle: "chest", equipment: "barbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Extensão de tríceps com corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps atrás da cabeça com haltere", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Elevação frontal com anilha", muscle: "shoulders", equipment: "plate", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Pull A — Heavy",
        folder: "Push Pull Legs 6×",
        notes: "Deadlift first — technique before load.",
        exercises: [
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 3, reps: "5-6", rest: 180 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 4, reps: "8-10", rest: 90 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 60 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "8-12", rest: 60 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Encolhimentos com barra", muscle: "traps", equipment: "barbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Legs A",
        folder: "Push Pull Legs 6×",
        notes: "Rest 3 min before the heavy back squat sets.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Peso morto romeno com barra", muscle: "hamstrings", equipment: "barbell", sets: 3, reps: "8-10", rest: 150 },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 3, reps: "10-12", rest: 120 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "12-15", rest: 60 },
          { name: "Crunch na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Prancha frontal", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "45-60 s", rest: 45 }
        ]
      },
      {
        name: "Push B — Volume",
        folder: "Push Pull Legs 6×",
        notes: "Moderate loads, more reps and less rest.",
        exercises: [
          { name: "Supino reto com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 150 },
          { name: "Pec deck", muscle: "chest", equipment: "machine", sets: 3, reps: "10-12", rest: 60 },
          { name: "Elevação lateral com cabo", muscle: "shoulders", equipment: "cable", sets: 4, reps: "12-15", rest: 45 },
          { name: "Flexões", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60 },
          { name: "Extensão de tríceps deitado com barra W", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps na máquina", muscle: "triceps", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Pull B — Volume",
        folder: "Push Pull Legs 6×",
        notes: "Prioritise range of motion and control on the way down.",
        exercises: [
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 4, reps: "6-8", rest: 120, note: "Use assistance if you can't reach 6 reps." },
          { name: "Remada baixa", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Puxada frontal com pegada fechada", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Rosca alternada com halteres", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca Scott com barra W", muscle: "biceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Legs B",
        folder: "Push Pull Legs 6×",
        notes: "Second leg session of the week, with more emphasis on the quads.",
        exercises: [
          { name: "Agachamento frontal com barra", muscle: "quads", equipment: "barbell", sets: 3, reps: "6-8", rest: 150 },
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 3, reps: "6-8", rest: 180 },
          { name: "Agachamento búlgaro com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 90 },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos sentado na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "15-20", rest: 45 },
          { name: "Extensão lombar na máquina", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "pushpull4",
    name: "Push Pull 4×",
    subtitle: "Push and pull, 4 days",
    level: "intermediate",
    days: 4,
    weeks: 10,
    focus: "Hypertrophy",
    equipment: "Full gym",
    description: "Two push and two pull sessions a week, alternating a heavy day with a higher-volume one. Simple to organise and easy to recover from.",
    progression: "Add 2.5 kg to barbell exercises when you hit the top of the rep range on every set, and on accessories add one rep per set before increasing the weight.",
    routines: [
      {
        name: "Push A",
        folder: "Push Pull 4×",
        notes: "Heavy chest and shoulder day.",
        exercises: [
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 150 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Extensão de tríceps com corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps atrás da cabeça com haltere", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Flexões", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60 }
        ]
      },
      {
        name: "Pull A",
        folder: "Push Pull 4×",
        notes: "Deadlift followed by vertical and horizontal pulling.",
        exercises: [
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 4, reps: "6-8", rest: 120 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "8-10", rest: 60 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Push B",
        folder: "Push Pull 4×",
        notes: "Volume session with more machines and less free weight.",
        exercises: [
          { name: "Chest press na máquina", muscle: "chest", equipment: "machine", sets: 4, reps: "8-12", rest: 90 },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 120 },
          { name: "Crossover de cabos", muscle: "chest", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação lateral com cabo", muscle: "shoulders", equipment: "cable", sets: 4, reps: "15-20", rest: 45 },
          { name: "Extensão de tríceps na máquina", muscle: "triceps", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Extensão de tríceps deitado com barra W", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Encolhimentos com halteres", muscle: "traps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Pull B",
        folder: "Push Pull 4×",
        notes: "Focus on lats and arms, with short rests.",
        exercises: [
          { name: "Remada baixa", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90 },
          { name: "Puxada frontal com pegada fechada", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Pullover no cabo", muscle: "back", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Rosca alternada com halteres", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca Scott com barra W", muscle: "biceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca inversa com barra", muscle: "forearms", equipment: "barbell", sets: 3, reps: "12-15", rest: 45 }
        ]
      }
    ]
  },
  {
    id: "stronglifts5x5",
    name: "StrongLifts 5×5",
    subtitle: "Raw strength, 3 days a week",
    level: "beginner",
    days: 3,
    weeks: 12,
    focus: "Strength",
    equipment: "Full gym",
    description: "A strength programme with two alternating sessions and an emphasis on the five basic lifts. Low volume and loads that climb linearly, session after session.",
    progression: "Add 2.5 kg each session to the squat, bench press, overhead press and row, and 5 kg to the deadlift. If you fail the same exercise twice in a row, drop back 10% and start climbing again.",
    routines: [
      {
        name: "Workout A",
        folder: "StrongLifts 5×5",
        notes: "Alternate with workout B: A-B-A one week, B-A-B the next.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 5, reps: "5", rest: 180, note: "Every set at the same weight." },
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 5, reps: "5", rest: 180 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 5, reps: "5", rest: 180 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 120, note: "Accessory to build the back." },
          { name: "Prancha frontal", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "45-60 s", rest: 60 },
          { name: "Elevação de gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Workout B",
        folder: "StrongLifts 5×5",
        notes: "The deadlift is just one set of 5 reps.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 5, reps: "5", rest: 180 },
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 5, reps: "5", rest: 180 },
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 1, reps: "5", rest: 240, note: "One set only, with perfect technique." },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 90 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "8-12", rest: 60 },
          { name: "Crunch na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "gzclp",
    name: "GZCLP",
    subtitle: "Tiered progression, 4 days",
    level: "intermediate",
    days: 4,
    weeks: 12,
    focus: "Strength and hypertrophy",
    equipment: "Full gym",
    description: "A three-tier structure (T1, T2 and T3) that pairs heavy lifts with volume work. Simple, repeatable progression that is easy to adjust.",
    progression: "On T1 do 5 sets of 3 and add 2.5 kg per week; on T2 do 3 sets of 10, and on T3 add reps up to the top of the range before increasing the weight.",
    routines: [
      {
        name: "Day 1 — T1 Squat",
        folder: "GZCLP",
        notes: "T1 = strength, T2 = base, T3 = volume. Rest 3 min on T1.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 5, reps: "3", rest: 180 },
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 3, reps: "10", rest: 120 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Remada baixa", muscle: "back", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "15", rest: 45 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Day 2 — T1 Overhead press",
        folder: "GZCLP",
        notes: "Deadlift in T2 with a moderate load and higher reps.",
        exercises: [
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 5, reps: "3", rest: 180 },
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 3, reps: "10", rest: 150 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 90 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 3, reps: "12-15", rest: 90 },
          { name: "Extensão de tríceps com corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Day 3 — T1 Bench press",
        folder: "GZCLP",
        notes: "Second squat day, now as T2.",
        exercises: [
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 5, reps: "3", rest: 180 },
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 3, reps: "10", rest: 150 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação lateral com cabo", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15", rest: 45 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Day 4 — T1 Deadlift",
        folder: "GZCLP",
        notes: "Last session of the week; save your energy for T1.",
        exercises: [
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 5, reps: "3", rest: 240 },
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "10", rest: 120 },
          { name: "Remada baixa", muscle: "back", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Puxada frontal com pegada fechada", muscle: "back", equipment: "cable", sets: 3, reps: "15", rest: 60 },
          { name: "Extensão de tríceps na máquina", muscle: "triceps", equipment: "machine", sets: 3, reps: "15", rest: 45 },
          { name: "Crunch na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "15", rest: 45 }
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
    focus: "Strength and hypertrophy",
    equipment: "Full gym",
    description: "Two strength days and two hypertrophy days, alternating upper and lower body. Combines heavy loads with moderate volume in the same week.",
    progression: "On strength days add 2.5 kg once you hit the top of the rep range; on hypertrophy days, add one rep per set and only then increase the weight.",
    routines: [
      {
        name: "Upper — Strength",
        folder: "PHUL",
        notes: "Sets of 3-5 reps with long rests.",
        exercises: [
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "3-5", rest: 180 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 4, reps: "3-5", rest: 180 },
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 3, reps: "6-8", rest: 150 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 3, reps: "6-8", rest: 120 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 3, reps: "6-8", rest: 90 },
          { name: "Extensão de tríceps deitado com barra W", muscle: "triceps", equipment: "ezbar", sets: 3, reps: "6-8", rest: 90 },
          { name: "Encolhimentos com barra", muscle: "traps", equipment: "barbell", sets: 3, reps: "8-10", rest: 90 }
        ]
      },
      {
        name: "Lower — Strength",
        folder: "PHUL",
        notes: "Squat and deadlift on the same day: keep total volume in check.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "3-5", rest: 240 },
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 4, reps: "3-5", rest: 240 },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 3, reps: "8-10", rest: 120 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "8-10", rest: 90 },
          { name: "Elevação de gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "8-10", rest: 60 },
          { name: "Crunch na máquina", muscle: "abs", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Upper — Hypertrophy",
        folder: "PHUL",
        notes: "Higher reps and 60-90 s rest.",
        exercises: [
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 120 },
          { name: "Remada baixa", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Pec deck", muscle: "chest", equipment: "machine", sets: 3, reps: "10-15", rest: 60 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Rosca alternada com halteres", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps com corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-15", rest: 60 },
          { name: "Supino no smith", muscle: "chest", equipment: "smith", sets: 3, reps: "10-12", rest: 90 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Lower — Hypertrophy",
        folder: "PHUL",
        notes: "More reps and unilateral work to iron out imbalances.",
        exercises: [
          { name: "Agachamento frontal com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "8-10", rest: 150 },
          { name: "Peso morto romeno com barra", muscle: "hamstrings", equipment: "barbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 4, reps: "10-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 4, reps: "10-15", rest: 60 },
          { name: "Agachamento búlgaro com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90, note: "Reps per leg." },
          { name: "Elevação de gémeos sentado na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "12-20", rest: 45 },
          { name: "Extensão lombar na máquina", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "brosplit5",
    name: "Bro Split 5×",
    subtitle: "One muscle group per day",
    level: "intermediate",
    days: 5,
    weeks: 10,
    focus: "Hypertrophy",
    equipment: "Full gym",
    description: "Classic split with one muscle group per session, plenty of volume per muscle and long recovery. For those who like to take every group to failure.",
    progression: "Work 1 to 2 reps shy of failure and add 2.5 kg once you hit the top of the rep range on every set; on isolations, add reps before weight.",
    routines: [
      {
        name: "Chest",
        folder: "Bro Split 5×",
        notes: "Mix up the angles: flat, incline and decline.",
        exercises: [
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Pec deck", muscle: "chest", equipment: "machine", sets: 3, reps: "10-12", rest: 60 },
          { name: "Chest press na máquina", muscle: "chest", equipment: "machine", sets: 3, reps: "10-12", rest: 90 },
          { name: "Crossover de cabos", muscle: "chest", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Flexões", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60 }
        ]
      },
      {
        name: "Back",
        folder: "Bro Split 5×",
        notes: "Start with pull-ups while you're fresh.",
        exercises: [
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 4, reps: "6-10", rest: 120 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada baixa", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Pullover no cabo", muscle: "back", equipment: "cable", sets: 3, reps: "12-15", rest: 60 },
          { name: "Encolhimentos com barra", muscle: "traps", equipment: "barbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Extensão lombar na máquina", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Shoulders",
        folder: "Bro Split 5×",
        notes: "Don't shrug on lateral raises.",
        exercises: [
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "8-10", rest: 120 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Elevação frontal com anilha", muscle: "shoulders", equipment: "plate", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação lateral com cabo", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 3, reps: "15-20", rest: 45 },
          { name: "Encolhimentos com halteres", muscle: "traps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Arms",
        folder: "Bro Split 5×",
        notes: "Alternate biceps and triceps to keep the intensity up.",
        exercises: [
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 4, reps: "8-10", rest: 60 },
          { name: "Supino fechado", muscle: "triceps", equipment: "barbell", sets: 4, reps: "8-10", rest: 90 },
          { name: "Rosca alternada com halteres", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps com corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca Scott com barra W", muscle: "biceps", equipment: "ezbar", sets: 3, reps: "10-12", rest: 60 },
          { name: "Tríceps dips nas paralelas", muscle: "triceps", equipment: "bodyweight", sets: 3, reps: "8-12", rest: 90 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Rosca inversa com barra", muscle: "forearms", equipment: "barbell", sets: 3, reps: "12-15", rest: 45 }
        ]
      },
      {
        name: "Legs",
        folder: "Bro Split 5×",
        notes: "Long session: save 3 min of rest for the squat.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "6-8", rest: 180 },
          { name: "Peso morto romeno com barra", muscle: "hamstrings", equipment: "barbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 3, reps: "10-12", rest: 120 },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Afundos com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Elevação de gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos sentado na máquina", muscle: "calves", equipment: "machine", sets: 3, reps: "15-20", rest: 45 }
        ]
      }
    ]
  },
  {
    id: "arnold6",
    name: "Arnold Split 6×",
    subtitle: "Chest and back, shoulders and arms, legs",
    level: "advanced",
    days: 6,
    weeks: 12,
    focus: "Hypertrophy",
    equipment: "Full gym",
    description: "Arnold-style six-day split, with chest and back in the same session and a dedicated shoulders-and-arms block. Very high volume, only for those who recover well.",
    progression: "Add 2.5 kg to the compounds once you hit the top of the rep range and keep isolations 1 to 2 reps shy of failure. Every three weeks, take a week at half the volume.",
    routines: [
      {
        name: "Chest and Back A",
        folder: "Arnold Split 6×",
        notes: "Optional supersets between chest and back.",
        exercises: [
          { name: "Supino reto com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 4, reps: "8-10", rest: 120 },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Remada curvada com barra", muscle: "back", equipment: "barbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Crucifixo com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Puxada frontal", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Pullover com haltere", muscle: "back", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 }
        ]
      },
      {
        name: "Shoulders and Arms A",
        folder: "Arnold Split 6×",
        notes: "Heavy day for shoulders and arms.",
        exercises: [
          { name: "Desenvolvimento militar com barra", muscle: "shoulders", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "12-15", rest: 60 },
          { name: "Rosca direta com barra", muscle: "biceps", equipment: "barbell", sets: 4, reps: "8-10", rest: 60 },
          { name: "Supino fechado", muscle: "triceps", equipment: "barbell", sets: 4, reps: "8-10", rest: 90 },
          { name: "Elevação lateral inclinado", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 45 },
          { name: "Rosca alternada com halteres", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps com corda", muscle: "triceps", equipment: "cable", sets: 3, reps: "10-12", rest: 60 },
          { name: "Rosca de punho com halteres", muscle: "forearms", equipment: "dumbbell", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Legs A",
        folder: "Arnold Split 6×",
        notes: "Heavy squat followed by posterior-chain work.",
        exercises: [
          { name: "Agachamento livre com barra", muscle: "quads", equipment: "barbell", sets: 5, reps: "6-8", rest: 180 },
          { name: "Peso morto romeno com barra", muscle: "hamstrings", equipment: "barbell", sets: 4, reps: "8-10", rest: 150 },
          { name: "Leg press", muscle: "quads", equipment: "machine", sets: 4, reps: "10-12", rest: 120 },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos em pé na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "12-15", rest: 60 },
          { name: "Elevação de gémeos sentado na máquina", muscle: "calves", equipment: "machine", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Chest and Back B",
        folder: "Arnold Split 6×",
        notes: "Different angles from workout A, with more machines.",
        exercises: [
          { name: "Supino inclinado com barra", muscle: "chest", equipment: "barbell", sets: 4, reps: "6-8", rest: 150 },
          { name: "Remada baixa", muscle: "back", equipment: "cable", sets: 4, reps: "8-10", rest: 90 },
          { name: "Pec deck", muscle: "chest", equipment: "machine", sets: 4, reps: "10-12", rest: 60 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90 },
          { name: "Supino declinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Puxada frontal com pegada fechada", muscle: "back", equipment: "cable", sets: 3, reps: "10-12", rest: 90 },
          { name: "Flexões", muscle: "chest", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 60 }
        ]
      },
      {
        name: "Shoulders and Arms B",
        folder: "Arnold Split 6×",
        notes: "More volume and less load than in workout A.",
        exercises: [
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Elevação frontal com anilha", muscle: "shoulders", equipment: "plate", sets: 4, reps: "12-15", rest: 60 },
          { name: "Rosca Scott com barra W", muscle: "biceps", equipment: "ezbar", sets: 4, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps atrás da cabeça com haltere", muscle: "triceps", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 60 },
          { name: "Face pull", muscle: "shoulders", equipment: "cable", sets: 4, reps: "15-20", rest: 45 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Tríceps dips nas paralelas", muscle: "triceps", equipment: "bodyweight", sets: 3, reps: "8-12", rest: 90 },
          { name: "Encolhimentos com halteres", muscle: "traps", equipment: "dumbbell", sets: 3, reps: "15-20", rest: 45 }
        ]
      },
      {
        name: "Legs B",
        folder: "Arnold Split 6×",
        notes: "Session with more emphasis on quads and calves.",
        exercises: [
          { name: "Agachamento frontal com barra", muscle: "quads", equipment: "barbell", sets: 4, reps: "8-10", rest: 150 },
          { name: "Peso morto convencional", muscle: "back", equipment: "barbell", sets: 4, reps: "5-6", rest: 180 },
          { name: "Agachamento búlgaro com halteres", muscle: "quads", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90, note: "Reps per leg." },
          { name: "Cadeira extensora", muscle: "quads", equipment: "machine", sets: 3, reps: "15-20", rest: 45 },
          { name: "Cadeira flexora", muscle: "hamstrings", equipment: "machine", sets: 3, reps: "15-20", rest: 45 },
          { name: "Elevação de gémeos sentado na máquina", muscle: "calves", equipment: "machine", sets: 4, reps: "15-20", rest: 45 },
          { name: "Extensão lombar na máquina", muscle: "lowerback", equipment: "machine", sets: 3, reps: "12-15", rest: 60 }
        ]
      }
    ]
  },
  {
    id: "casahalteres3",
    name: "Home Dumbbells",
    subtitle: "Minimal equipment, 3 days a week",
    level: "beginner",
    days: 3,
    weeks: 8,
    focus: "General hypertrophy",
    equipment: "Dumbbells, bench, pull-up bar and kettlebell",
    description: "A full-body programme designed for training at home with dumbbells, a bench and a pull-up bar. Simple movements and easy-to-follow progression.",
    progression: "When you hit the top of the rep range on every set, add 2 kg to each dumbbell or move to a harder variation. With no extra weight, add a set.",
    routines: [
      {
        name: "Home A",
        folder: "Home Dumbbells",
        notes: "Full session with dumbbells and bodyweight.",
        exercises: [
          { name: "Agachamento goblet", muscle: "quads", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90, note: "Dumbbell at your chest, torso upright." },
          { name: "Flexões", muscle: "chest", equipment: "bodyweight", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada unilateral com haltere", muscle: "back", equipment: "dumbbell", sets: 4, reps: "10-12", rest: 90 },
          { name: "Desenvolvimento com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 75 },
          { name: "Afundos com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 75, note: "Reps per leg." },
          { name: "Rosca alternada com halteres", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Extensão de tríceps atrás da cabeça com haltere", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Prancha frontal", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "40-60 s", rest: 45 }
        ]
      },
      {
        name: "Home B",
        folder: "Home Dumbbells",
        notes: "Use the kettlebell for posterior-chain work.",
        exercises: [
          { name: "Peso morto romeno com halteres", muscle: "hamstrings", equipment: "dumbbell", sets: 4, reps: "8-10", rest: 120 },
          { name: "Supino reto com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 90 },
          { name: "Barra fixa", muscle: "back", equipment: "bodyweight", sets: 3, reps: "AMRAP", rest: 120, note: "Use a resistance band for assistance if needed." },
          { name: "Elevação lateral com halteres", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 60 },
          { name: "Agachamento búlgaro com halteres", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 75 },
          { name: "Rosca martelo", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Tríceps dips no banco", muscle: "triceps", equipment: "bodyweight", sets: 3, reps: "10-12", rest: 60 },
          { name: "Elevação de gémeos no degrau", muscle: "calves", equipment: "bodyweight", sets: 4, reps: "15-20", rest: 45 },
          { name: "Kettlebell swing", muscle: "fullbody", equipment: "kettlebell", sets: 3, reps: "15-20", rest: 60, note: "A hip movement, not an arm movement." }
        ]
      },
      {
        name: "Home C",
        folder: "Home Dumbbells",
        notes: "Session with more shoulder and arm volume.",
        exercises: [
          { name: "Agachamento sumo com haltere", muscle: "quads", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Supino inclinado com halteres", muscle: "chest", equipment: "dumbbell", sets: 4, reps: "8-12", rest: 90 },
          { name: "Remada curvada com halteres", muscle: "back", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 90 },
          { name: "Desenvolvimento Arnold", muscle: "shoulders", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 75 },
          { name: "Elevação de gémeos com halteres", muscle: "calves", equipment: "dumbbell", sets: 3, reps: "15-20", rest: 45 },
          { name: "Rosca concentrada", muscle: "biceps", equipment: "dumbbell", sets: 3, reps: "12-15", rest: 45 },
          { name: "Extensão de tríceps deitado com halteres", muscle: "triceps", equipment: "dumbbell", sets: 3, reps: "10-12", rest: 60 },
          { name: "Abdominal bicicleta", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "20-30", rest: 45 },
          { name: "Prancha lateral", muscle: "abs", equipment: "bodyweight", sets: 3, reps: "30-40 s", rest: 45, note: "Each side." }
        ]
      }
    ]
  }
];

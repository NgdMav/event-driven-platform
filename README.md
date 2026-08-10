### Structure

```
workout-service/
├── src/main/java/com/fitplatform/workout/
│   ├── WorkoutApplication.java
│   │
│   ├── domain/
│   │   ├── program/
│   │   │   ├── Program.java
│   │   │   ├── WorkoutDay.java
│   │   │   ├── WorkoutExercise.java
│   │   │   └── ProgramStatus.java
│   │   ├── session/
│   │   │   ├── TrainingSession.java
│   │   │   └── SetLog.java
│   │   ├── progress/
│   │   │   └── ProgressSnapshot.java
│   │   ├── events/
│   │   │   ├── WorkoutSessionCompleted.java
│   │   │   └── ProgramGenerated.java
│   │   └── ports/
│   │       ├── ProgramRepository.java
│   │       ├── SessionRepository.java
│   │       └── RecommendationClient.java
│   │
│   ├── application/
│   │   ├── usecase/
│   │   │   ├── GenerateProgramUseCase.java
│   │   │   ├── StartSessionUseCase.java
│   │   │   ├── CompleteSessionUseCase.java
│   │   │   └── GetProgressSummaryUseCase.java
│   │   ├── command/
│   │   ├── query/
│   │   └── dto/
│   │
│   ├── infrastructure/
│   │   ├── persistence/
│   │   ├── messaging/
│   │   ├── clients/
│   │   └── config/
│   │
│   └── api/
│       ├── publicapi/
│       ├── internalapi/
│       └── dto/
│
└── src/test/java/...
```


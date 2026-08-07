# Project

Event-driven order processing platform.

## Stack

- Backend: Java 21
- Broker: RabbitMQ for commands, Kafka for events
- Cloud: AWS primary, Azure secondary
- Infra: Kubernetes, Helm, Terraform
- Observability: OpenTelemetry, Prometheus, Grafana

## Architecture

- Each service uses Onion / Clean Architecture.
- Domain layer must not depend on infrastructure.
- Services communicate via events and commands.
- No direct database access across service boundaries.
- All events must have schema and version.
- Consumers must be idempotent.

## Rules

- Do not store secrets in code.
- Do not change generated files manually.
- Add tests for new use cases.
- Prefer explicit contracts over magic reflection.
- Do not introduce distributed transactions.
- Use transactional outbox for publishing events.

## Commands

- build: `make build`
- test: `make test`
- lint: `make lint`
- local infra: `docker compose up -d`
- deploy local: `make deploy-local`

## Definition of Done

- Tests pass.
- Linter passes.
- Docker image builds.
- OpenAPI updated.
- Event schema updated.
- ADR added for significant changes.

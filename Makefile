.PHONY: install dev build lint test format

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

lint:
	pnpm lint

test:
	pnpm test

format:
	pnpm exec prettier --write .

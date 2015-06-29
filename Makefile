
BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
ESLINT = $(BIN)/eslint

test:
	$(MOCHA) ./test/test.js ./test/events.test.js

eslint: index.js ./test/*.js
	$(ESLINT) $^

.PHONY: test eslint

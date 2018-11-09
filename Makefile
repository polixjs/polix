ITEMS     = $(shell find test -type f -name "*.test.js")
BIN_MOCHA = ./node_modules/.bin/mocha

install:
	@npm i

eslint:
	@eslint .

test:
	@NODE_ENV=test $(BIN_MOCHA) -R spec -t 60000 --exit -r ./test/env.js $(ITEMS);

.PHONY: install test
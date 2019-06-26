.PHONY : test
CURRENT = samples/05-getting-unstuck-deg.js

test:
	node test/spherolib_test.js

build:
	./scripts/build $(CURRENT)

.PHONY : test
CURRENT = samples/05-getting-unstuck-deg.js

test:
	node test/spherolib_test.js
	node test/sound_test.js
	node test/reflectors_test.js

build:
	./scripts/build $(CURRENT)

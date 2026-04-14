.PHONY: all clean test update run build

all: build 

run:
	npm run dev

build:
	npm i	

test:
	npm run test	

update: 
	git pull
	${MAKE} build	

clean:
	rm -rf node_modules

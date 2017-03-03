MDS := $(wildcard src/*.md src/*/*.md)
HTMLS := $(MDS:.md=.html)
GENERATED_HTMLS := $(wildcard src/*.html src/*/*.html)

default: gen

%.html: %.md
	./md-to-html $< $@

gen: $(HTMLS)
	genblog src dst

clean:
	rm $(GENERATED_HTMLS)
	rm -r dst

tool:
	cd $(GOPATH)/src/github.com/xiaq/genblog; go generate; go get

publish: gen
	rsync -aLv --delete ./dst/ ul.elvish.io:elvish.io/

.PHONY: default gen tool publish clean

MDS := $(wildcard src/*.md src/*/*.md)
HTMLS := $(MDS:.md=.html)
GENERATED_HTMLS := $(wildcard src/*.html src/*/*.html)
PUBLISH_DIR := ../published/ # ul.elvish.io:elvish.io/

default: gen

%.html: %.md
	./md-to-html $< $@

gen: $(HTMLS)
	genblog -print-default-css > assets/genblog.css
	genblog src dst

clean:
	rm $(GENERATED_HTMLS)
	rm -r dst

tool:
	cd $(GOPATH)/src/github.com/xiaq/genblog; go generate; go get

publish: gen
	rsync -aLv --delete ./dst/ $(PUBLISH_DIR)

.PHONY: default gen tool publish clean

The design of elvish is driven by a philosophy consisting of a set of principles.

# The language

*   Elvish is a real, expressive programming language.

    Shells are often considered domain-specific languages (DSL), but elvish
    does not restrict itself to this notion. It embraces such concepts as
    package management, first-class functions and exceptions. Whatever you may
    find in a modern programming language is likely to be found in elvish.

    Elvish is not alone in this respect. There are multiple ongoing efforts;
    [this page](https://github.com/oilshell/oil/wiki/ExternalResources) on
    oilshell's wiki is a good reference.

*   Elvish tries to preserve and extend traditional shell programming
    techniques as much as possible:

    *   Barewords are simply strings.

    *   Prefix notation dominates, like Lisp. For example, arithmetics is done
        like `+ 10 (/ 105 5)`.

    *   Pipeline is the main tool for function composition. To make pipelines
        suitable for complex data manipulation, elvish extends them to be able
        to carry structured data (as opposed to just bytes).

    *   Output capture is the auxilary tool for function composition. Elvish
        functions may write structured data directly to the output, and
        capturing the output yields the same structured data.

# The user interface

*   The user interface is usable for most people without any customizations.

*   The user interface is entirely programmable.

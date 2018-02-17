Elvish is not an entirely new language. Its programming techniques have two
primary sources: traditional Unix shells and functional programming languages,
both dating back to many decades ago. However, the way Elvish combines those
two paradigms is unique in many ways, which enables new ways to write code.
This document gives tips on how to write idiomatic Elvish code, code that is
concise and clear, and takes full advantage of Elvish's features.

An appropriate adjective for idiomatic Elvish code, like "Pythonic" for Python
or "Rubyesque" for Ruby, is "Elven". In Roguelike games, Elven items are
high-quality, artful and reliable, and do not come in large quantities. So is
Elven code.

# Data Pipeline

Elvish is equipped with a powerful tool for passing data: the pipeline. Like
in traditional shells, it is an intuitive notation for data processing: data
flows from left to right, undergoing one transformation after another. Unlike
in traditional shells, it is not restricted to unstructured bytes: all Elvish
values, including lists, maps and even closures, can flow in the pipeline.
This section documents how to make the most use of pipelines.

## Output is Return Value

Unlike functions in most other programming languages, Elvish commands do not
have return values. Instead, they can write to the structured component of
stdout, and the caller then uses output capture to recover the output values.
Builitn commands that write to structured stdout include `put`, `splits`, and
many others:

```elvish-transcript
~> put foo
▶ foo
~> x = (put foo)
~> put $x
▶ foo
~> splits , foo,bar
▶ foo
▶ bar
~> words = [(splits , foo,bar)]
~> put $words
▶ [foo bar]
```

User-defined functions behave in the same way: they "return" values by writing
to structured stdout. Without realizing that return value and outputs are the
same in Elvish, it is easy to think of `put` as a return statement, and write
code like this:

```elvish-transcript
~> fn split-by-comma [s]{ put (splits , $s) }
~> split-by-comma foo,bar
▶ foo
▶ bar
```

The `split-by-comma` function works, but it can be written more concisely
simply as:

```elvish-transcript
~> fn split-by-comma [s]{ splits , $s }
~> split-by-comma foo,bar
▶ foo
▶ bar
```

In fact, the pattern `put (some-cmd)` is almost always redundant and
equivalent to just `some-command`.

Similarly, it is seldom necessary to write `echo (some-cmd)`: it is almost
always equivalent to just `some-cmd`. As an exercise, try simplifying the
following function:

```elvish
fn git-describe { echo (git describe --tags --always) }
```

# Introduction

The `re:` module wraps Go's [regexp](http://godoc.org/regexp) package. The Go
package doc describes syntax of regular expressions and replacement patterns.

The doc is a work in progress.

# Functions

Function usages notations follow are the same as [builtin](/ref/builtin.html)
module.

There are several options shared by the functions in this module:

*   `&posix=$false`: Use POSIX ERE syntax when true. See also
    [doc](http://godoc.org/regexp#CompilePOSIX) in Go package.

*   `&longest=$false`: Prefer leftmost-longest match. See also
    [doc](http://godoc.org/regexp#Regexp.Longest) in Go package.

*   `&max=-1`: If non-negative, maximum number of results.

## find

```elvish
re:find &posix=$false &longest=$false &max=-1 $pattern $source
```

Find all matches of `$pattern` in `$source`.

## match

```elvish
re:match &posix=$false $pattern $source
```

Determine whether `$pattern` matches `$source`. The pattern is not anchored.

## replace

```elvish
re:replace &posix=$false &longest=$false &literal=$false $pattern $repl $source
```

Replace all occurrences of `$pattern` in `$source` with `$repl`.

## split

```elvish
re:split &posix=$false &longest=$false &max=-1 $pattern $source
```

Split `$source`, using `$pattern` as separators.

## quote

```elvish
re:quote $string
```

Quote `$string`.

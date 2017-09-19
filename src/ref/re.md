# Introduction

The `re:` module wraps Go's `regexp` package. See the
[doc](http://godoc.org/regexp) for the Go package for syntax of regular
expressions and replacement patterns.

# Functions

Function usages notations follow the same convention as the [builtin module
doc](/ref/builtin.html).

The following options are supported by multiple functions in this module:

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

If '$literal' is true, '$repl' is treated as a literal string instead of a
replacement pattern.

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

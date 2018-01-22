<!-- toc -->

# Introduction

The Elvish package manager (`epm`) is a simple Elvishscript module for
managing third-party packages.

In Elvish terminology, a **module** is a `.elv` file that can be imported with
the `use` command, while a **package** is a collection of modules that are
usually kept in the same repository as one coherent project and may have
interdependencies. The Elvish language itself only deals with modules; the
concept of package of a matter of how to organize modules.

Like the `go` command, Elvish does **not** have a central registry of
packages. A package is simply identified by the URL of its code repository,
e.g. [github.com/elves/sample-pkg](https://github.com/elves/sample-pkg). To
install the package, one simply uses the following:

```elvish
use epm
epm:install github.com/elves/sample-pkg
```

After that, modules in this package can be imported with `use
github.com/elves/sample-pkg/...`. This package has a module named `sample-mod`
containing a function `sample-fn`, and can be used like:

```elvish-transcript
~> use github.com/elves/sample-pkg/sample-mod
~> sample-mod:sample-fn
This is a sample function in a sample module in a sample package
```

The rest of this article describes functions in the `epm` module, using the
same notation as the [doc for the builtin
module](builtin.html#usage-notation).

# add-installed

```elvish
epm:add-installed $pkg...
```

Add named packages to the list of installed packages (so that they can be
managed by e.g. `uninstall` or `upgrade`).

# install

```elvish
epm:install $pkg...
```

Install named packages.

# installed

```elvish
epm:installed
```

List all installed packages.

# uninstall

```elvish
epm:install $pkg...
```

Uninstall named packages.

# upgrade

```elvish
epm:upgrade $pkg...
```

Upgrade named packages. If no package name is given, upgrade all installed
packages.

Prebuilt binaries for Elvish are available for Linux and macOS on x86-64 CPUs.
The binaries are statically linked and don't have any runtime dependencies.
If you have other OS/CPU combinations, you may build Elvish from
[source](https://github.com/elves/elvish).

The download links might be too slow for users in China. Try using the
[mirror](https://mirrors.tuna.tsinghua.edu.cn/elvish) if that happens.

Please beware that **Elvish does not have a 1.0 release yet**. Before that, the
shell can be buggy, and might change dramatically from release to release.
However, the primary developer does use the HEAD version of Elvish on all his
personal and work computers, so most functions should work properly (and are
fixed quickly when they don't).

<style>
  table {
    border-collapse: collpase;
    width: 100%
  }
  td, th {
    border: 1px solid #aaa;
    text-align: left;
    padding: 0.4em;
  }
  tr:nth-child(even) {
    background-color: #ddd;
  }
</style>

<table>
  <tr>
    <th>Version</th>
    <th>Linux</th>
    <th>macOS</th>
  </tr>
  <tr>
    <td>HEAD</td>
    <td><a href="https://dl.elvish.io/elvish-linux.tar.gz">elvish-linux.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-osx.tar.gz">elvish-osx.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.10 (<a href="/blog/0.10-release-notes.html">Release Note</a>)</td>
    <td><a href="https://dl.elvish.io/elvish-0.10-linux.tar.gz">elvish-linux-0.10.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.10-osx.tar.gz">elvish-osx-0.10.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.9 (<a href="/blog/0.9-release-notes.html">Release Note</a>)</td>
    <td><a href="https://dl.elvish.io/elvish-0.9-linux.tar.gz">elvish-linux-0.9.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.9-osx.tar.gz">elvish-osx-0.9.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.8 (<a href="https://github.com/elves/elvish/releases/tag/0.8">Release Note</a>)</td>
    <td><a href="https://dl.elvish.io/elvish-0.8-linux.tar.gz">elvish-linux-0.8.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.8-osx.tar.gz">elvish-osx-0.8.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.7 (<a href="https://github.com/elves/elvish/releases/tag/0.7">Release Note</a>)</td>
    <td><a href="https://dl.elvish.io/elvish-0.7-linux.tar.gz">elvish-linux-0.7.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.7-osx.tar.gz">elvish-osx-0.7.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.6 (<a href="https://github.com/elves/elvish/releases/tag/0.6">Release Note</a>)</td>
    <td><a href="https://dl.elvish.io/elvish-0.6-linux.tar.gz">elvish-linux-0.6.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.6-osx.tar.gz">elvish-osx-0.6.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.5 (<a href="https://github.com/elves/elvish/releases/tag/0.5">Release Note</a>)</td>
    <td><a href="https://dl.elvish.io/elvish-0.5-linux.tar.gz">elvish-linux-0.5.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.5-osx.tar.gz">elvish-osx-0.5.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.4</td>
    <td><a href="https://dl.elvish.io/elvish-0.4-linux.tar.gz">elvish-linux-0.4.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.4-osx.tar.gz">elvish-osx-0.4.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.3</td>
    <td><a href="https://dl.elvish.io/elvish-0.3-linux.tar.gz">elvish-linux-0.3.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.3-osx.tar.gz">elvish-osx-0.3.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.2</td>
    <td><a href="https://dl.elvish.io/elvish-0.2-linux.tar.gz">elvish-linux-0.2.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.2-osx.tar.gz">elvish-osx-0.2.tar.gz</a></td>
  </tr>
  <tr>
    <td>0.1</td>
    <td><a href="https://dl.elvish.io/elvish-0.1-linux.tar.gz">elvish-linux-0.1.tar.gz</a></td>
    <td><a href="https://dl.elvish.io/elvish-0.1-osx.tar.gz">elvish-osx-0.1.tar.gz</a></td>
  </tr>
</table>

# OS-Specific Packages

## RPM Package

RPM Package for Fedora is available in [FZUG Repo](https://github.com/FZUG/repo/wiki/Add-FZUG-Repository).

Instructions:

```elvish
# Add FZUG repo
dnf config-manager --add-repo=http://repo.fdzh.org/FZUG/FZUG.repo
# Install Elvish
dnf install elvish
```

## DEB Package

Users of [Ubuntu](http://packages.ubuntu.com/elvish)(>= 17.10) and
[Debian](https://packages.debian.org/elvish)(>= 10) can install Elvish from
official repository. You can just run `sudo apt install elvish` to install.
(Note: This is likely to not give you the latest version.)

If you want to keep updated to the latest version, or are using older
distributions or other derivatives, you can always install from
[PPA](https://launchpad.net/~zhsj/+archive/ubuntu/elvish).

```elvish
# Add Elvish PPA repo
sudo wget -O /etc/apt/trusted.gpg.d/elvish \
  'https://sks-keyservers.net/pks/lookup?search=0xE9EA75D542E35A20&options=mr&op=get'
sudo gpg --dearmor /etc/apt/trusted.gpg.d/elvish
sudo rm /etc/apt/trusted.gpg.d/elvish
echo 'deb http://ppa.launchpad.net/zhsj/elvish/ubuntu xenial main' |
  sudo tee /etc/apt/sources.list.d/elvish.list
sudo apt-get update

# Install Elvish
sudo apt-get install elvish
```

(This is a script for bash or zsh. If you are running from Elvish, replace the
trailing backslash `\` with a backquote `` ` ``.)

## Homebrew Package

Users of [Homebrew](http://brew.sh) can build Elvish with:

```elvish
# Remove --HEAD for latest release
brew install --HEAD elvish
```

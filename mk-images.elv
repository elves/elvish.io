#!/usr/bin/env elvish
pwd = assets
for f [*-2x.png] {
    stem = $f[:-7]
    gm convert -resize 50% $f $stem'.png'
    gm convert -resize 75% $f $stem'-1.5x.png'
}

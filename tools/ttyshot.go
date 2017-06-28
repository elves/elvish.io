package main

import (
	"bufio"
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"
)

const directive = "$ttyshot "

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := scanner.Text()
		i := strings.Index(line, directive)
		if i >= 0 {
			name := line[i+len(directive):]
			bytes, err := ioutil.ReadFile(path.Join("tty", name+".html"))
			if err != nil {
				log.Fatal(err)
			}
			os.Stdout.WriteString(line[:i])
			os.Stdout.WriteString(`<pre class="ttyshot"><code>`)
			os.Stdout.Write(bytes)
			os.Stdout.WriteString("</code></pre>")
		} else {
			os.Stdout.WriteString(line)
		}
		os.Stdout.WriteString("\n")
	}
}

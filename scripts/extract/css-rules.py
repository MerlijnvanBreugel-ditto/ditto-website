"""Print the live CSS rules for a Framer layer and its descendants.

Usage: python3 css-rules.py <desktop|tablet|phone> "<data-framer-name>" [depth] [nth]
Reads the rendered DOM saved by snapshot.mjs (.cache/live/<bp>.html). Framer puts the
breakpoint overrides in the same stylesheet, so a layer can have several rules.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

bp, name = sys.argv[1], sys.argv[2]
depth = int(sys.argv[3]) if len(sys.argv) > 3 else 0
nth = int(sys.argv[4]) if len(sys.argv) > 4 else 0
html = (Path(__file__).resolve().parents[2] / ".cache/live" / f"{bp}.html").read_text()
css = " ".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S))


def parse(text):
    """Flatten the stylesheet into (media, rule) pairs, keeping each rule's @media context."""
    out, stack, start, depth = [], [], 0, 0
    for i, ch in enumerate(text):
        if ch == "{":
            prelude = text[start:i].strip()
            if prelude.startswith("@"):
                stack.append((depth, prelude))
                start = i + 1
            depth += 1
        elif ch == "}":
            depth -= 1
            if stack and stack[-1][0] == depth:
                stack.pop()
                start = i + 1
            elif not stack or depth > stack[-1][0]:
                media = " and ".join(p for _, p in stack if p.startswith("@media"))
                out.append((media, text[start : i + 1].strip()))
                start = i + 1
    return out


rules = parse(css)


class Walker(HTMLParser):
    VOID = {"img", "br", "hr", "input", "meta", "link", "source", "path", "circle", "rect", "line", "polyline", "polygon", "use", "stop"}

    def __init__(self):
        super().__init__()
        self.stack, self.found, self.hits, self.out = [], None, 0, []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.found is None and a.get("data-framer-name") == name:
            if self.hits == nth:
                self.found = len(self.stack)
            self.hits += 1
        if self.found is not None and len(self.stack) - self.found <= depth:
            self.out.append((len(self.stack) - self.found, tag, a.get("data-framer-name", ""), a.get("class", "")))
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in self.VOID or not self.stack:
            return
        self.stack.pop()
        if self.found is not None and len(self.stack) <= self.found:
            self.found = -10**9  # done


w = Walker()
w.feed(html)
for level, tag, fname, classes in w.out:
    print("  " * level + f"<{tag}> {fname}")
    for c in classes.split():
        if not c.startswith("framer-") or c.startswith("framer-v-") or len(c) < 12:
            continue
        for media, r in rules:
            if re.search(r"\." + re.escape(c) + r"(?![\w-])", r.split("{")[0]):
                where = media.replace("@media ", "").replace("(min-width: ", ">=").replace("(max-width: ", "<=").replace("px)", "") or "all"
                print("  " * level + f"   [{where}] " + r[:1500])

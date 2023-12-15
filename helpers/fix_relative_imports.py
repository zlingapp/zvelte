import os, time
import re

regex = re.compile('.*from "(.*)";?')

fixed = []
skipped = []

def descend(p):
    for entry in os.listdir(p):
        curfile = os.path.join(p, entry)

        if os.path.isdir(curfile):
            descend(curfile)
        elif entry.endswith(".svelte") or entry.endswith(".ts"):
            lines = []
            with open(curfile, "r+") as f:
                lines = f.readlines()
                
                try:
                    if entry.endswith(".svelte"):
                        end = [l.rstrip() for l in lines].index("</script>")
                    else:
                        end = len(lines)
                except ValueError:
                    skipped.append(curfile)
                    continue

                need_write = False

                for i in range(end):
                    line = lines[i]
                    if "from \"" in line and "./" in line:
                        match = regex.match(line)
                        if match:
                            rel = match.group(1)
                            if rel.startswith("./"):
                                rel = rel[2:]

                            abspath = os.path.abspath(os.path.join("/" + p, rel)).lstrip("/")
                            lines[i] = line.replace(match.group(1), abspath)

                            need_write = True

            if need_write:
                fixed.append(curfile)
                with open(curfile, "w+") as f:
                    f.writelines(lines)
            else:
                skipped.append(curfile)

print('Finding and fixing any relative imports...')

s = time.time()
descend("./src")
elapsed = time.time() - s

if len(fixed) > 0:
    print("Fixed imports in:")
    for f in fixed:
        print(" *", f)
    print()

print(f"Done in {elapsed * 1000:.2f}ms")
print(f'Altered: {len(fixed)} source files')
print(f"Skipped: {len(skipped)} source files")
import sys
with open("/var/www/namaweb/public/js/pcc-catalog-ui.js") as f:
    lines = f.read().split("\n")
depth = 0
for i, line in enumerate(lines, 1):
    new_depth = depth + line.count("{") - line.count("}")
    if new_depth < 0:
        print(f"L{i} depth went negative ({depth} -> {new_depth}):")
        print(line[:100])
        break
    depth = new_depth
print(f"Final depth: {depth}")

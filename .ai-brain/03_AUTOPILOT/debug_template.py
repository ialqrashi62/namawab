#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Debug: extract STATION_TEMPLATE body and check pattern.
"""
import sys
import io
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

content = open('.ai-brain/03_AUTOPILOT/nm-station-generator.py', encoding='utf-8').read()

# Find STATION_TEMPLATE
start = content.find('STATION_TEMPLATE = """')
end = content.find('"""', start + 25)
body = content[start + 22:end]

# Check for the placeholder
idx = body.find('{code_short_pascal}')
print('Index of {code_short_pascal}:', idx)
if idx >= 0:
    print('Context:', repr(body[max(0,idx-30):idx+50]))

# Try str.replace
result = body.replace('{code_short_pascal}', 'Cardiology')
print('After replace, search Cardiology:', 'CardiologyStation' in result)
print('After replace, search leftover:', '{code_short_pascal}' in result)

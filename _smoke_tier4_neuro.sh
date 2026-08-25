#!/bin/bash
for p in neurostr neuroepi neuroms neuromv neurohd neurodm neuroim neuronm; do
  echo "--- $p health ---"
  curl -s -m 5 http://127.0.0.1:3000/api/${p}/health
  echo
done

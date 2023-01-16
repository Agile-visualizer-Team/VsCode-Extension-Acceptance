#! /usr/bin/python3 

import sys
import json

path_file = sys.argv[1]
new = sys.argv[2]

with open(path_file) as f:
   data = json.load(f)

data["name"] = new 

with open(path_file, "w") as f:
    f.write(json.dumps(data))


#! /usr/bin/python3 

import sys
import json

path_file = sys.argv[1]
new_organization_name = "@agilevisualizerteam/visualizer-asp" 

with open(path_file) as f:
   data = json.load(f)

data["name"] = new_organization_name 

with open(path_file, "w") as f:
    f.write(json.dumps(data))


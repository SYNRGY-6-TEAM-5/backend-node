import json
import os
import random

# Get the directory path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
input_file_path = os.path.join(current_dir, './output/depart_out.json')
output_file_path = os.path.join(current_dir, './done/depart_out.json')

# Load data from data.json
# Load the JSON data from the file
with open(input_file_path) as file:
    data = json.load(file)

# Transform data
selected_data = data[:100]

# Write transformed data to a new file
with open(output_file_path, 'w') as output_file:
    json.dump(selected_data, output_file, indent=4)

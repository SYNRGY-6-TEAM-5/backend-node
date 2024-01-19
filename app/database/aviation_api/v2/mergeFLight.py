import json
import os
import random

# Get the directory path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
input_file_path_one = os.path.join(current_dir, 'flight1.json')
input_file_path_two = os.path.join(current_dir, 'flight2.json')
output_file_path = os.path.join(current_dir, './output/flight_out.json')

# Load data from data.json
# Load the JSON data from the file
with open(input_file_path_one) as file:
    data1 = json.load(file)

# Read data from second flight.json
with open(input_file_path_two, 'r') as file:
    data2 = json.load(file)

# Merge flight data from both files
merged_flight = []
for item1 in data1['flight']:
    for item2 in data2['flight']:
        merged_item = {**item1, **item2}
        merged_flight.append(merged_item)

# Write merged data to merged.json
with open(output_file_path, 'w') as file:
    json.dump({"flight": merged_flight}, file, indent=2)

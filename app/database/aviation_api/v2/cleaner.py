import json
import os

# Get the directory path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
input_file_path = os.path.join(current_dir, 'flight.json')
with open(input_file_path) as file:
    data = json.load(file)

# Function to remove 'codeshared' key from each object in the 'flight' array
def remove_codeshared(arr):
    for obj in arr:
        if 'codeshared' in obj:
            del obj['codeshared']

# Remove 'codeshared' key from the 'flight' array
if 'flight' in data:
    remove_codeshared(data['flight'])

# Write updated data back to the file
with open(input_file_path, 'w') as file:
    json.dump(data, file, indent=2)

import json
import os
import random

# Get the directory path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
input_file_path = os.path.join(current_dir, 'non_obj_output.json')
output_file_path = os.path.join(current_dir, './output/merged_out.json')

# Load data from data.json
# Load the JSON data from the file
with open(input_file_path) as file:
    data = json.load(file)

# Extract flight_status and flight_date lists
flight_status = data.get('flight_status', [])
flight_date = data.get('flight_date', [])

# Create flight list with flight_status and flight_date
flight = [{"flight_status": status, "flight_date": date} for status, date in zip(flight_status, flight_date)]

# Write to output.json
with open(output_file_path, 'w') as file:
    json.dump({"flight": flight}, file, indent=2)
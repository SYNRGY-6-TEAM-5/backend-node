import json
import os

# Get the directory path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
input_file_path = os.path.join(current_dir, './airport.json')
input2_file_path = os.path.join(current_dir, './city.json')
output_file_path = os.path.join(current_dir, './output/airport_out.json')

# Load data from airport.json
with open(input_file_path) as file:
    data = json.load(file)

# Load data from city.json
with open(input2_file_path) as file:
    data2 = json.load(file)

# Ensure both lists have the same length
min_length = min(len(data["airports"]), len(data2["cities"]))

# Transform data
transformed_data = []
for airport, city in zip(data["airports"][:min_length], data2["cities"][:min_length]):
    transformed_item = {
        "airport_name": airport["airport_name"],
        "iata_code": airport["iata_code"],
        "gmt": airport["gmt"],
        "city_name": city["city_name"],
        "city_iata_code": airport["city_iata_code"],
        "country_name": airport["country_iso2"],
        "country_iso_code": airport["country_name"],
        "created_at": "2023-12-09T09:05:20.986Z",
        "updated_at": None
    }
    transformed_data.append(transformed_item)

# Write transformed data to a new file
with open(output_file_path, 'w') as output_file:
    json.dump(transformed_data, output_file, indent=4)

print(f'Successfully created {output_file_path}')

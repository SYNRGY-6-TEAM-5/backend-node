import json
import os
import random

# Get the directory path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
input_file_path = os.path.join(current_dir, './airline.json')
output_file_path = os.path.join(current_dir, './output/airline_out.json')

# Load data from data.json
# Load the JSON data from the file
with open(input_file_path) as file:
    data = json.load(file)

# Transform data
transformed_data = []
for i, airline in enumerate(data["airline"]):
    transformed_item = {
            "name": airline["name"],
            "iata": airline["iata"],
            "image": "https://res.cloudinary.com/ddpriosuk/image/upload/v1694179155/icon_24hrs_bmttbd.png",
            "created_at": "2023-12-09T09:05:20.986Z",
            "updated_at": None
            # "country_name": airport["country_iso2"],
            # "country_iso_code": airport["country_name"],
            # "flight_status": arrival["flight_status"],
            # "flight_number": arrival["flight_number"],
            # "iata": arrival["iata"],
            # "created_at": "2023-12-09T09:05:20.986Z",
            # "updated_at": None
        }
    transformed_data.append(transformed_item)

# Write transformed data to a new file
with open(output_file_path, 'w') as output_file:
    json.dump(transformed_data, output_file, indent=4)

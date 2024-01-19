import random
from datetime import datetime, timedelta
import json
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
output_file_path = os.path.join(current_dir, './live_tracking.json')

# Function to generate a random date string within a range
def random_date(start, end):
    delta = end - start
    random_days = random.randint(0, delta.days)
    random_hours = random.randint(0, 24)
    random_minutes = random.randint(0, 60)
    random_seconds = random.randint(0, 60)
    return start + timedelta(days=random_days, hours=random_hours, minutes=random_minutes, seconds=random_seconds)

# Start and end dates for random date generation
start_date = datetime(2023, 1, 1)
end_date = datetime(2024, 12, 31)

# Generate 100 objects
array_of_objects = []
for i in range(100):
    aircraft_object = {
        "aircraft_id": i + 1,  # Incrementing aircraft_id from 1 to 100
        "updated": random_date(start_date, end_date).isoformat(),
        "latitude": round(random.uniform(-90, 90), 4),
        "longitude": round(random.uniform(-180, 180), 4),
        "altitude": round(random.uniform(0, 40000), 1),
        "direction": random.randint(0, 360),
        "speed_horizontal": round(random.uniform(0, 1000), 3),
        "speed_vertical": round(random.uniform(0, 100), 3),
        "is_ground": random.choice([True, False]),
        "created_at": datetime.utcnow().isoformat()  # Assuming current timestamp
    }
    array_of_objects.append(aircraft_object)

with open(output_file_path, 'w') as outfile:
    json.dump(array_of_objects, outfile, indent=2)

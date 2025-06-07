import os
import json
import pandas as pd
from datetime import datetime

# Read from environment
title = os.getenv("ISSUE_TITLE", "Untitled").replace(" ", "_").replace("/", "_")
body = os.getenv("ISSUE_BODY", "")

# Timestamp
timestamp = datetime.utcnow().strftime("%Y-%m-%d")

# Define file paths
json_path = f"data/{timestamp}_{title}.json"
xlsx_path = f"data/{timestamp}_{title}.xlsx"

# Save to JSON
issue_data = {"title": title, "body": body}
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(issue_data, f, ensure_ascii=False, indent=2)

# Save to Excel
df = pd.DataFrame([issue_data])
df.to_excel(xlsx_path, index=False)

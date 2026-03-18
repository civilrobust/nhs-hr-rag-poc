import sys

# Read the file
with open('api.py', 'r') as f:
    content = f.read()

# Replace the buggy line
old_line = '        "policies_loaded": len([f for f in rag.client.list_collections()]),'
new_line = '        "policies_loaded": rag.num_documents,'

content = content.replace(old_line, new_line)

# Write it back
with open('api.py', 'w') as f:
    f.write(content)

print("✅ Fixed stats endpoint!")

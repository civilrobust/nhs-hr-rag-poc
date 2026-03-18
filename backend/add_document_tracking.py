with open('rag_pipeline.py', 'r') as f:
    lines = f.readlines()

# Find where to add the variable (after self.collection is created)
new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    # After creating collection, add num_documents = 0
    if 'self.collection = self.client.get_or_create_collection' in line:
        new_lines.append('        self.num_documents = 0\n')
    # After loading each file, increment counter
    if 'print(f"  ✅ {filename}: {len(chunks)} chunks")' in line:
        # Add increment before the print
        new_lines.insert(-1, '            self.num_documents += 1\n')

with open('rag_pipeline.py', 'w') as f:
    f.writelines(new_lines)

print("✅ Added document tracking!")

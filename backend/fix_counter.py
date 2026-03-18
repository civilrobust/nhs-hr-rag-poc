with open('rag_pipeline.py', 'r') as f:
    content = f.read()

# Remove the increment from load_policies (it's redundant)
content = content.replace('            # Track document count\n            self.num_documents += 1\n', '')

# Always count files at the end of __init__
old_init_end = '''        else:
            # Count documents from existing collection metadata
            policy_files = glob.glob(f"{self.policies_dir}/*.txt")
            self.num_documents = len(policy_files)'''

new_init_end = '''        else:
            # Count documents from existing collection metadata
            policy_files = glob.glob(f"{self.policies_dir}/*.txt")
            self.num_documents = len(policy_files)
        
        # Always set correct count after loading
        policy_files = glob.glob(f"{self.policies_dir}/*.txt")
        self.num_documents = len(policy_files)'''

content = content.replace(old_init_end, new_init_end)

with open('rag_pipeline.py', 'w') as f:
    f.write(content)

print("✅ Fixed document counter!")

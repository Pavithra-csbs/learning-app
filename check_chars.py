import sys

files = [
    r'c:\Users\mirun\OneDrive\Desktop\learning_platform\frontend\src\App.jsx',
    r'c:\Users\mirun\OneDrive\Desktop\learning_platform\frontend\src\pages\ChapterLevels.jsx',
    r'c:\Users\mirun\OneDrive\Desktop\learning_platform\frontend\src\pages\EyeBossBattle.jsx',
    r'c:\Users\mirun\OneDrive\Desktop\learning_platform\frontend\src\pages\CircuitBuilder.jsx'
]

for file_path in files:
    print(f"Checking {file_path}...")
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            for i, byte in enumerate(content):
                if byte > 127:
                    # Just print first 10 for each file to avoid flood
                    pass
            # Count them
            non_ascii = [b for b in content if b > 127]
            if non_ascii:
                print(f"Total non-ASCII characters in {file_path}: {len(non_ascii)}")
            else:
                print(f"No non-ASCII characters found in {file_path}.")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

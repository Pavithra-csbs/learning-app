try:
    with open('error.log', 'rb') as f:
        content = f.read()
    # Try decoding as UTF-16LE, if that fails, try others
    try:
        text = content.decode('utf-16le')
    except:
        text = content.decode('utf-8', errors='ignore')
    
    lines = text.splitlines()
    for line in lines[-20:]:
        print(line)
except Exception as e:
    print(f"Error reading log: {e}")



def load_key(key_path='encryption_key.key'):
    try:
        with open(key_path, 'rb') as key_file:
            key = key_file.read()
        print(f"Key loaded successfully from {key_path}")
        return key
    except FileNotFoundError:
        print(f"Key file not found : {key_path}")
    except Exception as e:
        print(f"Error loading key: {e}")
        return None

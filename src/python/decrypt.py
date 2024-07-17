import os
import logging
import shutil
from cryptography.fernet import Fernet, InvalidToken

viper_village_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

# create a logs directory inside the noname directory if it doesn't exist
log_directory = os.path.join(viper_village_directory, 'logs')
if not os.path.exists(log_directory):
    os.makedirs(log_directory)
log_file = os.path.join(log_directory, 'decryption_log.log')

# configure the logging module
logging.basicConfig(filename=log_file, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# load the encryption key from the key file
def load_key(key_path='encryption_key.key'):
    try:
        with open(key_path, 'rb') as key_file:
            key = key_file.read()
        logging.info(f"Key successfully loaded from {key_path}")
        return key
    except FileNotFoundError:
        logging.error(f"Key file not found: {key_path}")
    except Exception as e:
        logging.error(f"Error loading key: {e}")
        return None

# decrypt a file using the provided cipher suite and move it to the destination folder
def decrypt_file(encrypted_file_path, cipher_suite, destination_folder):
    try:
        with open(encrypted_file_path, 'rb') as f:
            encrypted_data = f.read()
        decrypted_data = cipher_suite.decrypt(encrypted_data)
        decrypted_file_path = encrypted_file_path.rsplit('.encrypted', 1)[0]
        decrypted_file_name = os.path.basename(decrypted_file_path)
        destination_file_path = os.path.join(destination_folder, decrypted_file_name)

        with open(destination_file_path, 'wb') as f:
            f.write(decrypted_data)
        os.remove(encrypted_file_path)
        logging.info(f"Decrypted and moved: {encrypted_file_path} to {destination_file_path}")
    except FileNotFoundError:
        logging.error(f"File not found: {encrypted_file_path}")
    except InvalidToken:
        logging.error(f"Invalid token for file: {encrypted_file_path}. Wrong key or corrupted file.")
    except Exception as e:
        logging.error(f"Decryption failed for {encrypted_file_path}: {e}")

# decrypt all files in a folder using the provided cipher suite
def decrypt_folder(folder_path, destination_folder, cipher_suite):
    for dirpath, _, filenames in os.walk(folder_path):
        for filename in filenames:
            if filename.endswith('.encrypted'):
                encrypted_file_path = os.path.join(dirpath, filename)
                decrypt_file(encrypted_file_path, cipher_suite, destination_folder)

if __name__ == "__main__":
    # decrypt files in the encrypted folder
    encrypted_folder = os.path.join(os.path.expanduser('~'), 'Downloads', 'encrypted')
    downloads_folder = os.path.join(os.path.expanduser('~'), 'Downloads')
    # load the encryption key
    key = load_key()
    if key:
        # if the key is loaded, create a cipher suite and decrypt the files
        cipher_suite = Fernet(key)
        decrypt_folder(encrypted_folder, downloads_folder, cipher_suite)
        # shutil.rmtree(encrypted_folder) # uncomment to delete the encrypted folder
        logging.info("Encrypted folder deleted.")
    else:
        # if the key is not loaded, log an error
        logging.error("Decryption key not loaded. Stopping.")
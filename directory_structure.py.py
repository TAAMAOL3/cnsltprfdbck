import os

def create_directory_structure(path, ignore_dirs=None):
    output_lines = []

    for root, dirs, files in os.walk(path):
        # Bereinigen der Ordner, die ignoriert werden sollen
        if ignore_dirs:
            dirs[:] = [d for d in dirs if d not in ignore_dirs]

        # Ordnerstruktur im richtigen Format hinzufügen
        level = root.replace(path, '').count(os.sep)
        indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
        output_lines.append(f"{indent}{os.path.basename(root)}/")

        # Hinzufügen von Dateien, die den Bedingungen entsprechen
        for file in files:
            if file.endswith(('.js', '.css', '.html', '.scss')):
                subindent = '│   ' * level + '├── '
                output_lines.append(f"{subindent}{file}")

    return output_lines

def extract_code_from_files(path, ignore_dirs=None):
    code_output = []

    for root, dirs, files in os.walk(path):
        if ignore_dirs:
            dirs[:] = [d for d in dirs if d not in ignore_dirs]

        for file in files:
            if file.endswith(('.js', '.css', '.html', '.scss')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        code = f.read()
                    code_output.append(f"***{file}:\n{code}\n_____")
                except (UnicodeDecodeError, PermissionError) as e:
                    print(f"Error reading {file_path}: {e}")

    return code_output

def write_output_to_file(directory_structure, code_blocks, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for line in directory_structure:
            f.write(line + '\n')
        f.write('\n\n')
        for block in code_blocks:
            f.write(block + '\n')

if __name__ == '__main__':
    search_path = r'C:\Users\Oli\Documents\consultprofeedback'
    output_file = 'consultprofeedback_sourcecode.txt'
    ignore_dirs = ['node_modules', 'build', '.git']

    directory_structure = create_directory_structure(search_path, ignore_dirs)
    code_blocks = extract_code_from_files(search_path, ignore_dirs)
    write_output_to_file(directory_structure, code_blocks, output_file)

    print(f"Output written to {output_file}")

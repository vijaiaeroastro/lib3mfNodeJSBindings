import ast
import click
import re
from graphviz import Digraph

class ClassAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.classes = []

    def visit_ClassDef(self, node):
        # Extract the class name and its base classes (inheritance)
        class_name = node.name
        base_classes = [base.id for base in node.bases if isinstance(base, ast.Name)]
        self.classes.append((class_name, base_classes))
        # Continue visiting the class body
        self.generic_visit(node)

def analyze_python_script(file_path):
    with open(file_path, "r") as file:
        tree = ast.parse(file.read(), filename=file_path)

    analyzer = ClassAnalyzer()
    analyzer.visit(tree)

    return analyzer.classes

def analyze_node_header(file_path):
    classes = {}
    with open(file_path, "r") as file:
        for line in file:
            class_match = re.match(r'class (\w+)\s*:\s*public\s*(\w+)', line)
            if class_match:
                class_name = class_match.group(1)
                base_class = class_match.group(2)
                classes[class_name] = base_class
    return classes

def visualize_classes(classes, output_format='pdf'):
    dot = Digraph(comment='Class Inheritance Tree')

    for class_name, base_classes in classes:
        if base_classes:
            for base in base_classes:
                dot.edge(base, class_name)  # Draw an edge from base class to derived class
        else:
            dot.node(class_name)  # If no base class, just add the class as a standalone node

    # Render the tree
    dot.render('class_inheritance_tree', format=output_format)
def find_mismatched_inheritance(python_classes, node_classes):
    mismatches = []
    
    for class_name, base_classes in python_classes:
        # Prefix class name with 'CLib3MF' for Node.js comparison
        node_class_name = f"CLib3MF{class_name}"
        
        # Prefix all base classes with 'CLib3MF' for comparison
        base_classes = [f"CLib3MF{base}" for base in base_classes]
        
        # Handle special case: 'Base' in Python -> 'CLib3MFBaseClass' in Node.js
        base_classes = ['CLib3MFBaseClass' if base == 'CLib3MFBase' else base for base in base_classes]
        
        if node_class_name in node_classes:
            node_base_class = node_classes[node_class_name]
            if base_classes and node_base_class not in base_classes:
                mismatches.append((class_name, base_classes, node_base_class))
    
    return mismatches

@click.command()
@click.argument('python_file', type=click.Path(exists=True))
@click.argument('node_file', type=click.Path(exists=True))
@click.option('--diagram', is_flag=True, help="Generate inheritance diagram.")
@click.option('--format', default='pdf', help="Format for diagram (e.g., pdf, png).")
def cli(python_file, node_file, diagram, format):
    """Analyze a Python and Node.js script for class inheritance."""
    
    # Analyze Python script
    python_classes = analyze_python_script(python_file)
    
    # Analyze Node.js wrapper header
    node_classes = analyze_node_header(node_file)
    
    # Find mismatches in inheritance
    mismatches = find_mismatched_inheritance(python_classes, node_classes)
    
    if mismatches:
        print("Mismatches found in class inheritance:")
        for class_name, py_bases, node_base in mismatches:
            print(f"Class: {class_name}, Python Base: {py_bases}, Node.js Base: {node_base}")
    else:
        print("No mismatches found.")

    # If the diagram flag is set, generate a diagram
    if diagram:
        visualize_classes(python_classes, format)
        print(f"Class inheritance tree generated and saved as 'class_inheritance_tree.{format}'")

if __name__ == "__main__":
    cli()
